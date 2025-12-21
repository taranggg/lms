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

import { useTheme } from "next-themes";

export default function HoursSpentChart({
  data,
}: {
  data: { month: string; study: number; exams: number }[];
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  // Chart instance ref to destroy/update
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous instance
    if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
    }

    const isDark = theme === 'dark';
    const textColor = isDark ? "#e2e8f0" : "#64748b"; // slate-200 : slate-500
    const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Study",
            data: data.map((d) => d.study),
            backgroundColor: "#fbbf24", // amber-400
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
          {
            label: "Exams",
            data: data.map((d) => d.exams),
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(226, 232, 240, 1)", // slate-200
            borderRadius: 8,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#fbbf24",
              font: { size: 14, weight: "bold" },
              boxWidth: 16,
              boxHeight: 16,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: isDark ? "#1e293b" : "#0f172a",
            titleColor: "#f8fafc",
            bodyColor: "#f8fafc",
            borderColor: isDark ? "#334155" : "transparent",
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${context.parsed.y} Hr`;
              },
            },
            padding: 12,
            cornerRadius: 12,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            max: 80,
            ticks: {
              stepSize: 20,
              callback: (value) => `${value} Hr`,
              color: textColor,
              font: { size: 12 },
            },
            grid: {
              color: (context) => context.tick.value === 0 ? 'transparent' : gridColor,
            },
            border: {
                display: false
            }
          },
        },
        layout: {
          padding: 10,
        },
      },
    });

    return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
    };
  }, [data, theme]); // Re-render when theme changes

  return (
    <div className="bg-white/50 dark:bg-card/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-8 shadow-sm flex-1">
      <div className="font-bold text-xl mb-1 text-slate-800 dark:text-slate-100">Hours Spent</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Study vs Exams</div>
      <div className="relative w-full h-[260px]">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
