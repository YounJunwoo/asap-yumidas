// src/webpage/pages/LoginPage.jsx  (경로는 프로젝트 구조에 맞춰 주세요)
import { useState } from "react";
import "./LoginPage.css";
import Header from "../../webpage/components/Header";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
const res = await fetch(`http://localhost:5000/api/login`, {
  method: "POST",
  credentials: "include",               // ✅ 필수
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        console.log("로그인 성공:", data);
        onLogin();
        navigate("/");
        return;
      }

      const err = await res.json().catch(() => ({}));
      // if (handleDevFallback()) return;
      setError(err.message || "로그인 실패");
    } catch (err) {
      console.error("로그인 오류:", err);

      setError("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">ASAP</h2>
        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">로그인</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="sub-buttons">
          <button className="sub-button" onClick={() => navigate("/signup")}>회원가입</button>
          <button className="sub-button" onClick={() => navigate("/findpw")}>아이디/비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
}
