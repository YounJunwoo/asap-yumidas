
import React, { useRef } from 'react';
import useSensorStatus from '../../hooks/useSensorStatus';
import './UseStatus.css';

const devices = [
  { name: '관수 펌프', sensorId: 'pumpactive' },
  { name: 'LED', sensorId: 'lightvalue' },
  { name: '온도센서', sensorId: 'temperature' },
  { name: '습도센서', sensorId: 'humidity' },
];

const UsageStatus = () => {
  const prevStatuses = useRef(Array(devices.length).fill(false));

  // 훅을 컴포넌트 최상위에서 순서대로 호출
  const pumpactive = useSensorStatus('pumpactive');
  const lightvalue = useSensorStatus('lightvalue');
  const temperature = useSensorStatus('temperature');
  const humidity = useSensorStatus('humidity');

  const rawStatuses = [pumpactive, lightvalue, temperature, humidity];

  const statuses = rawStatuses.map((status, idx) => {
    if (!status.loading) {
      prevStatuses.current[idx] = status.isActive;
    }
    return { ...status, isActive: prevStatuses.current[idx] };
  });

  return (
    <div className="usage-status">
      <p className="usage-status-topic">
        <span className="span">제어장치 사용현황</span>
        <span className="text-wrapper-2">&nbsp;</span>
      </p>
      <div className="table-wrapper">
        <div className="frame">
          {/* 장치명 컬럼 */}
          <div className="column-text">
            <div className="title-cell">
              <div className="column-title">장치명</div>
            </div>
            {devices.map((device) => (
              <div className="body-cell" key={device.sensorId}>
                <div className="div">
                  <div className="cell-text">{device.name}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 사용여부 컬럼 */}
          <div className="column-text-2">
            <div className="title-cell-2">
              <div className="column-title-wrapper">
                <div className="column-title">기기 사용</div>
              </div>
            </div>
            {statuses.map((status, idx) => (
              <div className="body-cell-2" key={devices[idx].sensorId}>
                {status.isActive ? (
                  <div className="used-icon" title="사용" />
                ) : (
                  <div className="unused-icon" title="미사용" />
                )}
              </div>
            ))}
          </div>
          {/* 수동/자동 컬럼 */}
          <div className="column-text">
            <div className="title-cell-3">
              <div className="text-wrapper-3">
                <div className="column-title-2">수동/자동</div>
              </div>
            </div>
            {devices.map((_, idx) => (
              <div className="body-cell" key={idx}>
                <div className="div">
                  <div className="text-wrapper-5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="legend-wrapper">
        <div className="used">
          <div className="used-icon" />
          사용
        </div>
        <div className="unused">
          <div className="unused-icon" />
          미사용
        </div>
      </div>
    </div>
  );
};


export default UsageStatus;

