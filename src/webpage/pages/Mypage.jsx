// src/pages/mypage/Mypage.jsx
import "./Mypage.css";
import ProductImage from "./ProductImage";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";
const toAbs = (u) => (u ? (u.startsWith("http") ? u : `${API}${u}`) : "");

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // UI state
  const [activeTab, setActiveTab] = useState("wishlist");

  // auth/session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  // user
  const [userNickname, setUserNickname] = useState("닉네임");
  const [point, setPoint] = useState(0);

  // data
  const [wishlist, setWishlist] = useState([]);
  const [sellingProducts, setSellingProducts] = useState([]); // ✅ 내가 올린 상품

  // ---------------- 세션 확인 ----------------
  const checkSession = useCallback(async () => {
    try {
      setChecking(true);
      const res = await fetch(`${API}/api/check`, { credentials: "include" });
      const data = await res.json();
      const ok = !!data?.loggedIn;
      setIsLoggedIn(ok);
      if (ok && data?.username) setUserNickname(data.username);
      if (!ok) navigate("/login");
    } catch {
      setIsLoggedIn(false);
      navigate("/login");
    } finally {
      setChecking(false);
    }
  }, [navigate]);

  // ---------------- 포인트 ----------------
  const loadPoints = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/me/points`, { credentials: "include" });
      if (res.status === 401) return navigate("/login");
      const data = await res.json();
      setPoint(Number(data?.points || 0));
    } catch {
      setPoint(0);
    }
  }, [navigate]);

  // ---------------- 찜 목록 ----------------
  const loadWishlist = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/me/wishlist`, { credentials: "include" });
      if (res.status === 401) return navigate("/login");
      const arr = await res.json();
      setWishlist(
        Array.isArray(arr)
          ? arr.map((it) => ({
              id: it.id,
              title: it.title,
              price: it.unit_price,
              image: toAbs(it.thumbnail) || "/images/sample-product.jpg",
            }))
          : []
      );
    } catch {
      setWishlist([]);
    }
  }, [navigate]);

  // ---------------- 내가 올린 상품 ----------------
  const loadSellingProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/market/my/listings`, {
        credentials: "include",
      });
      if (res.status === 401) return navigate("/login");
      const arr = await res.json();
      setSellingProducts(
        Array.isArray(arr)
          ? arr.map((it) => ({
              id: it.id,
              title: it.title,
              price: it.unit_price,
              image: toAbs(it.thumbnail) || "/images/sample-product.jpg",
              isActive: !!it.is_active,
              createdAt: it.created_at,
            }))
          : []
      );
    } catch (e) {
      console.error("내 판매상품 조회 실패", e);
      setSellingProducts([]);
    }
  }, [navigate]);

  // ---------------- 최초 로드 ----------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await checkSession();
      if (!cancelled) {
        await Promise.all([loadPoints(), loadWishlist(), loadSellingProducts()]);
      }
    })();

    const onAuthChange = () => {
      checkSession().then(() => {
        loadPoints();
        loadWishlist();
        loadSellingProducts();
      });
    };
    window.addEventListener("authchange", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    return () => {
      cancelled = true;
      window.removeEventListener("authchange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, [location.key, checkSession, loadPoints, loadWishlist, loadSellingProducts]);

  // ---------------- 빠른충전 ----------------
  const handleQuickTopup10k = async () => {
    try {
      const res = await fetch(`${API}/api/me/points/topup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 10000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "충전 실패");
      setPoint(Number(data?.newBalance ?? 0));
      alert("10,000P 충전 완료!");
    } catch {
      alert("충전에 실패했습니다.");
    }
  };

  // ---------------- 찜 해제 ----------------
  const handleHeartClick = async (listingId) => {
    try {
      const res = await fetch(`${API}/api/me/wishlist/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setWishlist((prev) => prev.filter((x) => x.id !== listingId));
    } catch {
      alert("찜 해제에 실패했습니다.");
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleEditProfile = () => navigate("/mypage/update");
  const handleChat = () => navigate("/chat");
  const handleAdmin = () => navigate("/admin");

  // ---------------- 렌더 helpers ----------------
  const renderWishlistContent = () => (
    <div className="content-section">
      {wishlist.length === 0 ? (
        <div className="empty-state"><p>찜한 상품이 없습니다.</p></div>
      ) : (
        <div className="products-grid">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/detail/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="wish-product-image">
                <ProductImage
                  src={item.image || "/images/sample-product.jpg"}
                  alt={item.title}
                  onError={(e) => (e.currentTarget.src = "/images/sample-product.jpg")}
                />
                <div
                  className="heart-icon active"
                  title="찜 해제"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHeartClick(item.id);
                  }}
                >
                  ♥
                </div>
              </div>
              <div className="wish-product-info">
                <div className="wish-product-name">{item.title}</div>
                <div className="wish-product-price">
                  {Number(item.price ?? 0).toLocaleString()} P
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSellingContent = () => (
    <div className="content-section">
      {sellingProducts.length === 0 ? (
        <div className="empty-state">
          <p>판매 중인 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="products-grid">
          {sellingProducts.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/detail/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="wish-product-image">
                <ProductImage
                  src={item.image || "/images/sample-product.jpg"}
                  alt={item.title}
                  onError={(e) => (e.currentTarget.src = "/images/sample-product.jpg")}
                />
                {/* 상태 배지 */}
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: item.isActive ? "#2e7d32" : "#9e9e9e",
                    color: "#fff",
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 12,
                  }}
                >
                  {item.isActive ? "판매중" : "중지"}
                </div>
              </div>
              <div className="wish-product-info">
                <div className="wish-product-name">{item.title}</div>
                <div className="wish-product-price">
                  {Number(item.price ?? 0).toLocaleString()} P
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrderHistoryContent = () => (
    <div className="content-section">
      <div className="empty-state">
        <p>주문 내역 기능은 추후 결제 연동과 함께 제공됩니다.</p>
      </div>
    </div>
  );

  if (checking) return null;

  return (
    <div className="mypage">
      <div className="container">
        <main className="main-grid">
          <section className="user-info-section">
            <h2 className="mypage-user-info-title">내 정보</h2>

            <div className="user-nickname-section">
              <div className="user-nickname">{userNickname}</div>
              <div className="button-group">
                <button className="edit-btn" onClick={handleEditProfile}>✏️ 수정하기</button>
                <button className="mypage-chat-btn" onClick={handleChat}>채팅하기</button>
                <button className="admin-btn" onClick={handleAdmin}>관리자</button>
              </div>
            </div>

            <div className="user-profile-stats">
              <div className="user-stats">
                <div className="stat-item">
                  <div className="stat-label">포인트</div>
                  <div className="stat-row">
                    <div className="stat-value" style={{ cursor: "default" }}>
                      {Number(point).toLocaleString()} P
                    </div>
                    <button className="quick-topup-btn" onClick={handleQuickTopup10k}>
                      10,000원 충전
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="tabs">
              <button
                className={`tab ${activeTab === "wishlist" ? "active" : ""}`}
                onClick={() => setActiveTab("wishlist")}
              >
                찜 상품 ({wishlist.length})
              </button>
              <button
                className={`tab ${activeTab === "selling" ? "active" : ""}`}
                onClick={() => setActiveTab("selling")}
              >
                판매 상품 ({sellingProducts.length})
              </button>
              <button
                className={`tab ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                주문내역 (준비중)
              </button>
            </div>
          </section>

          {activeTab === "wishlist" && renderWishlistContent()}
          {activeTab === "selling" && renderSellingContent()}
          {activeTab === "orders" && renderOrderHistoryContent()}
        </main>
      </div>
    </div>
  );
};

export default MyPage;
