// src/hooks/useGraphData.js
import { useEffect, useState } from 'react';

function useGraphData(sensorId) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!sensorId) return;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const fetchGraph = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sensor-data/${sensorId}?date=${today}`);
        const json = await res.json();
        const graphData = json.data.map((item) => ({
          x: item.timestamp,
          y: item.value,
        }));
        setData(graphData);
      } catch (e) {
        console.error("그래프 데이터 로딩 실패:", e);
        setData([]);
      }
    };

    fetchGraph();
  }, [sensorId]);

  return { data };
}

export default useGraphData;

