import './ErrorMessage.css';

/**
 * Componente de mensagem reutilizável para erro, aviso e informação.
 * @param {'error'|'warning'|'info'} type
 * @param {string} message
 */
function ErrorMessage({ type = 'error', message }) {
  if (!message) return null;

  const icons = {
    error: '✕',
    warning: '△',
    info: '✦',
  };

  return (
    <div className={`error-message ${type}`} role="alert">
      <span className="error-icon">{icons[type]}</span>
      <span className="error-text">{message}</span>
    </div>
  );
}

export default ErrorMessage;
