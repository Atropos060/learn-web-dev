function TimeSlots({
  slots,
  selectedTime,
  loading,
  error,
  onTimeClick,
  onRetry,
  hasSelectedDay = true,
}) {
  const isEmpty = !slots || slots.length === 0;
  const emptyMessage = hasSelectedDay
    ? "В этот день нет доступного времени"
    : "Выберите день в календаре";

  return (
    <article className="booking-card time-card">
      <h2 className="time-title">Доступное время</h2>
      <div className="time-grid">
        {loading ? (
          <div className="slots-placeholder-container">
            <div className="spinner" />
            <span>Загрузка слотов…</span>
          </div>
        ) : error ? (
          <div className="slots-error-container">
            <span>Ошибка: {error}</span>
            {onRetry && (
              <button type="button" className="btn-retry" onClick={onRetry}>
                Повторить
              </button>
            )}
          </div>
        ) : isEmpty ? (
          <div className="slots-placeholder-container">
            <span>{emptyMessage}</span>
          </div>
        ) : (
          slots.map((slot) => {
            let classes = "time-slot";
            if (!slot.available) classes += " unavailable";
            if (slot.available && slot.time === selectedTime) {
              classes += " selected";
            }

            return (
              <button
                type="button"
                className={classes}
                key={slot.time}
                disabled={!slot.available}
                aria-disabled={!slot.available ? "true" : undefined}
                aria-pressed={
                  slot.available && slot.time === selectedTime ? "true" : undefined
                }
                onClick={() => {
                  if (slot.available) {
                    onTimeClick(slot.time);
                  }
                }}
              >
                <span className="slot-text">{slot.time}</span>
                {!slot.available && (
                  <span className="slot-status">Занято</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </article>
  );
}

export default TimeSlots;
