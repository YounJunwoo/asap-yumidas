
import "./HomePage.css";
import diversity from "../../assets/diversity.svg";
import AI from "../../webpage/assets/analyze.png";
import market from "../../webpage/assets/market.png";
import smartfarm from "../../webpage/assets/smart-farm.png";
import groceries from "../../webpage/assets/groceries 2.png";
import Footer from "../components/Footer";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 백엔드 주소 (원하면 Vite 환경변수로 교체 가능)
const API = import.meta.env?.VITE_API ?? "http://localhost:5000";
// 스마트팜 목록 라우트 (프로젝트 라우트에 맞게 필요 시 변경)
const FARM_LIST_ROUTE = "/farms";

const HomePage = ({ isLoggedIn, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 상태 동기화
  const [lsLoggedIn, setLsLoggedIn] = useState(false);
  const effectiveIsLoggedIn =
    typeof isLoggedIn === "boolean" ? isLoggedIn : lsLoggedIn;

  // “내 스마트팜 보유 여부”
  const [hasFarms, setHasFarms] = useState(null); // null=모름, true/false=확정

  // 입력 상태
  const [serialNumber, setSerialNumber] = useState("");

  // 세션/보유 팜 동기화
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) 로그인 여부
        const r1 = await fetch(`${API}/api/check`, { credentials: "include" });
        const d1 = await r1.json();
        if (!cancelled) setLsLoggedIn(!!d1.loggedIn);

        // 2) 로그인했으면 내 팜 개수 확인
        if (d1.loggedIn) {
          const r2 = await fetch(`${API}/api/my-farms`, {
            credentials: "include",
          });
          if (r2.ok) {
            const d2 = await r2.json();
            const cnt = Array.isArray(d2?.farms) ? d2.farms.length : 0;
            if (!cancelled) setHasFarms(cnt > 0);
          } else {
            if (!cancelled) setHasFarms(true); // 에러 시 입력박스는 숨김
          }
        } else {
          if (!cancelled) setHasFarms(null); // 로그인 전에는 표시 안 함
        }
      } catch {
        if (!cancelled) {
          setLsLoggedIn(false);
          setHasFarms(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.key]);

  // 등록 처리: /api/smartfarm/register
  const handleRegisterClick = async () => {
    if (!effectiveIsLoggedIn) {
      (onLogin && typeof onLogin === "function") ? onLogin() : navigate("/login");
      return;
    }
    if (!serialNumber.trim()) {
      alert("일련번호를 입력해주세요.");
      return;
    }
    try {
      const res = await fetch(`${API}/api/smartfarm/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serial: serialNumber.trim(),
          name: "", // 필요 시 팜 이름 전달
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        alert(data?.message || "스마트팜 등록에 실패했습니다.");
        return;
      }
      // 성공 → 목록 페이지로 이동
      navigate(FARM_LIST_ROUTE);
    } catch (e) {
      console.error(e);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  const fallbackLogin = () => navigate("/login");
  const fallbackLogout = async () => {
    try {
      await fetch(`${API}/api/logout`, { method: "POST", credentials: "include" });
    } catch {}
    try { localStorage.removeItem("isLoggedIn"); } catch {}
    setLsLoggedIn(false);
    window.dispatchEvent(new Event("authchange"));
  };

  return (
    <div className="homepage">
      <div className="container">
        <main className="main-grid">
          <section className="left-col">
            <h1 className="main-title">
              당신만의
              <br /> <span className="green">스마트 농장</span>,<br />
              지금 시작하세요
            </h1>
            <p className="subtitle">
              환경 데이터부터 농사 기반 챗봇까지
              <br />
              스마트팜 대시보드에서 한눈에 확인할 수 있어요.
            </p>

            {/* ✅ 로그인했고, 아직 등록한 스마트팜이 없는 경우에만 입력 박스 노출 */}
            {effectiveIsLoggedIn && hasFarms === false && (
              <form
                className="serial-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegisterClick();
                }}
              >
                <input
                  type="text"
                  placeholder="디바이스 일련번호를 입력하세요."
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <button type="submit">등록하기</button>
              </form>
            )}
          </section>

          <section className="right-col">
            <img className="main-image-placeholder" src={groceries} alt="작물" />
          </section>
        </main>

        <section className="features-section">
          <div className="feature-card" onClick={() => navigate("/smartfarmlist")}>
            <img className="feature-icon" src={smartfarm} alt="smartfarm이미지" />
            <div className="feature-title">스마트팜 대시보드</div>
            <div className="feature-desc">
              농작물 상태와 환경 정보를 한눈에 확인하고 편리하게 관리하세요.
            </div>
          </div>

          <div className="feature-card" onClick={() => navigate("/pagination")}>
            <img className="feature-icon" src={market} alt="market 이미지" />
            <div className="feature-title">농작물 마켓</div>
            <div className="feature-desc">수확한 작물을 손쉽게 거래할 수 있어요.</div>
          </div>

          <div className="feature-card" onClick={() => navigate("/price")}>
            <img className="feature-icon" src={AI} alt="AI 이미지" />
            <div className="feature-title">가격 예측</div>
            <div className="feature-desc">
              AI가 가격변동을 예측해 최적의 농작물 가격을 알려드립니다.
            </div>
          </div>
        </section>

        <section className="grow-section">
          <h2 className="grow-title">Grow Anything, Anytime</h2>
          <p className="grow-desc">
            당신이 키우고 싶은 모든 작물, 이곳에서 시작됩니다.
            <br />
            스마트팜으로 언제든지 가능합니다.
          </p>
          <div className="grow-images">
            <img className="img-vege" src={diversity} alt="작물" />
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
