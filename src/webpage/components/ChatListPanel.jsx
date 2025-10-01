// src/webpage/components/ChatListPanel.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatListPanel.css";

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";
const toAbs = (u) => (u?.startsWith("http") ? u : `${API}${u || ""}`);

export default function ChatListPanel({ open, onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const [rooms, setRooms] = useState([]); // [{room, listing, last_message, peerId}]

  const loadRooms = async () => {
    setLoading(true);
    try {
      // 내 id
      const ck = await fetch(`${API}/api/check`, { credentials: "include" });
      const cd = await ck.json();
      if (!cd.loggedIn) {
        onClose?.();
        navigate("/login");
        return;
      }
      const uid = cd.user_id;
      // 방 목록
      const r = await fetch(`${API}/api/market/chats`, { credentials: "include" });
      if (!r.ok) throw new Error("failed to load rooms");
      const arr = await r.json(); // [{id, listing_id, seller_id, buyer_id, last_message}]
      // 각 방의 상품 정보
      const details = await Promise.all(
        arr.map(async (room) => {
          try {
            const lr = await fetch(`${API}/api/market/listings/${room.listing_id}`, {
              credentials: "include",
            });
            const ld = lr.ok ? await lr.json() : null;
            return {
              room,
              listing: ld
                ? {
                    id: ld.id,
                    title: ld.title,
                    unit_price: ld.unit_price,
                    image:
                      (ld.images?.[0]?.url && toAbs(ld.images[0].url)) ||
                      "/images/sample-product.jpg",
                    description: ld.description || "",
                  }
                : {
                    id: room.listing_id,
                    title: "(삭제되었거나 비공개인 상품)",
                    unit_price: 0,
                    image: "/images/sample-product.jpg",
                    description: "",
                  },
              last_message: room.last_message,
              peerId: room.seller_id === uid ? room.buyer_id : room.seller_id,
            };
          } catch {
            return {
              room,
              listing: {
                id: room.listing_id,
                title: "(상품 불러오기 실패)",
                unit_price: 0,
                image: "/images/sample-product.jpg",
                description: "",
              },
              last_message: room.last_message,
              peerId: room.seller_id === uid ? room.buyer_id : room.seller_id,
            };
          }
        })
      );
      setMyId(uid);
      setRooms(details);
    } catch (e) {
      console.error(e);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // 열릴 때 로드 + 5초 폴링
  useEffect(() => {
    if (!open) return;
    let alive = true;
    loadRooms();
    const iv = setInterval(() => alive && loadRooms(), 5000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const enterRoom = (item) => {
    const { room, listing } = item;
    navigate(`/chat/${room.id}`, {
      state: {
        product: {
          id: listing.id,
          title: listing.title,
          description: listing.description,
          unit_price: listing.unit_price,
          image: listing.image,
        },
      },
    });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="chatlist-overlay" onClick={onClose}>
      <div className="chatlist-panel" onClick={(e) => e.stopPropagation()}>
        <div className="chatlist-header">
          <h3>내 채팅방</h3>
          <div className="spacer" />
          <button className="chatlist-refresh" onClick={loadRooms}>새로고침</button>
          <button className="chatlist-close" onClick={onClose}>닫기</button>
        </div>

        {loading ? (
          <div className="chatlist-empty">불러오는 중...</div>
        ) : rooms.length === 0 ? (
          <div className="chatlist-empty">채팅방이 없습니다. 상품 상세에서 채팅을 시작해 보세요.</div>
        ) : (
          <ul className="chatlist-list">
            {rooms.map((it) => {
              const last = it.last_message;
              const preview = last?.text || "";
              const when = last?.created_at
                ? new Date(last.created_at).toLocaleString()
                : "";
              const mine = last?.sender_id === myId;
              return (
                <li key={it.room.id} className="chatlist-item" onClick={() => enterRoom(it)}>
                  <img className="chatlist-thumb" src={it.listing.image} alt="상품" />
                  <div className="chatlist-info">
                    <div className="chatlist-title">{it.listing.title}</div>
                    <div className="chatlist-row">
                      <span className="chatlist-peer">상대: #{it.peerId}</span>
                      <span className="chatlist-time">{when}</span>
                    </div>
                    <div className="chatlist-last">
                      {preview ? (mine ? `나: ${preview}` : preview) : "메시지가 없습니다."}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
