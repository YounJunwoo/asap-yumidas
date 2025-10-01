import { useState } from "react";
import "./SignUpPage.css";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [username, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !nickname || !phone || !email || !password || !confirmPassword) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 백엔드에 전달할 전체 필드
        body: JSON.stringify({
          username,
          nickname,
          phone,
          email,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "회원가입에 실패했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">회원가입</h2>

        <form onSubmit={handleSubmit}>
          <label className="signup-label">이름</label>
          <input
            className="signup-input"
            type="text"
            placeholder="이름을 입력하세요."
            value={username}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="signup-label">닉네임</label>
          <input
            className="signup-input"
            type="text"
            placeholder="닉네임을 입력하세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <label className="signup-label">전화번호</label>
          <input
            className="signup-input"
            type="text"
            placeholder="전화번호를 입력하세요."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label className="signup-label">이메일</label>
          <input
            className="signup-input"
            type="email"
            placeholder="이메일을 입력하세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="signup-label">비밀번호</label>
          <input
            className="signup-input"
            type="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="signup-label">비밀번호 재확인</label>
          <input
            className="signup-input"
            type="password"
            placeholder="비밀번호를 다시 입력하세요."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="signup-button" type="submit" disabled={submitting}>
            {submitting ? "처리중..." : "회원가입"}
          </button>
        </form>
        <div className="sub-buttons">
          <button className="sub-button" onClick={() => navigate("/login")}>로그인</button>
          <button className="sub-button" onClick={() => navigate("/findpw")}>아이디/비밀번호 찾기</button>
        </div>
        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}


