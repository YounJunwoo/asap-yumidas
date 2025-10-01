import React, { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); //1초마다 업데이트

    return () => clearInterval(intervalId); 
  }, []);

  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const day = currentTime.getDate().toString().padStart(2, '0');
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');

  return (
    <div className="clock-wrapper">
      <div className="date-row">
        <div className="date-block">{month}</div>
        <div className="date-block">월</div>
        <div className="date-block">{day}</div>
        <div className="date-block">일</div>
      </div>
      <div className="time-row">
        <div className="time-block">{hours}</div>
        <div className="time-block">:</div>
        <div className="time-block">{minutes}</div>
      </div>
    </div>
  );
};

export default Clock;
