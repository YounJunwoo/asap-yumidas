import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const recheck = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/check`, { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      setIsLoggedIn(data.loggedIn);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // 처음 진입 + 이후 authchange/focus 때마다 재검사
    recheck();
    const onAuth = () => recheck();
    window.addEventListener('authchange', onAuth);
    window.addEventListener('focus', onAuth);
    return () => {
      window.removeEventListener('authchange', onAuth);
      window.removeEventListener('focus', onAuth);
    };
  }, [recheck]);

  const fallbackLogout = async () => {
    try {
      await fetch(`${API}/api/logout`, { method: "POST", credentials: "include" });
    } catch {}
    try { localStorage.removeItem("isLoggedIn"); } catch {}
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authchange")); // 헤더가 즉시 반응
  };

  return (
    <header className="header">
      <Link className="logo" to="/">ASAP</Link>
      <nav className="menu">
        <Link className="menu-item" to="/pagination">농작물 마켓</Link>
        <Link className="menu-item" to="/price">가격 예측</Link>
      </nav>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link className="mypage-btn" to="/mypage">마이페이지</Link>
            <button className="logout-btn" onClick={fallbackLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button type="button" className="login-btn" onClick={() => navigate("/login")}>로그인</button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
