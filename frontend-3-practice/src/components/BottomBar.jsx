import { MONTHS_GENITIVE, DAYS_OF_WEEK } from "../utils/date";

function BottomBar({ day, month, year, selectedTime, onNext }) {
  const hasDate = day !== null && day !== undefined;

  const dateObj = hasDate ? new Date(year, month, day) : null;
  const dayName = dateObj ? DAYS_OF_WEEK[dateObj.getDay()] : null;
  const monthName = hasDate ? MONTHS_GENITIVE[month] : null;
  const timePart = selectedTime ? selectedTime : "время не выбрано";

  const detailsValue = hasDate
    ? `${dayName}, ${day} ${monthName} ${year} • ${timePart}`
    : "Дата не выбрана";

  return (
    <section
      className="bottom-action-panel"
      aria-label="Панель подтверждения выбора"
    >
      <div className="selected-details">
        <span className="details-label">Выбранная дата и время:</span>
        <span className="details-value">{detailsValue}</span>
      </div>
      <button type="button" className="btn-next" onClick={onNext}>
        Далее
      </button>
    </section>
  );
}

export default BottomBar;
