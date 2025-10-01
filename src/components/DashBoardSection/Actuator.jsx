import React from 'react';
import useActuatorControl from '../../hooks/useActuatorControl';
import './Actuator.css';

const Actuator = () => {
  const [isManual, setIsManual] = React.useState(true);

  const pump = useActuatorControl("pump");
 // const fan = useActuatorControl("fan");
 // const windowMotor = useActuatorControl("window-motor");


  return (
    <div className="actuator">
      <div className="actuator-header">
        <div className="actuator-topic">제어장치 시스템</div>
        <div className="toggle-wrapper">
          <label className="switch">
            <input
              type="checkbox"
              checked={isManual}
              onChange={() => setIsManual(!isManual)}
            />
            <span className="slider" />
          </label>
          <div className="toggle-status-text">
            {isManual ? '수동' : '자동'}
          </div>
        </div>
      </div>

      <div className="pump">
        <div className="pump-text">관수 펌프</div>
        <button
          className={`icon-button ${pump.isOn ? 'on' : 'off'}`}
          onClick={() => isManual && pump.toggleSensor(!pump.isOn)}
          disabled={!isManual || pump.loading}
        >
          {pump.loading ? "..." : pump.isOn ? 'ON' : 'OFF'}
        </button>
      </div>

    { /* <div className="fan">

        <div className="fan-text">냉각팬</div>
        <button
          className={`icon-button ${fan.isOn ? 'on' : 'off'}`}
          onClick={() => isManual && fan.toggleSensor(!fan.isOn)}
          disabled={!isManual || fan.loading}
        >
          {fan.loading ? "..." : fan.isOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="window">
        <div className="window-motor-text">창문 개폐 모터</div>
        <button
          className={`icon-button ${windowMotor.isOn ? 'on' : 'off'}`}
          onClick={() => isManual && windowMotor.toggleSensor(!windowMotor.isOn)}
          disabled={!isManual || windowMotor.loading}
        >
          {windowMotor.loading ? "..." : windowMotor.isOn ? 'ON' : 'OFF'}
        </button>
      </div> */}

    </div>
  );
};

export default Actuator;