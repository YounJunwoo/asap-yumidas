import React from 'react';
import useForecast from '../../hooks/useForecast';
import './Forecast.css';

const Forecast = ({ lat, lon }) => {
  const { forecast, loading, error } = useForecast({ lat, lon });

  if (loading) console.log('로딩');
  if (error) console.log('에러');
  if (!forecast.length) console.log('데이터 없음');

  const today = new Date().toISOString().slice(0, 10);
  const futureForecast = forecast.filter(
    (item) => item.dt_txt && item.dt_txt.slice(0, 10) > today
  );

  return (
    <div className="forecast-container">
      <div className="forecast-list">
        {futureForecast.map((item) => (
          <div className="forecast-day" key={item.dt}>
            <div className="forecast-day-date">{item.dt_txt.slice(0, 10)}</div>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
            <div className="forecast-day-description">
              {item.weather[0].description}
            </div>
            <div className="forecast-day-temp">
              <div className="temp-block">
                <div className="temp-label">최고</div>
                <div className="temp-value">
                  {Math.round(item.main.temp_max)}°C
                </div>
              </div>
              <div className="temp-block">
                <div className="temp-label">최저</div>
                <div className="temp-value">
                  {Math.round(item.main.temp_min)}°C
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
