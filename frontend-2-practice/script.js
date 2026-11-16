// ============================================================
// 1. ДАННЫЕ
// ============================================================

// SERVER_DATA — стартовый ответ «сервера» при открытии страницы.
// today используется, чтобы:
//   - подсветить «сегодня» в календаре;
//   - запретить выбор дней раньше today.
// slots — слоты по умолчанию для выбранного дня.
const SERVER_DATA = {
  today: { day: 17, month: 9, year: 2026 }, // 17 октября 2026 (месяц 9 = Октябрь)
  slots: [
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
  ],
};

// SLOTS_EVEN_DAY — набор слотов для чётных дней (имитация разных данных с сервера)
const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:00", available: true },
];

// SLOTS_ODD_DAY — набор слотов для нечётных дней
const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "12:00", available: true },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
];

// getSlotsForDay — функция получения слотов в зависимости от дня
function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day, month, year, slots };
}

// saveSelectedDate — сохранение выбранной даты и времени в localStorage
function saveSelectedDate(date, time) {
  const raw = localStorage.getItem("barbershop-booking");
  let booking = {};
  if (raw) {
    try {
      booking = JSON.parse(raw);
    } catch (e) {
      booking = {};
    }
  }
  booking.date = date;
  booking.time = time;
  localStorage.setItem("barbershop-booking", JSON.stringify(booking));
}

// ============================================================
// 2. СОСТОЯНИЕ (STATE)
// ============================================================

// Состояние страницы, меняющееся при действиях пользователя
const BOOKING_STATE = {
  currentMonth: 9, // Месяц, отображаемый в календаре (0 = Январь, 9 = Октябрь)
  currentYear: 2026, // Год, отображаемый в календаре
  selectedDay: 17, // Выбранный день
  selectedMonth: 9, // Месяц выбранной даты
  selectedYear: 2026, // Год выбранной даты
  selectedTime: "14:00", // Выбранное время
};

// ============================================================
// 3. ЧИСТЫЕ ФУНКЦИИ
// ============================================================

// Месяцы в именительном падеже для заголовка («Октябрь 2026»)
const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Месяцы в родительном падеже для подписи в нижней панели («17 октября 2026»)
const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Дни недели (порядок JS Date: 0 = Воскресенье)
const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// compareDates — сравнение двух дат без учёта времени (-1, 0, 1)
function compareDates(a, b) {
  const d1 = new Date(a.year, a.month, a.day);
  const d2 = new Date(b.year, b.month, b.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// isDateSelectable — проверка «можно ли выбрать день» (не раньше today)
function isDateSelectable(day, month, year) {
  const today = SERVER_DATA.today;
  return compareDates({ day, month, year }, today) >= 0;
}

// buildCalendarGrid — построение сетки дней месяца по неделям (чистая функция)
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  // Дни предыдущего месяца
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца до полной недели
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  // Нарезка массива на недели по 7 ячеек
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// ============================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================

// renderCalendar — отрисовка месяца и сетки дней
function renderCalendar() {
  const monthTitleEl = document.querySelector(".month-title");
  const container = document.querySelector(".days-container");

  const year = BOOKING_STATE.currentYear;
  const month = BOOKING_STATE.currentMonth;

  // Обновляем заголовок «Октябрь 2026»
  monthTitleEl.textContent = `${MONTHS_NOMINATIVE[month]} ${year}`;

  const weeks = buildCalendarGrid(year, month);
  const today = SERVER_DATA.today;

  let html = "";
  weeks.forEach((week) => {
    html += '<div class="week-row">';
    week.forEach((cell) => {
      let classes = "day-cell";

      if (cell.otherMonth) {
        classes += " other-month";
      } else {
        // Подсветка сегодняшнего дня
        const isToday =
          cell.day === today.day &&
          month === today.month &&
          year === today.year;
        if (isToday) classes += " today";

        // Подсветка выбранного пользователем дня
        const isSelected =
          cell.day === BOOKING_STATE.selectedDay &&
          month === BOOKING_STATE.selectedMonth &&
          year === BOOKING_STATE.selectedYear;
        if (isSelected) classes += " selected";

        // Дни раньше «сегодня» — disabled
        const selectable = isDateSelectable(cell.day, month, year);
        if (!selectable) classes += " disabled";
      }

      const isClickable = !cell.otherMonth && isDateSelectable(cell.day, month, year);
      const tag = isClickable ? "button" : "div";
      const typeAttr = isClickable ? ' type="button"' : "";
      const dataDay = !cell.otherMonth ? ` data-day="${cell.day}"` : "";
      const ariaAttr = classes.includes("selected") ? ' aria-pressed="true"' : "";

      html += `<${tag}${typeAttr} class="${classes}"${dataDay}${ariaAttr}>${cell.day}</${tag}>`;
    });
    html += "</div>";
  });

  container.innerHTML = html;

  // Навешиваем обработчики заново после каждой перерисовки
  const activeCells = container.querySelectorAll(
    ".day-cell:not(.other-month):not(.disabled)"
  );
  activeCells.forEach((cell) => {
    cell.addEventListener("click", onDayClick);
  });
}

// onDayClick — обработчик клика по дню
function onDayClick(event) {
  const cell = event.currentTarget;
  const day = parseInt(cell.dataset.day, 10);

  BOOKING_STATE.selectedDay = day;
  BOOKING_STATE.selectedMonth = BOOKING_STATE.currentMonth;
  BOOKING_STATE.selectedYear = BOOKING_STATE.currentYear;

  // Обязательный сброс выбранного времени при смене дня
  BOOKING_STATE.selectedTime = null;

  // Запрашиваем новые слоты под выбранный день
  const response = getSlotsForDay(
    day,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedYear
  );
  SERVER_DATA.slots = response.slots;

  // Перерисовываем компоненты
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

// renderTimeSlots — отрисовка кнопок со слотами времени
function renderTimeSlots() {
  const timeGrid = document.querySelector(".time-grid");
  const slots = SERVER_DATA.slots;

  if (!slots || slots.length === 0) {
    timeGrid.innerHTML =
      '<div class="no-slots-message">В этот день нет доступного времени</div>';
    return;
  }

  let html = "";
  slots.forEach((slot) => {
    let classes = "time-slot";
    if (!slot.available) classes += " unavailable";
    if (slot.available && slot.time === BOOKING_STATE.selectedTime) {
      classes += " selected";
    }

    const disabledAttr = !slot.available ? ' disabled aria-disabled="true"' : "";
    const ariaPressed =
      slot.available && slot.time === BOOKING_STATE.selectedTime
        ? ' aria-pressed="true"'
        : "";
    const statusHtml = !slot.available
      ? '<span class="slot-status">Занято</span>'
      : "";

    html += `<button type="button" class="${classes}" data-time="${slot.time}"${disabledAttr}${ariaPressed}>
      <span class="slot-text">${slot.time}</span>
      ${statusHtml}
    </button>`;
  });

  timeGrid.innerHTML = html;

  // Обработчики вешаем только на доступные слоты
  const availableSlots = timeGrid.querySelectorAll(
    ".time-slot:not(.unavailable)"
  );
  availableSlots.forEach((btn) => {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

// onTimeSlotClick — обработчик выбора времени
function onTimeSlotClick(event) {
  const btn = event.currentTarget;
  const time = btn.dataset.time;
  BOOKING_STATE.selectedTime = time;

  renderTimeSlots();
  updateBottomBar();
}

// updateBottomBar — обновление нижней панели с выбранной датой и временем
function updateBottomBar() {
  const valueEl = document.querySelector(".details-value");
  if (!valueEl) return;

  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.selectedMonth;
  const year = BOOKING_STATE.selectedYear;

  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  const timePart = BOOKING_STATE.selectedTime
    ? BOOKING_STATE.selectedTime
    : "время не выбрано";

  valueEl.textContent = `${dayName}, ${day} ${monthName} ${year} • ${timePart}`;
}

// setupMonthNavigation — листание месяцев вперёд и назад
function setupMonthNavigation() {
  const prevBtn = document.querySelector(".nav-arrow-btn.prev-btn");
  const nextBtn = document.querySelector(".nav-arrow-btn.next-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      BOOKING_STATE.currentMonth -= 1;
      if (BOOKING_STATE.currentMonth < 0) {
        BOOKING_STATE.currentMonth = 11;
        BOOKING_STATE.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      BOOKING_STATE.currentMonth += 1;
      if (BOOKING_STATE.currentMonth > 11) {
        BOOKING_STATE.currentMonth = 0;
        BOOKING_STATE.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

// setupNextButton — кнопка «Далее» с проверкой выбора времени
function setupNextButton() {
  const nextBtn = document.querySelector(".btn-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!BOOKING_STATE.selectedTime) {
        alert("Пожалуйста, выберите доступное время записи.");
        return;
      }

      saveSelectedDate(
        {
          day: BOOKING_STATE.selectedDay,
          month: BOOKING_STATE.selectedMonth,
          year: BOOKING_STATE.selectedYear,
        },
        BOOKING_STATE.selectedTime
      );

      const monthName = MONTHS_GENITIVE[BOOKING_STATE.selectedMonth];
      alert(
        `Запись успешно выбрана:\nДата: ${BOOKING_STATE.selectedDay} ${monthName} ${BOOKING_STATE.selectedYear}\nВремя: ${BOOKING_STATE.selectedTime}`
      );
    });
  }
}

// ============================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
  BOOKING_STATE.currentMonth = SERVER_DATA.today.month;
  BOOKING_STATE.currentYear = SERVER_DATA.today.year;
  BOOKING_STATE.selectedDay = SERVER_DATA.today.day;
  BOOKING_STATE.selectedMonth = SERVER_DATA.today.month;
  BOOKING_STATE.selectedYear = SERVER_DATA.today.year;

  // Стартовые слоты для дня по умолчанию
  const initialSlots = getSlotsForDay(
    BOOKING_STATE.selectedDay,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedYear
  );
  SERVER_DATA.slots = initialSlots.slots;

  // Отрисовка
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();

  // Навешивание статических слушателей
  setupMonthNavigation();
  setupNextButton();
}

// Запуск после построения DOM
document.addEventListener("DOMContentLoaded", init);
