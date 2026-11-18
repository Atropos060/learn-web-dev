import { buildCalendarGrid, isDateSelectable } from "../utils/date";

function CalendarGrid({
  year,
  month,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onDayClick,
}) {
  const weeks = buildCalendarGrid(year, month);
  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="calendar-table">
      <div className="weekdays-row" aria-hidden="true">
        {weekdays.map((dayName) => (
          <span className="weekday" key={dayName}>
            {dayName}
          </span>
        ))}
      </div>

      <div className="days-container">
        {weeks.map((week, weekIndex) => (
          <div className="week-row" key={weekIndex}>
            {week.map((cell, cellIndex) => {
              let classes = "day-cell";
              let isSelectable = false;

              if (cell.otherMonth) {
                classes += " other-month";
              } else {
                const isToday =
                  cell.day === today.day &&
                  month === today.month &&
                  year === today.year;
                if (isToday) classes += " today";

                const isSelected =
                  cell.day === selectedDay &&
                  month === selectedMonth &&
                  year === selectedYear;
                if (isSelected) classes += " selected";

                isSelectable = isDateSelectable(cell.day, month, year, today);
                if (!isSelectable) classes += " disabled";
              }

              const isClickable = !cell.otherMonth && isSelectable;

              if (isClickable) {
                return (
                  <button
                    type="button"
                    className={classes}
                    key={cellIndex}
                    aria-pressed={classes.includes("selected") ? "true" : undefined}
                    onClick={() => onDayClick(cell.day)}
                  >
                    {cell.day}
                  </button>
                );
              }

              return (
                <div className={classes} key={cellIndex}>
                  {cell.day}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarGrid;
