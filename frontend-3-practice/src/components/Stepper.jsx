import React from "react";

function Stepper({ currentStep = 3 }) {
  const steps = [
    { number: 1, title: "Услуга" },
    { number: 2, title: "Мастер" },
    { number: 3, title: "Дата и время" },
    { number: 4, title: "Данные" },
    { number: 5, title: "Подтверждение" },
  ];

  return (
    <section className="stepper-section" aria-label="Шаги оформления записи">
      <ol className="stepper-list">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isPending = step.number > currentStep;

          let stepClass = "stepper-step";
          if (isCompleted) stepClass += " completed";
          if (isActive) stepClass += " active";
          if (isPending) stepClass += " pending";

          const showDivider = index < steps.length - 1;
          const isDividerCompleted = step.number < currentStep;

          return (
            <React.Fragment key={step.number}>
              <li
                className={stepClass}
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className="step-circle"
                  aria-label={`Шаг ${step.number}: ${
                    isCompleted
                      ? "выполнен"
                      : isActive
                      ? "текущий"
                      : "предстоящий"
                  }`}
                >
                  {step.number}
                </div>
                <span className="step-title">{step.title}</span>
              </li>

              {showDivider && (
                <li
                  className={`step-divider ${
                    isDividerCompleted ? "completed" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </section>
  );
}

export default Stepper;
