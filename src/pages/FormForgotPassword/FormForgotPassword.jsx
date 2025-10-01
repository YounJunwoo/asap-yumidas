// src/screens/FormForgotPassword/FormForgotPassword.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const FormForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 비밀번호 재설정 로직 필요시 여기에 작성
    navigate('/'); // 로그인 페이지로 이동
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>전화번호</label>
        <input type="email" placeholder="전화번호를 입력하세요." />
        <div className="button-group">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
          <button type="submit">비밀번호 재설정</button>
        </div>
      </form>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>이메일</label>
        <input type="email" placeholder="이메일을 입력하세요." />
        <div className="button-group">
          <button type="button" onClick={handleCancel}>
            취소
          </button>
          <button type="submit">비밀번호 재설정</button>
        </div>
      </form>
    </div>
  );
};
export default FormForgotPassword;