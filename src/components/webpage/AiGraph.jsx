import {
  Chart as ChartJS,
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Graph({ data = [], color }) {
  if (!data.length) return null;

  // 최댓값과 인덱스 찾기
  const maxPrice = Math.max(...data.map(d => d.price));
  const maxIndex = data.findIndex(d => d.price === maxPrice);

  const chartData = {
    datasets: [
      {
        label: "예측 가격",
        data: data.map(d => ({ x: d.date, y: d.price })),
        borderColor: color,
        backgroundColor: color + "80",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${value.toLocaleString()} 원${value === maxPrice ? " 최대값" : ""}`;
          },
        },
      },
      // 최댓값 라벨 표시
      afterDatasetsDraw: (chart) => {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        if (!dataset) return;

        const meta = chart.getDatasetMeta(0);
        const point = meta.data[maxIndex];
        if (!point) return;

        ctx.save();
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(
          `${dataset.data[maxIndex].y.toLocaleString()}원 최대값`,
          point.x,
          point.y - 10  
        );
        ctx.restore();
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "yyyy-MM-dd",
          displayFormats: { day: "yyyy-MM-dd" },
        },
        ticks: { font: { size: 13 } },
      },
      y: {
        ticks: {
          font: { size: 13 },
          callback: (value) => value.toLocaleString() + "원",
        },
        beginAtZero: false,
        suggestedMin: Math.min(...data.map(d => d.price)) * 0.9,
        suggestedMax: Math.max(...data.map(d => d.price)) * 1.1,
      }
    }
  };

  return <Line options={options} data={chartData} />;
}

export default Graph;


