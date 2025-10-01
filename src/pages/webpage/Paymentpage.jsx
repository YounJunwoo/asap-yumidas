import './Paymentpage.css';
import Header from '../../components/webpage/Header';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Paymentpage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('auth') === '1'
  );
  useEffect(() => {
    const onStorage = () => setIsLoggedIn(localStorage.getItem('auth') === '1');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zipCode: '',
    address: '',
  });

  const [quantity, setQuantity] = useState(1);
  const [myPoints, setMyPoints] = useState(5000); // 포인트 기본값 설정

  // ❌ API 연동 시 삭제: 더미 데이터
  const dummyData = [
    {
      id: 0,
      title: '맛있는 가지 팝니다',
      price: 400,
      sellerNickname: '농부김씨',
    },
    {
      id: 1,
      title: '신선한 토마토 판매합니다',
      price: 800,
      sellerNickname: '토마토농장',
    },
    {
      id: 2,
      title: '유기농 상추 팝니다',
      price: 300,
      sellerNickname: '초록농장',
    },
  ];

  // ❌ API 연동 시 삭제: 더미데이터 null 에러 방지
  const defaultProduct =
    dummyData.find((item) => item.id === parseInt(id)) || dummyData[0];
  const [product, setProduct] = useState(defaultProduct);

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        /*
        // API 수정
        const res = await fetch(`http://localhost:5000/api/detail/${id}`), {
          method: 'GET'
        });
        
        if (!res.ok) {
          console.log('상품정보 api 가져오기 실패 ');
        }
        const data = await res.json();
        setProduct(data);
        */

        // ❌ API 연동 시 삭제: 더미 데이터 처리
        const found = dummyData.find((item) => item.id === parseInt(id));
        if (found) {
          setProduct(found);
        } else {
          // ID가 잘못되면 첫 번째 상품으로
          setProduct(dummyData[0]);
        }
      } catch (error) {
        console.log('상품정보 가져오기 실패 ');
      }
    };

    fetchProduct();
  }, [id]);

  // 내 포인트 가져오기
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        /*
        // api 연결
        const res = await fetch('http://localhost:5000/api/user/points', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          console.log('보유 포인트 가져오기 실패');
        }
        const data = await res.json();
        setMyPoints(data.points);
        */

        // ❌ API 연동 시 삭제: localStorage에서 포인트 가져오기
        const storedPoints = parseInt(
          localStorage.getItem('myPoints') || '5000'
        );
        setMyPoints(storedPoints);
      } catch (error) {
        console.log('포인트 api 가져오기 실패 ');
      }
    };

    fetchPoints();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;

    if (value < 1) {
      setQuantity(1);
    } else if (value > 30) {
      alert('최대 주문 가능 수량은 30개입니다.');
      setQuantity(30);
    } else {
      setQuantity(value);
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const { name, phone, zipCode, address } = formData;

    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return false;
    }
    if (!phone.trim()) {
      alert('전화번호를 입력해주세요.');
      return false;
    }
    if (!zipCode.trim()) {
      alert('우편번호를 입력해주세요.');
      return false;
    }
    if (!address.trim()) {
      alert('주소를 입력해주세요.');
      return false;
    }

    // 전화번호 형식
    const phoneRegex = /^\d{3}-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert('올바른 전화번호 형식을 입력해주세요.');
      return false;
    }
    return true;
  };

  const totalAmount = product ? product.price * quantity : 0;

  const handlePayment = async () => {
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }

    if (myPoints < totalAmount) {
      alert('포인트가 부족합니다!');
      return;
    }

    try {
      /*
      // 결제 API 
      const paymentData = {
        productId: parseInt(id),
        quantity: quantity,
        totalAmount: totalAmount,
        deliveryInfo: formData//빼도 됨

      };
      //api 수정 
      const res = await fetch(`http://localhost:5000/api/payment/${id}`, {
        method: 'POST'
        body: JSON.stringify(paymentData)
      });

      if (!res.ok) {
        alert('결제 실패');
      }
      const result = await res.json();
      // 포인트 업데이트
      setMyPoints(result.remainingPoints);
      alert(`결제가 완료되었습니다! 남은 포인트: ${result.remainingPoints.toLocaleString()}P`);
      navigate('/pagination');
      return;
      */

      // ❌ API 연동 시 삭제: 더미 데이터 결제 처리
      const newPoints = myPoints - totalAmount;
      localStorage.setItem('myPoints', newPoints.toString());
      setMyPoints(newPoints);

      // ❌ API 연동 시 삭제: 주문 내역에 추가
      const orderData = {
        id: Date.now(),
        productId: parseInt(id),
        productTitle: product.title,
        productImage: product.images?.[0] || '',
        quantity: quantity,
        totalAmount: totalAmount,
        deliveryInfo: formData,
        orderDate: new Date().toISOString(),
        status: '주문완료',
      };
      // ❌ API 연동 시 삭제: localStorage에 주문 내역 저장
      const existingOrders = JSON.parse(
        localStorage.getItem('orderHistory') || '[]'
      );
      const updatedOrders = [...existingOrders, orderData];
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));

      alert(
        `결제가 완료되었습니다! 남은 포인트: ${newPoints.toLocaleString()}P`
      );
      navigate('/pagination');
    } catch (error) {
      console.log('결제 API 에러');

      // ❌ API 연동 시 삭제: 더미 데이터 결제 처리
      const newPoints = myPoints - totalAmount;
      localStorage.setItem('myPoints', newPoints.toString());
      setMyPoints(newPoints);

      // ❌ API 연동 시 삭제: 주문 내역에 추가
      const orderData = {
        id: Date.now(),
        productId: parseInt(id),
        productTitle: product.title,
        productImage: product.images?.[0] || '',
        quantity: quantity,
        totalAmount: totalAmount,
        deliveryInfo: formData,
        orderDate: new Date().toISOString(),
        status: '주문완료',
      };
      // ❌ API 연동 시 삭제: localStorage에 주문 내역 저장
      const existingOrders = JSON.parse(
        localStorage.getItem('orderHistory') || '[]'
      );
      const updatedOrders = [...existingOrders, orderData];
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));

      alert(
        `결제가 완료되었습니다! 남은 포인트: ${newPoints.toLocaleString()}P`
      );
      navigate('/pagination');
    }
  };

  return (
    <div className="paymentpage">
      <div className="container">
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={() => {
            localStorage.removeItem('auth');
            window.location.href = '/';
          }}
        />
        <div className="main-grid">
          <section className="title-section">
            <h2 className="form-title">결제하기</h2>
            <div className="form-desc">배송지 정보를 입력해 주세요.</div>
          </section>

          <section className="delivery-form">
            <div className="delivery-form-group">
              <label>
                이름 <span className="required">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div className="delivery-form-group">
              <label>
                전화번호 <span className="required">*</span>
              </label>
              <div className="phone-input">
                <span className="phone-prefix">+82</span>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  required
                />
              </div>
            </div>
            <div className="delivery-form-group">
              <label>
                우편번호 <span className="required">*</span>
              </label>
              <input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="00000"
                required
              />
            </div>
            <div className="delivery-form-group">
              <label>
                주소 <span className="required">*</span>
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="상세 주소를 입력하세요"
                required
              />
            </div>
          </section>

          <section className="payment-section">
            <div className="order-details">
              <div className="order-layout">
                <div className="title">{product.title}</div>
                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityInputChange}
                    min="1"
                    max="30"
                    className="quantity-input"
                  />
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= 30}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="payment-amount-section">
                <label>결제 금액</label>
                <input
                  type="text"
                  value={`${totalAmount.toLocaleString()} P`}
                  readOnly
                  className="payment-amount-display"
                  placeholder="결제 포인트 값"
                />
              </div>

              <div className="recipient-section">
                <label>받는 사람</label>
                <div className="recipient-info">
                  <div className="recipient-avatar">
                    {product.sellerNickname?.charAt(0) || 'S'}
                  </div>
                  <div className="recipient-name">{product.sellerNickname}</div>
                </div>
              </div>
            </div>

            <button
              className="payment-button"
              onClick={handlePayment}
              disabled={myPoints < totalAmount}
            >
              결제하기
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Paymentpage;
