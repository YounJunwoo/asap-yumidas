import { useState, useEffect } from 'react';
import './UpdatingInfo.css';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";
const toAbs = (u) => (u ? (u.startsWith("http") ? u : `${API}${u}`) : "");

const UpdatingInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [originalData, setOriginalData] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailError, setEmailError] = useState(''); 
  const [phoneError, setPhoneError] = useState('');   
  const navigate = useNavigate();

  // 비밀번호 일치 확인
  useEffect(() => {
    if (formData.confirmPassword && formData.password) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  // 이메일 & 전화번호 유효성 검사 
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
    } else {
      setEmailError('');
    }
  }, [formData.email]);

  useEffect(() => {
    const phoneRegex = /^[0-9-+\s()]*$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setPhoneError('올바른 전화번호 형식을 입력해주세요.');
    } else {
      setPhoneError('');
    }
  }, [formData.phone]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  //변경된 데이터만
  const getChangedData = async () => {
    const changed = {};
    for (let key in formData) {
      if (formData[key] && formData[key] !== originalData[key]) {
        if (key === "password") {
          continue;
        } else if (key !== "confirmPassword") {
          changed[key] = formData[key].trim();
        }
      }
    }
    return changed;
  };

  //입력칸 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    if (!formData.phone.trim()) newErrors.phone = '전화번호를 입력해주세요.';
    if (!formData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
    if (!formData.confirmPassword) newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    if (!passwordMatch) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!isConfirmed) newErrors.confirm = '확인 체크박스를 선택해주세요.';
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("폼 입력을 확인해주세요.");
      return;
    }

    if (!passwordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const updateData = await getChangedData();
      //비밀번호 해싱(bcrypt 이용)
      if (formData.password && formData.password !== originalData.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(formData.password, salt);
        updateData.password = hashedPassword;
      }

      if (Object.keys(updateData).length === 0) {
        alert("변경된 내용이 없습니다.");
        return;
      }

      const res = await fetch(toAbs("/api/user/update"), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        console.log('개인정보 api 수정 실패했습니다.');
      }

      const data = await res.json();
      
      if (data.success) {
        alert('개인정보가 성공적으로 수정되었습니다.');
        navigate('/mypage'); 
      } else {
        alert(data.message || '개인정보 수정에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('개인정보 수정 오류:', error);
      alert('개인정보 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="UpdatingInfo">
      <div className="container">
        <div className="main-grid">
          <div className="header-space">
            <section className="title-section">
              <h2 className="form-title">개인정보 수정 페이지</h2>
              <div className="form-desc">개인 정보를 수정하세요.</div>
            </section>

            <form className="update-form" onSubmit={handleSubmit}>
              <div className="form-columns">
                <div className="left-column">
                  <div className="updating-form-group">
                    <label htmlFor="name">이름</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="updating-form-input"
                    />
                  </div>

                  <div className="updating-form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`updating-form-input ${emailError ? "input-error" : ""}`}
                    />
                    {emailError && <div className="error-message">{emailError}</div>}
                  </div>

                  <div className="updating-form-group">
                    <label htmlFor="phone">전화번호</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`updating-form-input ${phoneError ? "input-error" : ""}`}
                    />
                    {phoneError && <div className="error-message">{phoneError}</div>}
                  </div>
                </div>

                <div className="right-column">
                  <div className="updating-form-group">
                    <label htmlFor="nickname">닉네임</label>
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      className="updating-form-input"
                    />
                  </div>

                  <div className="updating-form-group">
                    <label htmlFor="password">비밀번호</label>
                    <div className="password-input-container">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="updating-form-input"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "숨기기" : "보기"}
                      </button>
                    </div>
                  </div>

                  <div className="updating-form-group">
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`updating-form-input ${!passwordMatch ? "input-error" : ""}`}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? "숨기기" : "보기"}
                      </button>
                    </div>
                    {!passwordMatch && (
                      <div className="error-message">비밀번호가 일치하지 않습니다.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="submit-section">
                <button type="submit" className="submit-button">수정하기</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatingInfo;
