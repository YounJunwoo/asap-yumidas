//센서 On/Off 제어
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL|| 'http://localhost:5000';

const useActuatorControl = (sensorId) => {
  const [isOn, setIsOn] = useState(false);//true면 on, false면 off
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorState = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sensor/${sensorId}/state`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
             // 'Authorization': `Bearer ${token}` 인증 토큰일 경우
          },
        });

        if (!response.ok) {
          throw new Error(`센서 상태 조회 실패: ${response.statusText}`);
        }

        const data = await response.json();
        setIsOn(data.isOn);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorState();
  }, [sensorId]);

  const toggleSensor = async (turnOn) => {
    if (loading) return; 
    // 이미 로딩 중이면 중복 요청 방지

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sensor/${sensorId}/${turnOn ? 'on' : 'off'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `센서 제어 실패: ${response.statusText}`);
      }

      const data = await response.json();
      setIsOn(data.isOn ?? turnOn); // 서버 응답에 isOn이 있으면 사용
    } catch (error) {
      setError(error.message);
      // 실패 시 이전 상태로 되돌리지 않게
    } finally {
      setLoading(false);
    }
  };

  return { 
    isOn, 
    loading, 
    error, 
    toggleSensor,
    turnOn: () => toggleSensor(true),
    turnOff: () => toggleSensor(false)
  };
};

export default useActuatorControl;
