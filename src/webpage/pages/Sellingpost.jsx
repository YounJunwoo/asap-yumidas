import './Sellingpost.css';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env?.VITE_API ?? 'http://localhost:5000';

const SellingPost = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showImg, setShowImg] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // 세션 로그인 확인
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/check`, { credentials: 'include' });
        const d = await r.json();
        setIsLoggedIn(!!d?.loggedIn);
        if (!d?.loggedIn) navigate('/login');
      } catch {
        setIsLoggedIn(false);
        navigate('/login');
      }
    })();
  }, [navigate]);

  const MAX_IMAGES = 6;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const productOptions = ['상추', '토마토', '감자', '당근', '마늘', '가지', '기타'];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setIsProductDropdownOpen(false);
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return false; }
    if (file.size > MAX_FILE_SIZE) { alert('파일 크기는 5MB 이하로 업로드해주세요.'); return false; }
    return true;
  };

  const handleAddImg = useCallback((e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    const valid = newFiles.filter(validateFile);
    if (valid.length === 0) { e.target.value = null; return; }
    const remaining = MAX_IMAGES - selectedFiles.length;
    if (remaining <= 0) { alert(`최대 ${MAX_IMAGES}장까지만 업로드 가능합니다.`); e.target.value = null; return; }
    const filesToUpload = valid.slice(0, remaining);
    if (filesToUpload.length < valid.length) {
      alert(`최대 ${MAX_IMAGES}장까지만 업로드 가능하여 ${filesToUpload.length}장만 추가됩니다.`);
    }
    const urls = filesToUpload.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...filesToUpload]);
    setShowImg((prev) => [...prev, ...urls]);
    e.target.value = null;
  }, [selectedFiles.length]);

  const handleDeleteImg = (index) => {
    URL.revokeObjectURL(showImg[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setShowImg((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (title, price) => {
    if (!title?.trim()) { alert('제목을 입력해주세요.'); return false; }
    if (!selectedProduct) { alert('상품명을 선택해주세요.'); return false; }
    if (price === '' || price === null || price === undefined) { alert('가격을 입력해주세요.'); return false; }
    if (isNaN(price) || Number(price) < 0) { alert('올바른 가격을 입력해주세요.'); return false; }
    return true;
  };

  const resetForm = (form) => {
    setSelectedFiles([]); setShowImg([]); setSelectedProduct(''); form.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const title = e.target.title.value.trim();
    const price = e.target.price.value.trim();
    const description = e.target.description.value.trim();
    if (!validateForm(title, price)) return;

    setIsSubmitting(true);
    try {
      // 1) 상품 메타 생성 (JSON)
      const createBody = {
        title,
        unit_price: Number(price),
        available_qty: 1,
        category: '채소',
        variety: selectedProduct,
        description,
        location: '',
      };
      const res = await fetch(`${API}/api/market/listings`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createBody),
      });
      const data = await res.json();
      if (!res.ok || !data?.id) {
        alert(data?.error || '상품 등록에 실패했습니다.');
        setIsSubmitting(false);
        return;
      }
      const listingId = data.id;

      // 2) 이미지 업로드 (FormData, 필드명: files)
      if (selectedFiles.length > 0) {
        const fd = new FormData();
        selectedFiles.forEach((file) => fd.append('files', file));
        const imgRes = await fetch(`${API}/api/market/listings/${listingId}/images`, {
          method: 'POST', credentials: 'include', body: fd,
        });
        if (!imgRes.ok) {
          const err = await imgRes.json().catch(() => ({}));
          alert(err?.error || '이미지 업로드에 실패했습니다. (상품은 등록됨)');
        }
      }

      alert('상품이 성공적으로 등록되었습니다!');
      resetForm(e.target);
      navigate('/pagination');
    } catch (err) {
      console.error(err);
      alert('서버 통신에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => () => showImg.forEach((url) => URL.revokeObjectURL(url)), [showImg]);

  return (
    <div className="sellingpost">
      <div className="container">
        <main className="main-grid">
          <section className="title-section">
            <h2 className="form-title">상품 등록</h2>
            <div className="form-desc">상품에 대한 자세한 정보를 입력해 주세요.</div>
          </section>

          <section className="upload-section">
            <div className="upload-title">
              사진 올리기 <span className="upload-count">({selectedFiles.length}/{MAX_IMAGES})</span>
            </div>
            <div className="upload-box">
              {showImg.length === 0 ? (
                <label htmlFor="img" className="upload-btn">+</label>
              ) : (
                <div className="preview-images">
                  {showImg.map((image, idx) => (
                    <div key={idx} className="imgBox">
                      <img src={image} alt={`상품 이미지 ${idx + 1}`} />
                      <button onClick={() => handleDeleteImg(idx)} className="delete-btn" type="button">
                        <span className="material-symbols-outlined">X</span>
                      </button>
                    </div>
                  ))}
                  {selectedFiles.length < MAX_IMAGES && (
                    <div className="imgBox add-more-box">
                      <label htmlFor="img" className="add-more-btn">+</label>
                    </div>
                  )}
                </div>
              )}
              <input id="img" type="file" accept="image/*" multiple onChange={handleAddImg}
                     disabled={selectedFiles.length >= MAX_IMAGES} style={{ display: 'none' }} />
            </div>
          </section>

          <section className="form-section">
            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">제목 *</label>
                <input id="title" type="text" name="title" placeholder="제목을 입력해주세요" required maxLength={100} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>상품명 *</label>
                  <div className="dropdown-container">
                    <div className="dropdown-input" onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)} role="button" tabIndex={0}>
                      <span className={selectedProduct ? 'selected-text' : 'placeholder-text'}>
                        {selectedProduct || '상품을 선택하세요'}
                      </span>
                      <span className={`dropdown-arrow ${isProductDropdownOpen ? 'open' : ''}`}>▼</span>
                    </div>
                    {isProductDropdownOpen && (
                      <div className="dropdown-list">
                        {productOptions.map((product, index) => (
                          <div key={index} className="dropdown-item" onClick={() => handleProductSelect(product)}>
                            {product}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="price">가격 *</label>
                <input id="price" type="number" name="price" placeholder="포인트 가격을 입력해주세요" required min="0" />
              </div>

              <div className="form-group">
                <label htmlFor="description">상품 설명란 *</label>
                <textarea id="description" name="description" placeholder="판매 수량을 포함하여 자세한 상품 설명을 입력해주세요" rows={4} required maxLength={3000} />
              </div>

              <button className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} type="submit" disabled={isSubmitting || !isLoggedIn}>
                등록하기
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SellingPost;
