import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../webpage/components/Pagination";
import Button from "../../webpage/components/Button";
import ArrowUpCircle from "../../webpage/components/ArrowUpCircle";
import ChatListPanel from "../../webpage/components/ChatListPanel";
import styles from "./Market.module.css";

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";
const PAGE_SIZE = 9;

function toAbs(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API}${url}`;
}

export default function Market({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const [login, setLogin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const [showChat, setShowChat] = useState(false);

  // 세션 체크
  useEffect(() => {
    (async () => {
      try {
        setChecking(true);
        const r = await fetch(`${API}/api/check`, { credentials: "include" });
        const d = await r.json();
        setLogin(!!d?.loggedIn);
      } catch {
        setLogin(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // 개별 위시리스트 전체 로드
  const loadWishlist = async () => {
    try {
      const r = await fetch(`${API}/api/me/wishlist`, {
        credentials: "include",
      });
      if (!r.ok) {
        setWishlistIds(new Set());
        return;
      }
      const list = await r.json();
      setWishlistIds(new Set(list.map((it) => it.id ?? it.listing_id)));
    } catch {
      setWishlistIds(new Set());
    }
  };

  // 목록 로드 (로그인일 땐 liked 플래그 포함)
  const loadPage = async (p = 1) => {
    const qs = new URLSearchParams({
      page: String(p),
      size: String(PAGE_SIZE),
    });
    if (search.trim()) qs.set("q", search.trim());
    if (login) qs.set("with_liked", "1"); // ✅ 로그인 시 liked 요청

    const r = await fetch(`${API}/api/market/listings?${qs}`, {
      credentials: "include",
    });
    if (!r.ok) throw new Error("listings fetch failed");

    const data = await r.json();
    const items = data.items || [];

    setProducts(
      items.map((x) => ({
        id: x.id,
        title: x.title,
        price: Number(x.unit_price ?? 0),
        variety: x.variety || "",
        category: x.category || "",
        location: x.location || "",
        thumb: toAbs(x.thumbnail),
      }))
    );
    setTotalPages(Math.max(1, Number(data.pages || 1)));

    // ✅ 서버가 내려준 liked로 현재 페이지의 하트 상태 동기화
    if (login) {
      const likedIds = new Set(items.filter((it) => it.liked).map((it) => it.id));
      // 페이지 이동 시 깔끔하게 현재 페이지 기준으로만 세팅
      setWishlistIds(likedIds);
    }
  };

  // 페이지 바뀔 때 목록 로드
  useEffect(() => {
    loadPage(page).catch(console.error);
    // 로그인 여부는 별도 useEffect에서 처리 (아래)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]); // 검색 시에도 현재 1페이지를 다시 호출

  // ✅ 로그인 상태가 바뀌면: liked 포함해서 현재 페이지 재로딩 + 위시리스트 싱크
  useEffect(() => {
    if (login) {
      loadPage(page).catch(console.error);
      loadWishlist();
    } else {
      setWishlistIds(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  const handleWriteClick = () => navigate("/sellingpost");
  const handleProductClick = (id) => navigate(`/detail/${id}`);

  const openChatPanel = () => {
    if (!login) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    setShowChat(true);
  };

  const handleChatClick = async (p) => {
    if (!login) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    const listingId = p?.id;
    if (!listingId) {
      alert("상품 ID가 없습니다.");
      return;
    }
    const payload = {
      id: listingId,
      title: p?.title || p?.variety || p?.category || "상품명",
      description: "",
      unit_price: p?.price ?? 0,
      image: p?.thumb || "/images/sample-product.jpg",
    };

    try {
      const res = await fetch(`${API}/api/market/listings/${listingId}/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      if (!res.ok || !data?.id) {
        if (data?.error === "seller_cannot_open_as_buyer") {
          alert("판매자는 자신의 상품으로 채팅을 시작할 수 없습니다.");
        } else {
          alert(data?.error || data?.message || "채팅방 생성에 실패했습니다.");
        }
        return;
      }
      navigate(`/chat/${data.id}`, { state: { product: payload } });
    } catch (e) {
      console.error(e);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  const toggleWish = async (id) => {
    if (!login) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    const wished = wishlistIds.has(id);
    try {
      const url = `${API}/api/me/wishlist/${id}`;
      const r = await fetch(url, {
        method: wished ? "DELETE" : "POST",
        credentials: "include",
      });
      if (!r.ok) throw new Error("wishlist toggle failed");

      // ✅ 즉시 UI 반영
      const next = new Set(wishlistIds);
      wished ? next.delete(id) : next.add(id);
      setWishlistIds(next);
    } catch (e) {
      alert("찜 처리 중 오류가 발생했습니다.");
    }
  };

  const effectiveLoggedIn = useMemo(
    () => (typeof isLoggedIn === "boolean" ? isLoggedIn : login),
    [isLoggedIn, login]
  );

  if (checking) return null;

  return (
    <>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}></div>
      <div className={styles.pageWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.leftButtons}>
            <button className={styles.topButton} onClick={handleWriteClick}>
              + 글쓰기
            </button>

            <button
              className={`${styles.topButton} ${styles.active}`}
              onClick={openChatPanel}
            >
              채팅
            </button>

            <div className={styles.searchContainer}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setPage(1)}
              />
              <button
                className={styles.sendButton}
                onClick={() => setPage(1)}
              >
                <ArrowUpCircle size={32} />
              </button>
            </div>
          </div>

          <div className={styles.productCardsParent}>
            {products.length ? (
              products.map((p) => (
                <div
                  className={styles.productCards}
                  key={p.id}
                  onClick={() => handleProductClick(p.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="product-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`wish-btn ${wishlistIds.has(p.id) ? "wished" : ""}`}
                      onClick={() => toggleWish(p.id)}
                    >
                      {wishlistIds.has(p.id) ? "❤️ 상품 찜하기" : "♡ 상품 찜하기"}
                    </button>
                  </div>

                  <div className={styles.productDetails}>
                    <div className={styles.image20Parent}>
                      <img
                        className={styles.image20}
                        src={p.thumb || "/images/sample-product.jpg"}
                        alt={p.title || p.variety || p.category || "상품 이미지"}
                        onError={(e) => {
                          e.currentTarget.src = "/images/sample-product.jpg";
                        }}
                      />
                      <div className={styles.parent}>
                        <h3 className={styles.h3}>
                          {p.title || p.variety || p.category || "상품명"}
                        </h3>
                        <h3 className={styles.h3}>
                          {p.price.toLocaleString()} 포인트
                        </h3>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatClick(p);
                      }}
                      size="Medium"
                      variant="Primary"
                      label="채팅 보내기"
                      buttonHeight="40px"
                      buttonWidth="100%"
                      buttonBorder="1px solid #2c2c2c"
                      buttonFontSize="16px"
                      buttonFontWeight="600"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: 50,
                  color: "#666",
                }}
              >
                {search.trim() ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
              </div>
            )}
          </div>
        </main>

        <div className={styles.paginationWrapper}>
          <Pagination
            size="16"
            size1="16"
            currentPage={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>

      <ChatListPanel open={showChat} onClose={() => setShowChat(false)} />
    </>
  );
}
