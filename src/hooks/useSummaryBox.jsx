// src/hooks/useSummaryBox.js
import { useEffect, useState } from 'react';

function useSummaryBox(sensorId) {
  const [average, setAverage] = useState("-");
  const [highest, setHighest] = useState("-");
  const [lowest, setLowest] = useState("-");

  useEffect(() => {
    if (!sensorId) return;

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sensor-summary/${sensorId}?date=${today}`);
        const json = await response.json();
	setAverage(json.average !== "-" ? parseFloat(json.average).toFixed(1) : "-");
	setHighest(json.highest !== "-" ? parseFloat(json.highest).toFixed(1) : "-");
	setLowest(json.lowest !== "-" ? parseFloat(json.lowest).toFixed(1) : "-");
      } catch (error) {
        console.error("요약 데이터 로딩 실패:", error);
        setAverage("-");
        setHighest("-");
        setLowest("-");
      }
    };

    fetchSummary();
  }, [sensorId]);

  return { average, highest, lowest };
}

export default useSummaryBox;

