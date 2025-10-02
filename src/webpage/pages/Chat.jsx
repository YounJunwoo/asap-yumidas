import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ArrowUpCircle from "../components/ArrowUpCircle";
import "./Chat.css";

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";

export default function Chat() {
  const { roomId: roomIdParam } = useParams();
  const roomId = Number(roomIdParam || 0);

  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || null;

  // === Pre-auth gate ===
  const [authReady, setAuthReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  // run-once guard (StrictMode 2회 실행 방지)
  const didAuthCheck = useRef(false);
  // redirect 이후 모든 작업 중단 플래그
  const redirectedRef = useRef(false);
  // "어디서 왔는지" 처음 1회만 캡처
  const fromRef = useRef(location);

  const [myId, setMyId] = useState(null);
  const [message, setMessage] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 채팅창 스크롤
  const chatRef = useRef(null);
  const scrollToBottom = () => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  // 폴링 커서
  const lastIdRef = useRef(null);
  useEffect(() => {
    lastIdRef.current = msgs.length ? msgs[msgs.length - 1].id : null;
  }, [msgs]);

  // === 인증 체크: 진짜 딱 1번만 실행 ===
  useEffect(() => {
    if (didAuthCheck.current) return;
    didAuthCheck.current = true;

    const ac = new AbortController();

    (async () => {
      try {
        const r = await fetch(`${API}/api/check`, {
          credentials: "include",
          signal: ac.signal,
        });
        const d = await r.json().catch(() => ({}));

        if (d?.loggedIn) {
          setAuthed(true);
          setMyId(d.user_id);
        } else {
          redirectedRef.current = true;
          setAuthed(false);
          // location을 의존성에 넣지 않기 때문에 fromRef로 고정 전달
          navigate("/login", { replace: true, state: { from: fromRef.current } });
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          redirectedRef.current = true;
          setAuthed(false);
          navigate("/login", { replace: true, state: { from: fromRef.current } });
        }
      } finally {
        setAuthReady(true);
      }
    })();

    return () => ac.abort();
    // 의존성 비움: 한 번만 실행 (StrictMode는 runOnce ref로 방어)
  }, [navigate]);

  // 소켓: 인증 끝나고 나서만 연결
  const socket = useMemo(
    () =>
      io(`${API}/market`, {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
      }),
    []
  );

  useEffect(() => {
    if (!authReady || !authed || !myId || !roomId || redirectedRef.current) return;

    const onMsg = (payload) => {
      if (payload.room_id === roomId) {
        setMsgs((prev) => [...prev, payload]);
        setTimeout(scrollToBottom, 0);
      }
    };
    const onError = (e) => console.warn("socket error:", e);

    socket.connect();
    socket.emit("join", { room_id: roomId });
    socket.on("chat_message", onMsg);
    socket.on("connect_error", onError);
    socket.on("error", onError);

    return () => {
      try { socket.emit("leave", { room_id: roomId }); } catch {}
      socket.off("chat_message", onMsg);
      socket.off("connect_error", onError);
      socket.off("error", onError);
      socket.disconnect();
    };
  }, [socket, authReady, authed, myId, roomId]);

  // 초기 히스토리: 인증 OK 후에만
  useEffect(() => {
    if (!authReady || !authed || !myId || !roomId || redirectedRef.current) return;

    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const r = await fetch(`${API}/api/market/chats/${roomId}/messages`, {
          credentials: "include",
          signal: ac.signal,
        });
        if (!r.ok) throw new Error("load failed");
        const data = await r.json();
        if (!cancelled) {
          setMsgs(data || []);
          setLoading(false);
          setTimeout(scrollToBottom, 0);
        }
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          alert("채팅방을 불러올 수 없습니다.");
          navigate(-1);
        }
      }
    })();

    return () => { cancelled = true; ac.abort(); };
  }, [authReady, authed, myId, roomId, navigate]);

  // 폴링: 인증 OK 후에만
  useEffect(() => {
    if (!authReady || !authed || !myId || !roomId || redirectedRef.current) return;

    let alive = true;
    const tick = async (signal) => {
      try {
        const after = lastIdRef.current;
        const url = after
          ? `${API}/api/market/chats/${roomId}/messages?after_id=${after}`
          : `${API}/api/market/chats/${roomId}/messages`;

        const r = await fetch(url, { credentials: "include", signal });
        if (!r.ok || redirectedRef.current || !alive) return;
        const more = await r.json();
        if (more?.length) {
          setMsgs((prev) => [...prev, ...more]);
          setTimeout(scrollToBottom, 0);
        }
      } catch { /* ignore */ }
    };

    let iv;
    const start = () => {
      const ac = new AbortController();
      iv = setInterval(() => tick(ac.signal), 5000);
      return ac;
    };

    const ac = start();
    return () => { alive = false; clearInterval(iv); ac.abort(); };
  }, [authReady, authed, myId, roomId]);


  useEffect(() => {
  if (!socket) return;
  const onError = (data) => {
    if (data.error === "inappropriate_message") {
      alert("부적절한 메시지입니다 : \n" + data.message);
    }
  };
  socket.on("error", onError);
  return () => {
    socket.off("error", onError);
  };
  }, [socket]);

  // 전송
  const handleSendMessage = async () => {
    if (!authReady || !authed || !myId || !roomId || redirectedRef.current) return;
    const text = message.trim();
    if (!text) return;

    if (socket.connected) {
      socket.emit("send_message", { room_id: roomId, text });
      setMessage("");
      return;
    }

    try {
      const r = await fetch(`${API}/api/market/chats/${roomId}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) throw new Error();
      setMessage("");
    } catch (e) {
      console.warn("전송 실패", e);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  const handlePay = () => {
    if (product?.id) {
      navigate(`/payment/${product.id}`, { state: { product } });
    } else {
      alert("상품 정보를 찾을 수 없습니다.");
    }
  };

  // === 렌더 가드 ===
  if (!authReady) {
    return <div className="chat-page"><div className="empty">로그인 확인 중…</div></div>;
  }
  if (!authed) {
    // 이미 navigate("/login") 실행됨. 추가 렌더/요청 방지
    return null;
  }
  if (!roomId) {
    return <div className="chat-page"><div className="empty">유효하지 않은 채팅방입니다.</div></div>;
  }

  // === 인증 완료 후 실제 UI ===
  return (
    <div className="chat-page">
      <div className="product-section">
        <img
          className="product-image"
          src={
            product?.thumbnail ||
            product?.image ||
            (product?.images?.[0]?.url || product?.images?.[0]) ||
            "/images/sample-product.jpg"
          }
          alt={product?.title || "상품 이미지"}
          onError={(e) => { e.currentTarget.src = "/images/sample-product.jpg"; }}
        />
        <div className="product-info">
          <h3>{product?.title || "상품명"}</h3>
          <h3>{Number(product?.unit_price ?? product?.price ?? 0).toLocaleString()} 포인트</h3>
        </div>
        <div className="product-description">
          <h3>{product?.description || "상품설명"}</h3>
        </div>
        <button className="payment-button" onClick={handlePay}>결제하기</button>
      </div>

      <div className="chat-section">
        <div className="chat-window" ref={chatRef}>
          {loading ? (
            <div className="empty">불러오는 중...</div>
          ) : msgs.length === 0 ? (
            <div className="empty">첫 메시지를 보내보세요!</div>
          ) : (
            msgs.map((m) => {
              const mine = myId != null && m.sender_id === myId;
              return (
                <div key={m.id} className={`msg-row ${mine ? "mine" : ""}`}>
                  {!mine && <div className="msg-avatar" />}
                  <div className={`bubble ${mine ? "mine" : "other"}`}>
                    <div className="text">{m.text}</div>
                    <div className="time">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요."
            onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
          />
          <button className="send-button" onClick={handleSendMessage} title="전송">
            <ArrowUpCircle size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}