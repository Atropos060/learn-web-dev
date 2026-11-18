export function LoadingState({ message = "Загрузка…" }) {
  return (
    <div className="state-card">
      <div className="spinner" />
      <span className="state-title">{message}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card error">
      <span className="state-title">Произошла ошибка</span>
      <p className="state-text">{message}</p>
      {onRetry && (
        <button type="button" className="btn-retry" onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  );
}
