function TimeSlots({ slots, selectedTime, onTimeClick, hasSelectedDay = true }) {
  const isEmpty = !slots || slots.length === 0;

  let emptyMessage = "В этот день нет доступного времени";
  if (!hasSelectedDay) {
    emptyMessage = "Выберите день в календаре";
  }

  return (
    <article className="booking-card time-card">
      <h2 className="time-title">Доступное время</h2>
      <div className="time-grid">
        {isEmpty ? (
          <div className="no-slots-message">{emptyMessage}</div>
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
