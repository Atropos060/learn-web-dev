import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

function Calendar({
  year,
  month,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  return (
    <article className="booking-card calendar-card">
      <CalendarHeader
        year={year}
        month={month}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <CalendarGrid
        year={year}
        month={month}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        today={today}
        onDayClick={onDayClick}
      />
    </article>
  );
}

export default Calendar;
