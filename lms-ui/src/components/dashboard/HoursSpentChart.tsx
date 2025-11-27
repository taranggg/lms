import React, { useRef, useEffect } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function HoursSpentChart({
  data,
}: {
  data: { month: string; study: number; exams: number }[];
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Study",
            data: data.map((d) => d.study),
            backgroundColor: "#ff9800",
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
          {
            label: "Exams",
            data: data.map((d) => d.exams),
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#ff9800",
              font: { size: 14, weight: "bold" },
              boxWidth: 16,
              boxHeight: 16,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#23234f",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "#fff",
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${context.parsed.y} Hr`;
              },
            },
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#23234f",
              font: { size: 14 },
            },
          },
          y: {
            beginAtZero: true,
            max: 80,
            ticks: {
              stepSize: 20,
              callback: (value) => `${value} Hr`,
              color: "#23234f",
              font: { size: 14 },
            },
            grid: {
              color: "#eee",
            },
          },
        },
        layout: {
          padding: 20,
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <div className="bg-white rounded-xl p-6 shadow flex-1">
      <div className="font-semibold mb-2">Hours Spent</div>
      <div className="text-sm text-gray-500 mb-4">Study vs Exams</div>
      <canvas ref={chartRef} height={260} />
    </div>
  );
}
