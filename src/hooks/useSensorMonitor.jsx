import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ['websocket'],
});

function useSensorMonitor() {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Socket.IO 연결됨');
    });

    socket.on('update_data', (data) => {
      console.log('📡 수신된 센서 데이터:', data);
      setSensorData(data);
    });

    return () => {
      socket.off('update_data');
    };
  }, []);

  return { sensorData };
}

export default useSensorMonitor;

