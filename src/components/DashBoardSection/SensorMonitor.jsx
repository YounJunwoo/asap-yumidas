import React from 'react';
import useSensorMonitor from '../../hooks/useSensorMonitor';
import './SensorMonitor.css'; 


const SensorMonitor = ({ warningNotification }) => {
  const { sensorData, loading } = useSensorMonitor(warningNotification);

  if (loading) {
    console.log('센서 데이터를 불러오는 중');
  }

  return (
    <>
      <div className="sensor-wrapper">
  <div className="sensor-row">
    <div className="card temperature">
      <div className="card-title">온도</div>
      <div className="card-value">{sensorData?.temperature ?? '-'}</div>
      <div className="card-unit">°C</div>
    </div>
    <div className="card humidity">
      <div className="card-title">습도</div>
      <div className="card-value">{sensorData?.humidity ?? '-'}</div>
      <div className="card-unit">%</div>
    </div>
    <div className="card soil">
      <div className="card-title">토양습도</div>
      <div className="card-value">{sensorData?.soildry ? '건조' : '습함'}</div>
      <div className="card-unit">&nbsp;</div>
    </div>
    <div className="card insolation">
      <div className="card-title">일사량</div>
      <div className="card-value">{sensorData?.lightvalue ?? '-'}</div>
      <div className="card-unit">wh/㎡</div>
    </div>
    <div className="card water">
      <div className="card-title">물통칸</div>
      <div className="card-value">{sensorData?.waterlow ? '부족' : '충분'}</div>
      <div className="card-unit">&nbsp;</div>
    </div>
  </div>
</div>
    </>
  );
};

export default SensorMonitor;
