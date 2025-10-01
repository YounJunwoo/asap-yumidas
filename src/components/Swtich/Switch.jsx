import { useState, useEffect } from 'react';
import './Switch.css';

const Switch = ({ value, onToggle }) => {
  const [isOn, setIsOn] = useState(value);

  useEffect(() => {
    setIsOn(value);
  }, [value]);

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);

    if (onToggle) {
      onToggle(newValue);}
  };

  return (
    <label className="switch">
      <input type="checkbox" onChange={toggleSwitch} checked={isOn} />
      <span className="slider" />
      <span className={`switchTxt ${isOn ? 'toggleOn' : ''}`}>
        {isOn ? 'ON' : 'OFF'}
      </span>
    </label>
  );
};

export default Switch;
