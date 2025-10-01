//import React from "react";
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

function Graph({ data = [], color = "#87ceeB" }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: { //x축 알맞게 수정
                type: 'time',
                time: {
                    unit: 'minute', // 시간 단위 설정
                    tooltipFormat: 'PPmm',
                },
                ticks: {
                    font: {
                        size: 13,
                    },
                },
            },
            y: { // y축 알맞게 수정
                ticks: {
                    stepSize: 0.2,
                    font: {
                        size: 13,
                    },  
                },
                // 데이터에 따라 자동으로 범위 조정
                beginAtZero: true,
                // 최대값과 최소값을 데이터에 따라 자동으로 설정
                suggestedMin: Math.min(...data.map(d => d.y)) * 0.9,
                suggestedMax: Math.max(...data.map(d => d.y)) * 1.1
            }
        }
    };

    const chartData = {
        datasets: [
            {
                data: data.map((d) => ({x:d.x, y:d.y})),
                borderColor: color,
                backgroundColor: color + "80"
            },
        ],
    };

    return <Line options={options} data={chartData} />;
}

export default Graph;



