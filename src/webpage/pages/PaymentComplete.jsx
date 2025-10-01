import './PaymentComplete.css';
import Header from '../../webpage/components/Header';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const PaymentComplete = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    localStorage.getItem('auth') === '1'
  );
  React.useEffect(() => {
    const onStorage = () => setIsLoggedIn(localStorage.getItem('auth') === '1');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <div className="paymentComplete">
      <div className="container">
        <Header
          isLoggedIn={true}
          onLogout={() => {
            localStorage.removeItem('auth');
            window.location.href = '/';
          }}
        />
        <main className="main-grid">
          <div className="payment-complete">
            <div className="success-icon">✓</div>
            <h2 className="completion-title">결제가 완료되었습니다.</h2>
            <p className="completion-desc">
              주문 내역은 마이페이지에서 확인 가능합니다.
            </p>
            <div className="button-group">
              <button
                className="browse-btn"
                onClick={() => navigate('/pagination')}
              >
                둘러보기
              </button>
              <button
                className="payment-mypage-btn"
                onClick={() => navigate('/mypage')}
              >
                마이페이지로 이동하기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentComplete;
