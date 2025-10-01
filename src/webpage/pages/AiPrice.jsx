import React, { useState, useMemo } from "react";
import './AiPrice.css';
import lettuce from '../assets/lettuce.svg';
import spinach from '../assets/spinach.svg';
import usePriceTrend from '../hooks/usePriceTrend';
import AiGraph from '../components/AiGraph';

const AiPrice = () => {
  
  const [selectedTab, setSelectedTab] = useState("lettuce");
  const { data } = usePriceTrend(selectedTab);
  const [range, setRange] = useState("30"); 
  
  const cropNameMap = {
    lettuce: "상추",
    spinach: "시금치",
  };

  const cropImages = {
    lettuce: lettuce,
    spinach: spinach
  };

  const cropName = cropNameMap[selectedTab];

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = useMemo(() => new Date(), []);
  const todayString = useMemo(() => formatDate(today), [today]);

  // 어제, 오늘 데이터 추출
  const todayForecast = data?.detailed_forecast?.find(item => item.date === todayString);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayFormatted = formatDate(yesterday);
  const yesterdayForecast = data?.detailed_forecast?.find(item => item.date === yesterdayFormatted);

  // 변화율 계산
  let diffRate = null;
  let diffClass = "";
  if (todayForecast && yesterdayForecast) {
    const priceDiff = todayForecast.price - yesterdayForecast.price;
    diffRate = ((priceDiff / yesterdayForecast.price) * 100).toFixed(1);
    diffClass = priceDiff >= 0 ? "up" : "down";
  }

  // 예측 최고가 찾기
  const futureHighestPrice = useMemo(() => {
    if (!data?.detailed_forecast) return null;

    const futureData = data.detailed_forecast
      .filter(item => item.date > todayString)
      .sort((a, b) => b.price - a.price);

    return futureData.length > 0 ? futureData[0] : null;
  }, [data, todayString]);

  // 7일, 30일 데이터 필터링 코드
  const filteredData = useMemo(() => {
    if (!data?.detailed_forecast) return [];

    let startDate = new Date(today);
    let endDate = new Date(today);

    if (range === "7") {
      startDate.setDate(today.getDate() + 1);
      endDate.setDate(today.getDate() + 6);
    } else if (range === "30") {
      startDate.setDate(today.getDate() + 1);
      endDate.setDate(today.getDate() + 29); 
    }

    const startDateString = formatDate(startDate);
    const endDateString = formatDate(endDate);

    return data.detailed_forecast
      .filter(item => item.date >= startDateString && item.date <= endDateString)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, range, today]);

  /*if (loading) return console.log("불러오는 중...");
  if (error) return console.log("에러 발생:", error);
  if (!data) return console.log("데이터 없음");*/

  return (
    <div className="AiPrice">
      <div className="container">
        <main className="main-grid">
          <div className="header-section">
            <section className="title-section">
              <h2 className="form-title">AI 가격 예측 시스템</h2>
              <div className="form-desc">
                농작물의 가격 정보를 AI 데이터로 예측할 수 있습니다.
              </div>
            </section>

            <div className="tab-container">
              <button
                className={`tab-button ${selectedTab === "lettuce" ? "active" : ""}`}
                onClick={() => setSelectedTab("lettuce")}
              >상추 가격예측
              </button>
              <button
                className={`tab-button ${selectedTab === "spinach" ? "active" : ""}`}
                onClick={() => setSelectedTab("spinach")}
              >시금치 가격예측
              </button>
            </div>
          </div>

          <section className="price-title-section">
            <div className="price-title"> {cropName} 가격 예측</div>
            <span className="price-title-desc"> [ {todayString} ] 일자 kg 상자, 특등급 기준 </span>
          </section>

          <section className="price-card-section">
            <article className="stat-card">
              <div className="price-stat-label">예측 최고가</div>
              <div className="price-stat-value">
                {futureHighestPrice?.price?.toLocaleString() || "-"}원
              </div>
              <div className="highest-price-stat-value">
                {futureHighestPrice?.date || "-"}
              </div>
            </article>

            <article className="stat-card">
              <div className="price-stat-label">30일 평균 예측가</div>
              <div className="price-stat-value">
                {data?.["30_day_average_price"]?.toLocaleString() || "-"}원
              </div>
            </article>

            <article className="stat-card">
              <div className="price-stat-label">전일 대비 오늘 가격</div>
              <div className="price-stat-row">
                <div className="price-stat-value">
                  {todayForecast ? `${todayForecast.price.toLocaleString()}원` : "데이터 없음"}
                </div>
                {diffRate !== null && (
                  <div className={`stat-diff ${diffClass}`}>
                    {diffRate > 0 ? `+${diffRate}%` : `${diffRate}%`}
                  </div>
                )}
              </div>
            </article>
          </section>

          <div className="price-graph-title">
            📈 {cropName} 가격 예측 그래프
            <span className="price-graph-desc1">kg 상자, 특등급 기준</span>
            <span className="price-graph-desc2">가격 단위: 원</span>
          </div>

          <section className="price-graph-section">
            <div className="graph-tabs">
              <button
                className={`graph-tab ${range === "7" ? "active" : ""}`}
                type="button"
                onClick={() => setRange("7")}
              >
                7일
              </button>
              <button
                className={`graph-tab ${range === "30" ? "active" : ""}`}
                type="button"
                onClick={() => setRange("30")}
              >
                30일
              </button>
            </div>

            <div id="graph-section" className="graph-section" aria-label="chart-container">
              <AiGraph data={filteredData} color="#4CAF50" />
            </div>
          </section>

          <section className="harvest-day-section">
            <h2 className="harvest-day-title">
              📅 가격예측 기반 최적의 재배일 추천
            </h2>
            <span className="harvest-day-desc">수익 극대화를 위한 추천 재배일</span>
          </section>

          <section className="harvest-price">
            <div className="prediction-card">
              <div className="crop-info">
              <img className="predict-img"
              src={cropImages[selectedTab]}
            alt={`${cropName} 이미지`}/>
                <div className="crop-meta">
                  <div className="meta-label">작물명</div>
                  <div className="meta-value">{cropName}</div>
                </div>
              </div>

              <div className="metric">
                <div className="metric-label">추천 재배일</div>
                <div className="metric-value">{futureHighestPrice?.date || "-"}</div>
              </div>

              <div className="metric">
                <div className="metric-label">예측 가격(원/kg)</div>
                <div className="metric-value">
                  {futureHighestPrice?.price?.toLocaleString() || "-"}원
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AiPrice;






