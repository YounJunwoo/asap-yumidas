import { useState, useEffect, useRef } from 'react';
import './DetectPestPage.css';
import location from '../assets/location_on.svg';

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";

const DetectPestPage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [pests, setPests] = useState([]);
  const [cameraSize, setCameraSize] = useState({ camW: 0, camH: 0 });
  const [activePest, setActivePest] = useState(null);

  const containerRef = useRef(null);
  const popoverRef = useRef(null);
  const lastFocusedRef = useRef(null);

  /**
   * 사진 좌표를 화면 비율 좌표로 변환
   * camX, camY: 사진 원본 좌표
   * camW, camH: 사진 원본 크기
   * containerW, containerH: 화면 표시 영역 크기
   * return: { xPct, yPct } 화면 비율(0~100%)
   */

  // 사진 좌표 → 화면 좌표
  const mapCameraToScreenPercent = ({ camX, camY, camW, camH, containerW, containerH }) => {
    if (!containerW || !containerH || !camW || !camH) return { xPct: 0, yPct: 0 }; 
    // 사진 크기에 맞춰 화면 크기 계산
    const scale = Math.min(containerW / camW, containerH / camH);
    const displayW = camW * scale;
    const displayH = camH * scale;
    //중앙 정렬을 위해 오프셋 계산
    const offsetX = (containerW - displayW) / 2;
    const offsetY = (containerH - displayH) / 2;
    //화면 좌표 계산
    const screenX = offsetX + camX * scale;
    const screenY = offsetY + camY * scale;
    return { xPct: (screenX / containerW) * 100, yPct: (screenY / containerH) * 100 };
  };

  // 일정 간격으로 AI 감지 결과 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/api/detectpest/latest`);
        if (!res.ok) throw console.log('병해충 감지 서버 오류');

        const data = await res.json();
        const { frameUrl, camW, camH, detections = [] } = data;

        setImageUrl(frameUrl || null);
        setCameraSize({ camW: Number(camW) || 0, camH: Number(camH) || 0 });

        // 화면 크기에 맞춘 좌표 변환
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const mapped = detections.map((d) => {
            const { xPct, yPct } = mapCameraToScreenPercent({
              camX: Number(d.x) || 0,
              camY: Number(d.y) || 0,
              camW: Number(camW) || 0,
              camH: Number(camH) || 0,
              containerW: rect.width,
              containerH: rect.height,
            });
            return { ...d, xPct, yPct };
          });
          setPests(mapped);
        }
      } catch (e) {
        console.log('병해충 감지 api fetch 오류');
      }
    };
    fetchData();
    // 5초마다 갱신
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 사이즈 변경 시 좌표 재계산
  useEffect(() => {
    const onResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const { camW, camH } = cameraSize;
      if (!camW || !camH) return;
      const mapped = pests.map((d) => {
        const { xPct, yPct } = mapCameraToScreenPercent({
          camX: Number(d.x) || 0,
          camY: Number(d.y) || 0,
          camW,
          camH,
          containerW: rect.width,
          containerH: rect.height,
        });
        return { ...d, xPct, yPct };
      });
      setPests(mapped);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [cameraSize, pests]);

  // 팝업 열기
  const openPopover = (pest, e) => {
    lastFocusedRef.current = e?.currentTarget ?? null;
    setActivePest(pest);
  };
  //팝업 닫기 (ESC/외부 클릭 포함)
  const closePopover = () => {
    setActivePest(null);
    // 포커스 복귀(접근성)
    if (lastFocusedRef.current) lastFocusedRef.current.focus();
    lastFocusedRef.current = null;
  };
  useEffect(() => {
    const onKey = (ev) => { if (ev.key === 'Escape') closePopover(); };
    if (activePest) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePest]);

  return (
    <div className="detectpest-container">
      <div className="detectpest-title">농장 사진</div>
      <div className="detectpest-photobox">
        <div className="image-container" aria-live="polite" ref={containerRef}>
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
              style={{ left: `${pest.xPct}%`, top: `${pest.yPct}%` }}
              onClick={(e) => openPopover(pest, e)}
              aria-label={`병해충 위치(${Math.round(pest.xPct)}%, ${Math.round(pest.yPct)}%) 상세보기`}
            >
              <img src={location} alt="" aria-hidden="true" style={{ width: '100%', height: '100%' }} />
            </button>
          ))}

          {/* ADD: 외부 클릭 감지를 위한 투명 백드롭 */}
          {activePest && <div className="pest-backdrop" onClick={closePopover} />}
          {activePest && (
            <div
              ref={popoverRef}
              className="pest-popover"
              role="dialog"
              aria-modal="false"
              style={{ left: `${activePest.xPct}%`, top: `${activePest.yPct}%` }}
            >
              <button className="pest-popover__close" onClick={closePopover} aria-label="닫기">×</button>

              <div className="pest-popover__head">
                <span>병해충 감지</span>
                {typeof activePest.confidence === 'number' && (
                  <span style={{ fontWeight: 600 }}>({Math.round(activePest.confidence * 100)}%)</span>
                )}
              </div>

              {activePest.thumbUrl && <img src={activePest.thumbUrl} alt="미리보기" className="pest-popover__thumb" loading="lazy" />}
              <div className="pest-popover__meta">
                <div>종류: {activePest.type || '알 수 없음'}</div>
                <div>위치: X {Math.round(activePest.xPct)}%, Y {Math.round(activePest.yPct)}%</div>
                {activePest.detectedAt && <div>감지시각: {activePest.detectedAt}</div>}
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
