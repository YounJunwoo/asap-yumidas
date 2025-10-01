import { useEffect, useState } from 'react';

const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];

const getWindDirection = (deg) => {
  if (deg == null || isNaN(deg)) return '정보없음';
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

const useWeather = (city) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = "e668179fc4c7fbb43aca2bd510936f7c"

  useEffect(() => {
    if (!API_KEY) {
      setError('날씨 API 키가 설정되지 않았습니다.');
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`
        );
        if (!res.ok) {
          throw new Error('API Error');
        }

        const data = await res.json();
        data.wind.direction = getWindDirection(data.wind?.deg);
        setWeather(data);
      } catch (error) {
        setError(error.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, API_KEY]);

  return { weather, loading, error };
};

export default useWeather;