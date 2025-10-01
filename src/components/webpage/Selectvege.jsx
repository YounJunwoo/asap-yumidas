import './Selectvege.css'
import { useState, useEffect } from 'react';

const Selectvege = ({ isOpen, onClose, onEnter, deviceData }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isEntering, setIsEntering] = useState(false);

  // deviceData가 변경될 때 선택한 작물 초기화
  useEffect(() => {
    setSelectedCrop(null);
  }, [deviceData]);

  const handleEnter = async () => {
    if (selectedCrop !== null) {
      setIsEntering(true);
      try {
        // 선택한 작물의 전체 정보를 찾아서 전달
        const cropInfo = deviceData.crops.find(crop => crop.id === selectedCrop);
        if (cropInfo) {
          await onEnter(cropInfo);}
      } catch (error) {
        console.log('작물 선택 실패', error);
      }
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-layout" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">스마트팜 대시보드 들어가기</h2>
          <p className="modal-subtitle">메인화면을 선택하시오.</p>
          <p className="modal-instruction">하나를 고르세요</p>
        </div>
        
        <div className="crop-selection">
          {deviceData && deviceData.crops && (
            deviceData.crops.map((crop) => (
              <label key={crop.id} className="crop-option">
                <input
                  type="radio"
                  name="crop"
                  value={crop.id}
                  checked={selectedCrop === crop.id}
                  onChange={() => setSelectedCrop(crop.id)}
                />
                <span className="radio-custom"></span>
                <span className="crop-label">{crop.name}</span>
              </label>
            ))
          )}
        </div>
        
        <button 
          className="enter-button"
          onClick={handleEnter}
          disabled={selectedCrop === null || isEntering}>
          들어가기
        </button>
      </div>
    </div>
  );
};

export default Selectvege;