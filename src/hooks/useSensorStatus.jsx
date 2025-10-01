import { useState, useEffect } from 'react';

const POLLING_INTERVAL = 5000;

const useSensorStatus = (sensorId, pollingInterval = POLLING_INTERVAL) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sensorId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let timeoutId = null;

    const fetchSensorStatus = async () => {
      if (!isMounted) return;

      try {
        const response = await fetch(`http://localhost:5000/api/sensor/${sensorId}/state`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // ✅ 세션 쿠키 포함
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `센서 상태 조회 실패 (${response.status}): ${response.statusText}`
          );
        }

        const data = await response.json();

        // 예: {"isOn": true} 또는 {"value": 684}
        const active = data.isOn ?? data.active ?? data.status === 'active';
        if (isMounted) {
          setIsActive(Boolean(active));
          setError(null);
        }
      } catch (error) {
        console.error('센서 상태 조회 오류:', error);
        if (isMounted) {
          setIsActive(false);
          setError(error.message || '센서 상태를 가져오는 중 오류 발생');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // 첫 조회 + 주기적 조회
    fetchSensorStatus();
    timeoutId = setInterval(fetchSensorStatus, pollingInterval);

    return () => {
      isMounted = false;
      if (timeoutId) clearInterval(timeoutId);
    };
  }, [sensorId, pollingInterval]);

  return { isActive, loading, error };
};

export default useSensorStatus;

