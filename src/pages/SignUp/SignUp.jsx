import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
//import { setLoggedInEmail, setAccountInfo } from '../../utils/storage';
import { generateUniqueSerialIds } from '../../utils/serialIdGenerator';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // 비밀번호 확인 검사
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const date = new Date().toISOString().slice(0, 10);
    const role = '관리자';
    const id = generateUniqueSerialIds([{ email }])[0];
    const active = true;
	  
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
	credentials: "include",
        body: JSON.stringify({
          username,
          nickname,
          email,
          password,
          phone,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("회원가입 성공!");
        //setAccountInfo({ email, date, role, id, active });
        //setLoggedInEmail(email);
	navigate("/");
      } else {
        alert(`회원가입 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <label>이름</label>
        <input
          type="text"
          placeholder="이름을 입력하세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>닉네임</label>
        <input
          type="text"
          placeholder="닉네임을 입력하세요."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <label>이메일</label>
        <input
          type="email"
          placeholder="이메일을 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>비밀번호 재확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label>전화번호</label>
        <input
          type="text"
          placeholder="전화번호를 입력하세요."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;

