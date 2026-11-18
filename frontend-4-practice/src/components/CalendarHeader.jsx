import { MONTHS_NOMINATIVE } from "../utils/date";

function CalendarHeader({ year, month, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      <h2 className="month-title">
        {MONTHS_NOMINATIVE[month]} {year}
      </h2>
      <div className="calendar-controls">
        <button
          type="button"
          className="nav-arrow-btn prev-btn"
          aria-label="Предыдущий месяц"
          onClick={onPrevMonth}
        >
          <svg
            className="arrow-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className="nav-arrow-btn next-btn"
          aria-label="Следующий месяц"
          onClick={onNextMonth}
        >
          <svg
            className="arrow-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CalendarHeader;
