import { useEffect, useState } from 'react';

const usePriceTrend = (crop) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!crop) {
      setLoading(false);
      return;
    }

    console.log("API 호출 crop:", crop, "url:", `/predict/${crop}`);

    const fetchPriceTrend = async () => {
      setLoading(true);
      setError(null);

      try { //api 바꾸기
        const res = await fetch(`http://localhost:5000/predict/${crop}`);

        if (!res.ok) {
          throw new Error("가격 예측 API 요청 실패");
        }

        const json = await res.json();
        console.log('API 응답 데이터',json);
        setData(json);
      } catch (err) {
        console.error("가격 예측 페이지 에러 발생:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceTrend();
  }, [crop]);

  return { loading, error, data };
};

export default usePriceTrend;

