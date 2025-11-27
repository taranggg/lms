import React, { useState } from "react";

interface WeeklyCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setDate(date.getDate() - d.getDay()); // Sunday as start
  d.setHours(0, 0, 0, 0);
  return d;
}

function addWeeks(date: Date, weeks: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function getWeekDays(start: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeeklyCalendar({
  selected,
  onSelect,
  className,
}: WeeklyCalendarProps) {
  const today = new Date();
  // Always show the running week by default
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today));
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const weekDays = getWeekDays(weekStart);
  const selectedDate = selected;

  // Month/year for header
  const monthLabel = weekStart.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Month picker logic
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split("-").map(Number);
    const firstDay = new Date(year, month, 1);
    setWeekStart(getWeekStart(firstDay));
    setMonthPickerOpen(false);
  };

  // Generate month options for picker
  const months = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12 + i);
    return d;
  });

  return (
    <div
      className={`bg-gray-50 rounded-xl p-4 mb-4 w-full max-w-full ${
        className || ""
      }`}
      style={{ overflow: "hidden" }}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setWeekStart(addWeeks(weekStart, -1))}
          aria-label="Previous week"
        >
          &#8592;
        </button>
        <div
          className="font-semibold text-lg cursor-pointer"
          onClick={() => setMonthPickerOpen((v) => !v)}
        >
          {monthLabel}
        </div>
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setWeekStart(addWeeks(weekStart, 1))}
          aria-label="Next week"
        >
          &#8594;
        </button>
      </div>
      {monthPickerOpen && (
        <div className="mb-2 flex justify-center">
          <select
            className="border rounded p-1 text-sm"
            value={`${weekStart.getFullYear()}-${weekStart.getMonth()}`}
            onChange={handleMonthChange}
          >
            {months.map((d) => (
              <option
                key={d.toISOString()}
                value={`${d.getFullYear()}-${d.getMonth()}`}
              >
                {d.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex justify-between items-center gap-1">
        {weekDays.map((d, i) => {
          const isSelected =
            selectedDate && d.toDateString() === selectedDate.toDateString();
          const isToday = d.toDateString() === today.toDateString();
          return (
            <button
              key={d.toDateString()}
              className={`flex flex-col items-center px-2 py-1 rounded-xl transition font-semibold shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-300
                ${
                  isSelected
                    ? "bg-teal-500 text-white scale-105 shadow-lg border-teal-300"
                    : isToday
                    ? "bg-yellow-400 text-white border-yellow-500 scale-105 shadow-lg"
                    : "bg-white text-gray-700 hover:bg-teal-50 hover:scale-105"
                }
              `}
              style={{ minWidth: 28 }}
              onClick={() => onSelect?.(d)}
            >
              <span
                className={`text-[10px] mb-0.5 font-medium ${
                  isSelected
                    ? "text-white"
                    : isToday
                    ? "text-white"
                    : "text-teal-400"
                }`}
              >
                {dayLabels[i]}
              </span>
              <span className="text-sm font-bold tracking-wide">
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
