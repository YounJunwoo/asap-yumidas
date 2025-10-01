import React from 'react';
import Actuator from '../../components/DashBoardSection/Actuator';
import Weather from '../../components/DashBoardSection/Weather';
import UsageStatus from '../../components/DashBoardSection/UseStatus';
import SensorMonitor from '../../components/DashBoardSection/SensorMonitor';
import './DashBoard.css';

// 이름 수정: Dashboard → DashBoard
const DashBoard = () => {
  return (
    <div className="dashboard">
    <div className="dashboard-main">
      <div className="content-layout">
        <div className="bottom-row">
          {/* 왼쪽 열: 센서카드 + 현재기온 */}
          <div className="sensor-weather-column">
            <SensorMonitor />
            <div className="weather-box">
              <Weather />
            </div>
          </div>

          {/* 오른쪽 열: 상태 + 제어 */}
          <div className="side-info">
            <UsageStatus />
            <Actuator />
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

// 이름 통일
export default DashBoard;
