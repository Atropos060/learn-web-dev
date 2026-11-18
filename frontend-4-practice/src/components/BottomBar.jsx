import { MONTHS_GENITIVE, DAYS_OF_WEEK } from "../utils/date";

function BottomBar({ day, month, year, selectedTime, onNext }) {
  let dateText = "дата не выбрана";

  if (day !== null && month !== null && year !== null) {
    const dateObj = new Date(year, month, day);
    const dayName = DAYS_OF_WEEK[dateObj.getDay()];
    const monthName = MONTHS_GENITIVE[month];
    const timePart = selectedTime ? selectedTime : "время не выбрано";
    dateText = `${dayName}, ${day} ${monthName} ${year} • ${timePart}`;
  }

  return (
    <section
      className="bottom-action-panel"
      aria-label="Панель подтверждения выбора"
    >
      <div className="selected-details">
        <span className="details-label">Выбранная дата и время:</span>
        <span className="details-value">{dateText}</span>
      </div>
      <button type="button" className="btn-next" onClick={onNext}>
        Далее
      </button>
    </section>
  );
}

export default BottomBar;
