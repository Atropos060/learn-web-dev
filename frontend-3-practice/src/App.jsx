import { useState } from "react";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import Heading from "./components/Heading";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BottomBar from "./components/BottomBar";
import Footer from "./components/Footer";

import { SERVER_DATA, getSlotsForDay } from "./data/slots";
import { MONTHS_GENITIVE } from "./utils/date";

import "./styles/styles.css";

function App() {
  const today = SERVER_DATA.today;

  // 1. Текущий отображаемый в календаре месяц и год
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [currentYear, setCurrentYear] = useState(today.year);

  // 2. Выбранная пользователем дата (по умолчанию — сегодня)
  const [selectedDay, setSelectedDay] = useState(today.day);
  const [selectedMonth, setSelectedMonth] = useState(today.month);
  const [selectedYear, setSelectedYear] = useState(today.year);

  // 3. Выбранное время слота (по умолчанию — 14:00)
  const [selectedTime, setSelectedTime] = useState("14:00");

  // 4. Слоты доступного времени для выбранного дня
  const [slots, setSlots] = useState(SERVER_DATA.slots);

  // Обработчик выбора дня
  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Обязательный сброс времени при переключении на новый день
    setSelectedTime(null);

    // Обновление слотов времени под новый день
    setSlots(getSlotsForDay(day));
  }

  // Обработчик выбора слота времени
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Навигация по месяцам назад
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  // Навигация по месяцам вперед
  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  // Кнопка «Далее» в нижней панели
  function handleNext() {
    if (!selectedTime) {
      alert("Пожалуйста, выберите доступное время записи.");
      return;
    }

    const monthName = MONTHS_GENITIVE[selectedMonth];
    alert(
      `Запись успешно выбрана:\nДата: ${selectedDay} ${monthName} ${selectedYear}\nВремя: ${selectedTime}`
    );
  }

  return (
    <div className="page-wrapper">
      <Header />

      <main className="page-main">
        <div className="main-container">
          <Stepper currentStep={3} />
          <Heading />

          <section
            className="booking-section"
            aria-label="Выбор даты и времени записи"
          >
            <div className="booking-grid">
              <Calendar
                year={currentYear}
                month={currentMonth}
                selectedDay={selectedDay}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                today={today}
                onDayClick={handleDayClick}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />

              <TimeSlots
                slots={slots}
                selectedTime={selectedTime}
                onTimeClick={handleTimeClick}
              />
            </div>
          </section>

          <BottomBar
            day={selectedDay}
            month={selectedMonth}
            year={selectedYear}
            selectedTime={selectedTime}
            onNext={handleNext}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
