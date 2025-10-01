// src/webpage/pages/Detailpage.jsx
import "./DetailPage.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";
const toAbs = (u) => (u?.startsWith("http") ? u : `${API}${u || ""}`);

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [prod, setProd] = useState(null);
  const [isWished, setIsWished] = useState(false);

  // 세션
  useEffect(() => {
    (async () => {
      try {
        setChecking(true);
        const r = await fetch(`${API}/api/check`, { credentials: "include" });
        const d = await r.json();
        setIsLoggedIn(!!d?.loggedIn);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // 상세
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/market/listings/${id}`, {
          credentials: "include",
        });
        if (!r.ok) throw new Error("not found");
        const d = await r.json();
        const normalized = {
          id: d.id,
          title: d.title,
          productTitle: d.variety || d.category || "",
          price: Number(d.unit_price ?? 0),
          desc: d.description || "",
          imgs: Array.isArray(d.images) ? d.images.map((im) => toAbs(im.url)) : [],
          sellerId: d.seller_id ?? d.seller?.id,
          sellerNickname: d.seller_nickname || d.seller?.nickname || null,
          status: d.is_active ? "판매중" : "중지",
        };
        setProd(normalized);
      } catch (e) {
        console.error(e);
        setProd(null);
      }
    })();
  }, [id]);

  // 찜 상태
  const refreshWish = async () => {
    try {
      const r = await fetch(`${API}/api/me/wishlist`, {
        credentials: "include",
      });
      if (!r.ok) return setIsWished(false);
      const arr = await r.json();
      setIsWished(arr.some((x) => (x.id ?? x.listing_id) === Number(id)));
    } catch {
      setIsWished(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) refreshWish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, id]);

  // 채팅 열기(방 생성 → /chat/:roomId)
  const handleChatClick = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API}/api/market/listings/${id}/chat`, {
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
      const payload = {
        id: prod?.id ?? Number(id),
        title: prod?.title || prod?.productTitle || "상품명",
        price: prod?.price ?? 0,
        image: prod?.imgs?.[0] || "/images/sample-product.jpg",
        description: prod?.desc || "",
      };
      navigate(`/chat/${data.id}`, { state: { product: payload } });
    } catch (e) {
      console.error(e);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  const toggleWish = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    try {
      const url = `${API}/api/me/wishlist/${id}`;
      const r = await fetch(url, {
        method: isWished ? "DELETE" : "POST",
        credentials: "include",
      });
      if (!r.ok) throw new Error("wishlist toggle failed");
      setIsWished((v) => !v);
    } catch {
      alert("찜 처리 중 오류가 발생했습니다.");
    }
  };

  const imgs = prod?.imgs?.length ? prod.imgs : ["/images/sample-product.jpg"];
  if (checking) return null;

  return (
    <div className="detailpage">
      <div className="container">
        <div className="main-grid">
          <section className="detail-left">
            <div className="image-slider">
              <img
                src={imgs[0]}
                alt={prod?.productTitle || "상품"}
                onError={(e) => { e.currentTarget.src = "/images/sample-product.jpg"; }}
              />
              <button className="slider-arrow left">{"<"}</button>
              <button className="slider-arrow right">{">"}</button>
              <div className="slider-indicator">
                {imgs.map((_, i) => (
                  <span key={i} className={i === 0 ? "active" : ""}></span>
                ))}
              </div>
            </div>
          </section>

          <section className="detail-right">
            <div className="category-badge">{prod?.status || "상태"}</div>
            <div className="product-title-main">{prod?.title || "제목"}</div>

            <div className="product-row">
              <div className="product-title">
                {prod?.productTitle || "상품명"}
              </div>
              <div className="product-price">
                {prod?.price ? `${prod.price.toLocaleString()}포인트` : "가격"}
              </div>
            </div>

            <div className="product-desc-label">상품 설명</div>
            <div className="product-desc">{prod?.desc || "상품 설명이 없습니다."}</div>

            <button className="chat-btn" onClick={handleChatClick}>
              채팅 보내기
            </button>

            <div className="product-actions">
              <button
                className={`wish-btn ${isWished ? "wished" : ""}`}
                onClick={toggleWish}
              >
                {isWished ? "❤️ 상품 찜하기" : "♡ 상품 찜하기"}
              </button>
            </div>
          </section>
        </div>

        <div className="detail-bottom-grid">
          <section className="bottom-left">
            <div className="bottom-title">상품 설명</div>
            <div className="bottom-divider"></div>
            <div className="bottom-desc-box">
              {prod?.desc || "상품 설명이 없습니다."}
            </div>
          </section>

          <section className="bottom-right">
            <div className="bottom-title">판매자 정보</div>
            <div className="bottom-divider"></div>
            <div className="seller-profile">
              <div className="seller-info">
                <div className="seller-name">
                  {prod?.sellerNickname
                    ? prod.sellerNickname
                    : prod?.sellerId
                    ? `판매자 #${prod.sellerId}`
                    : "판매자"}
                </div>
              </div>
            </div>

            <button className="chat-btn bottom" onClick={handleChatClick}>
              채팅 보내기
            </button>
            <button
              className={`wish-btn bottom ${isWished ? "wished" : ""}`}
              onClick={toggleWish}
            >
              {isWished ? "❤️ 상품 찜하기" : "♡ 상품 찜하기"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
