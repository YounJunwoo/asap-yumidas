import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Graph({ data = [], color = "#87ceeB" }) {
  const labels = data.map((d) =>
	  dayjs(d.x).format('MM-DD HH:mm')
  );
  const chartData = {
    labels,
    datasets: [
      {
        data: data.map((d) => d.y),
        borderColor: color,
        backgroundColor: color + "80",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 31,
        },
      },
      y: {
        display: true,
        ticks: {
          padding: 15,
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
      }
    },
  };

  return (
    <>
      {data.length > 0 && <Line options={options} data={chartData} />}
    </>
  );
}

export default Graph;