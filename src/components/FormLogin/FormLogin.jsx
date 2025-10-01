import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const FormLogin = ({
  className,
  text = '이메일',
  text1 = '이메일을 입력하세요.',
  text2 = '비밀번호',
  textPasswordValue = '비밀번호를 입력하세요.',
  text3 = '로그인',
  to,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력하세요.');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('유효한 이메일 형식이 아닙니다.');
      return;
    }

    console.log('email:', email, 'password:', password);
    // 🔥 실제 로그인 요청
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 기반 인증에 필수
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('로그인 성공!');
        navigate('/dashboard'); // 예: "/dashboard"
      } else {
        alert(`로그인 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('로그인 요청 오류:', error);
      alert('서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleLogin} className={`form-log-in ${className || ''}`}>
      {/* 이메일 입력 */}
      <div className="input-field">
        <label className="label">{text}</label>
        <input
          type="text"
          placeholder={text1}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-box"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="input-field">
        <label className="label">{text2}</label>
        <input
          type="password"
          placeholder={textPasswordValue}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-box"
        />
      </div>

      {/* 로그인 버튼 */}
      <button type="submit" className="button">
        {text3}
      </button>

      {/* 하단 버튼 */}
      <div className="button-group-2">
        <Link to="/signup" className="sub-button">
          회원가입
        </Link>
        <Link to="/findpassword" className="sub-button">
          아이디/비밀번호 찾기
        </Link>
      </div>
    </form>
  );
};

export default FormLogin;
