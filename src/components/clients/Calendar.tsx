import React from 'react';

export function Calendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

  return (
    <div className="bg-[#232323] rounded-lg p-4">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm text-gray-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
        {days.map((day) => (
          <div
            key={day}
            className={`text-center p-2 rounded-lg ${
              day === currentDate.getDate()
                ? 'bg-purple-500 text-white'
                : 'hover:bg-gray-700 cursor-pointer'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}