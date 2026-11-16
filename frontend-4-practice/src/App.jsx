import { useState, useEffect } from "react";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import Heading from "./components/Heading";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BottomBar from "./components/BottomBar";
import Footer from "./components/Footer";
import { LoadingState, ErrorState } from "./components/LoadingState";

import { fetchToday, fetchSlots } from "./api";
import { MONTHS_GENITIVE } from "./utils/date";

import "./styles/styles.css";

function App() {
  // 1. Состояние today с сервера
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  // 2. Состояние отображаемого месяца в календаре
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  // 3. Состояние выбранной даты
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // 4. Состояние выбранного времени
  const [selectedTime, setSelectedTime] = useState(null);

  // 5. Состояние слотов
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  // Счётчик для повторной попытки загрузки today при ошибке
  const [retryCount, setRetryCount] = useState(0);

  // ==========================================================================
  // 1. Загрузка today при открытии страницы
  // ==========================================================================
  useEffect(() => {
    let ignore = false;

    async function loadToday() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        if (ignore) return;

        setToday(data);
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
        setSelectedMonth(data.month);
        setSelectedYear(data.year);
      } catch (err) {
        if (!ignore) {
          setErrorToday(err.message || "Не удалось загрузить данные с сервера");
        }
      } finally {
        if (!ignore) {
          setLoadingToday(false);
        }
      }
    }

    loadToday();

    return () => {
      ignore = true;
    };
  }, [retryCount]);

  // ==========================================================================
  // 2. Загрузка слотов при смене дня (или когда загрузился today)
  // ==========================================================================
  useEffect(() => {
    if (
      selectedDay === null ||
      selectedMonth === null ||
      selectedYear === null
    ) {
      return;
    }

    let ignore = false;

    async function loadSlots() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        const response = await fetchSlots({
          day: selectedDay,
          month: selectedMonth,
          year: selectedYear,
        });

        // Защита от race condition: проверяем, что ответ совпадает с выбранным днем
        if (
          !ignore &&
          response &&
          response.date &&
          response.date.day === selectedDay &&
          response.date.month === selectedMonth &&
          response.date.year === selectedYear
        ) {
          setSlots(response.slots || []);
        }
      } catch (err) {
        if (!ignore) {
          setErrorSlots(err.message || "Не удалось загрузить слоты времени");
        }
      } finally {
        if (!ignore) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      ignore = true;
    };
  }, [selectedDay, selectedMonth, selectedYear]);

  // ==========================================================================
  // 3. Обработчики действий пользователя
  // ==========================================================================

  // Клик по дню в календаре
  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Обязательный сброс выбранного времени при смене дня
    setSelectedTime(null);
  }

  // Клик по слоту времени
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

  // Повторная загрузка слотов
  function handleRetrySlots() {
    if (selectedDay === null) return;
    const targetDate = {
      day: selectedDay,
      month: selectedMonth,
      year: selectedYear,
    };
    setLoadingSlots(true);
    setErrorSlots(null);
    fetchSlots(targetDate)
      .then((res) => {
        setSlots(res.slots || []);
      })
      .catch((err) => {
        setErrorSlots(err.message || "Ошибка загрузки слотов");
      })
      .finally(() => {
        setLoadingSlots(false);
      });
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

  // ==========================================================================
  // 4. Рендер
  // ==========================================================================

  return (
    <div className="page-wrapper">
      <Header />

      <main className="page-main">
        <div className="main-container">
          <Stepper currentStep={3} />
          <Heading />

          {/* Сценарий 1: загрузка today или ошибка сервера */}
          {loadingToday ? (
            <LoadingState message="Загрузка данных календаря…" />
          ) : errorToday ? (
            <ErrorState
              message={errorToday}
              onRetry={() => setRetryCount((c) => c + 1)}
            />
          ) : (
            <>
              {/* Сценарий 2: страница загружена, календарь и слоты с сервера */}
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
                    loading={loadingSlots}
                    error={errorSlots}
                    onTimeClick={handleTimeClick}
                    onRetry={handleRetrySlots}
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
