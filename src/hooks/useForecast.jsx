import { useEffect, useState } from 'react';

const useForecast = ({lat, lon}) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = "e668179fc4c7fbb43aca2bd510936f7c";

  useEffect(() => {
    if (!API_KEY) {
      console.error('[useForecast] 날씨 API 키가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    if (!lat || !lon) {
      console.error('[useForecast] 위도 or 경도 누락');
      setLoading(false);
      return;
    }

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
        );

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error('날씨 API 응답 파싱 중 오류가 발생했습니다.');
        }

        if (!res.ok) {
          throw new Error(data.message || '날씨 API 요청 중 오류가 발생했습니다.');
        }

        // 날짜별로 temp_max, temp_min의 최대/최소를 계산
        const dailyMap = {};
        data.list.forEach(item => {
          const date = item.dt_txt.slice(0, 10);
          if (!dailyMap[date]) {
            dailyMap[date] = {
              ...item,
              temp_max: item.main.temp_max,
              temp_min: item.main.temp_min,
              weather: item.weather,
            };
          } else {
            dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, item.main.temp_max);
            dailyMap[date].temp_min = Math.min(dailyMap[date].temp_min, item.main.temp_min);
          }
        });

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const sortedDates = Object.keys(dailyMap)
          .filter(date => date >= today)
          .sort();

        // dailyMap의 각 날짜별 대표 item을 만들고, temp_max/min을 반영
        const forecastList = sortedDates.slice(0, 6).map(date => {
          const item = dailyMap[date];
          return {
            ...item,
            main: {
              ...item.main,
              temp_max: item.temp_max,
              temp_min: item.temp_min,
            },
            weather: item.weather,
          };
        });

        setForecast(forecastList);
      } catch (err) {
        console.error('[useForecast] 에러 발생:', err.message);
        setError(err.message);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon, API_KEY]);

  return { forecast, loading, error };
};

export default useForecast;

