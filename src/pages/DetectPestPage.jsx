import { useState, useEffect, useRef } from 'react';
import './DetectPestPage.css';
import location from '../assets/location_on.svg';
//import farmDummy from '../icons/farm-dummy.svg';

const DetectPestPage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [pests, setPests] = useState([]);
  // ADD: 선택된 마커(팝업용) 상태
  const [activePest, setActivePest] = useState(null);
  const popoverRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // (생략 가능) 더미 데이터 예시
  /*
  useEffect(() => {
    //확인용 더미데이터
    setImageUrl(farmDummy); 
    setPests([
      { id: 1, x: 20, y: 30 }
    ]);
}, []);*/

  const fetchFarmImage = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/farm-image', {
        method: 'GET',
      });
      if (!res.ok) return console.log('농장사진 이미지 받아오기 실패');
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('농장사진 이미지 API 요청 오류 발생', error);
    }
  };

  const fetchPestCoordinates = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/pest-coordinates', {
        method: 'GET',
      });
      if (!res.ok) return console.log('병해충 좌표 데이터 API 연결 실패');
      const data = await res.json();
      setPests(data.detections);
    } catch (error) {
      console.error('병해충 좌표 API 요청 오류 발생', error);
    }
  };

  useEffect(() => {
    fetchFarmImage();
    fetchPestCoordinates();
  }, []);

  // ADD: 팝업 열기
  const openPopover = (pest, e) => {
    lastFocusedRef.current = e?.currentTarget ?? null;
    setActivePest(pest);
  };

  // ADD: 팝업 닫기 (ESC/외부 클릭 포함)
  const closePopover = () => {
    setActivePest(null);
    // 포커스 복귀(접근성)
    if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  };

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape') closePopover();
    };
    if (activePest) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePest]);

  return (
    <div className="detectpest-container">
      <div className="detectpest-title">농장 사진</div>

      <div className="detectpest-photobox">
        <div className="image-container" aria-live="polite">
          {imageUrl ? (
            <img src={imageUrl} alt="농장 사진" className="farm-image" />
          ) : (
            <div className="no-image">이미지를 불러올 수 없습니다</div>
          )}

          {/* 마커 렌더링 */}
          {pests.map((pest) => (
            <button
              key={pest.id}
              type="button"
              className="pest-marker"
              style={{
                left: `${pest.x}%`,
                top: `${pest.y}%`,
                background: 'transparent',
                border: 0,
                padding: 0,
              }}
              onClick={(e) => openPopover(pest, e)}
              aria-label={`병해충 위치(${Math.round(pest.x)}%, ${Math.round(
                pest.y
              )}%) 상세보기`}
            >
              <img
                src={location}
                alt=""
                aria-hidden="true"
                style={{ width: '100%', height: '100%' }}
              />
            </button>
          ))}

          {/* ADD: 외부 클릭 감지를 위한 투명 백드롭 */}
          {activePest && (
            <div className="pest-backdrop" onClick={closePopover} />
          )}

          {/* ADD: 팝업(마커 위에 작은 카드) */}
          {activePest && (
            <div
              ref={popoverRef}
              className="pest-popover"
              role="dialog"
              aria-modal="false"
              style={{ left: `${activePest.x}%`, top: `${activePest.y}%` }}
            >
              <button
                className="pest-popover__close"
                onClick={closePopover}
                aria-label="닫기"
              >
                ×
              </button>

              <div className="pest-popover__head">
                <span>병해충 감지</span>
                {typeof activePest.confidence === 'number' && (
                  <span style={{ fontWeight: 600 }}>
                    ({Math.round(activePest.confidence * 100)}%)
                  </span>
                )}
              </div>

              {activePest.thumbUrl && (
                <img
                  src={activePest.thumbUrl}
                  alt={`${activePest.type || '병해충'} 미리보기`}
                  className="pest-popover__thumb"
                  loading="lazy"
                />
              )}

              <div className="pest-popover__meta">
                <div>종류: {activePest.type || '알 수 없음'}</div>
                <div>
                  위치: X {Math.round(activePest.x)}%, Y{' '}
                  {Math.round(activePest.y)}%
                </div>
                {activePest.detectedAt && (
                  <div>감지시각: {activePest.detectedAt}</div>
                )}
                {activePest.note && <div>메모: {activePest.note}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetectPestPage;