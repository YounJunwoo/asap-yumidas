import './FindPWPage.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFindId = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('아이디: ' + data.email);
      } else {
        setMessage(data.message || '아이디 찾기 실패');
      }
    } catch (err) {
      setMessage('서버 오류 발생');
    }
  };

  const handleResetPw = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('비밀번호 재설정 메일을 전송했습니다.');
      } else {
        setMessage(data.message || '비밀번호 재설정 실패');
      }
    } catch (err) {
      setMessage('서버 오류 발생');
    }
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <div className="find-section">
          <h2 className="find-title">아이디 찾기</h2>
          <div className="find-input-wrapper">
            <input
              type="text"
              className="find-input"
              placeholder="전화번호 입력"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button className="find-button" onClick={handleFindId}>
              <img src="/Icon.svg" alt="전송" className="find-icon" />
            </button>
          </div>
        </div>

        <div className="find-section">
          <h2 className="find-title">비밀번호 재설정</h2>
          <div className="find-input-wrapper">
            <input
              type="text"
              className="find-input"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="find-button" onClick={handleResetPw}>
              <img src="/Icon.svg" alt="전송" className="find-icon" />
            </button>
          </div>
        </div>

        {message && <p style={{ color: 'blue' }}>{message}</p>}
        <button className="back-button" onClick={() => navigate('/login')}>
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
