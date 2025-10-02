import './Paymentpage.css';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 로그인 및 사용자
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userNickname, setUserNickname] = useState("");
  
  // 상품 및 결제 관련
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zipCode: '',
    address: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [myPoints, setMyPoints] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인 확인
  const checkSession = useCallback(async () => {
    try {
      setChecking(true);
      const res = await fetch(`${API}/api/check`, { credentials: 'include' });
      const data = await res.json();
      const ok = !!data?.loggedIn;
      setIsLoggedIn(ok);
      if (ok && data?.username) setUserNickname(data.username);
      if (!ok) navigate('/login');
    } catch {
      setIsLoggedIn(false);
      navigate('/login');
    } finally {
      setChecking(false);
    }
  }, [navigate]);

  //포인트 조회
  const loadPoints = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/me/points`, { credentials: 'include' });
      if (res.status === 401) return navigate('/login');
      const data = await res.json();
      setMyPoints(Number(data?.points || 0));
    } catch {
      setMyPoints(0);
    }
  }, [navigate]);

  // 상품 정보 가져오기
  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/market/listing/${id}`, { credentials: 'include' });
      if (!res.ok) {
        console.error('상품정보 API 실패');
        return;
      }
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('상품정보 가져오기 실패', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 최초 로드 
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await checkSession();
      if (!cancelled) {
        await Promise.all([loadPoints(), fetchProduct()]);
      }
    })();
    return () => { cancelled = true; };
  }, [checkSession, loadPoints, fetchProduct]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 수량 설정 (임시 최대 30개)
  const handleQuantityChange = (type) => {
    setQuantity((prev) => {
      if (type === 'increase' && prev < 30) return prev + 1;
      if (type === 'decrease' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value < 1) setQuantity(1);
    else if (value > 30) {
      alert('최대 주문 수량은 30개입니다.');
      setQuantity(30);
    } else setQuantity(value);
  };

  // 유효성 검사
  const validateForm = () => {
    const { name, phone, zipCode, address } = formData;
    if (!name.trim() || !phone.trim() || !zipCode.trim() || !address.trim()) {
      alert('모든 필수 정보를 입력해주세요.');
      return false;
    }
    const phoneRegex = /^\d{3}-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert('올바른 전화번호 형식을 입력해주세요.');
      return false;
    }
    return true;
  };

  // 결제
  const totalAmount = product ? product.price * quantity : 0;

  const handlePayment = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!validateForm()) return;
    if (!product) {
      alert('상품 정보를 불러오지 못했습니다.');
      return;
    }
    if (myPoints < totalAmount) {
      alert('포인트가 부족합니다.');
      return;
    }

    try {
      const paymentData = {
        productId: parseInt(id),
        quantity,
        totalAmount,
        deliveryInfo: formData,
      };

      const res = await fetch(`${API}/api/payment/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(paymentData),
      });

      if (!res.ok) {
        alert('결제 실패');
        return;
      }

      const result = await res.json();
      alert(`결제가 완료되었습니다! 남은 포인트: ${result.remainingPoints.toLocaleString()}P`);
      navigate('/pagination');
    } catch (error) {
      console.error('결제 API 에러', error);
      alert('결제 중 오류가 발생했습니다.');
    }
  };

  if (!product) return <div className="paymentpage">상품 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="paymentpage">
      <div className="container">
        <div className="main-grid">
          <section className="title-section">
            <h2 className="form-title">결제하기</h2>
            <div className="form-desc">
              {isLoggedIn ? `${userNickname || '사용자'}님, 배송 정보를 입력해주세요.` : '로그인이 필요합니다.'}
            </div>
          </section>

          <section className="delivery-form">
            <div className="delivery-form-group">
              <label>이름 <span className="required">*</span></label>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="이름을 입력하세요" />
            </div>
            <div className="delivery-form-group">
              <label>전화번호 <span className="required">*</span></label>
              <div className="phone-input">
                <span className="phone-prefix">+82</span>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
            <div className="delivery-form-group">
              <label>우편번호 <span className="required">*</span></label>
              <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="00000" />
            </div>
            <div className="delivery-form-group">
              <label>주소 <span className="required">*</span></label>
              <input name="address" value={formData.address} onChange={handleInputChange} placeholder="상세 주소 입력" />
            </div>
          </section>

          <section className="payment-section">
            <div className="order-details">
              <div className="order-layout">
                <div className="title">{product.title}</div>
                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange('decrease')} disabled={quantity <= 1}>-</button>
                  <input type="number" value={quantity} onChange={handleQuantityInputChange} min="1" max="30" />
                  <button onClick={() => handleQuantityChange('increase')} disabled={quantity >= 30}>+</button>
                </div>
              </div>

              <div className="payment-amount-section">
                <label>결제 금액</label>
                <input type="text" value={`${totalAmount.toLocaleString()} P`} readOnly />
              </div>

              <div className="user-point-info">
                <label>보유 포인트</label>
                <div>{myPoints.toLocaleString()} P</div>
              </div>

              <div className="recipient-section">
                <label>판매자</label>
                <div className="recipient-info">
                  <div className="recipient-avatar">{product.sellerNickname?.charAt(0) || 'S'}</div>
                  <div className="recipient-name">{product.sellerNickname}</div>
                </div>
              </div>
            </div>

            <button
              className="payment-button"
              onClick={handlePayment}
              disabled={!isLoggedIn || myPoints < totalAmount}
            >
              {isLoggedIn ? '결제하기' : '로그인 후 결제'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

