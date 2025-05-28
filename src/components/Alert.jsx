import useLanguage from '../hooks/language/useLanguage'
import '../styles/Alert.css'

// This component displays a popup with a message that user closes with OK button
export const Alert = ({ isOpen, type, title, message, onClose, onCancel, showCancelButton}) => {
  const {getText} = useLanguage()

  if (!isOpen) return null

  return (
    <div className={`overlay ${type}`}>
      <div className='modal' role='dialog' aria-modal='true'>
        <div className='title'>{title}</div>
        <div className='message'>{message}</div>
        <div className='alert-btn-container'>
        {showCancelButton && (
            <button onClick={onCancel} className="cancel-btn">{getText("Peruuta","Cancel")}</button>
          )}
          <button onClick={onClose} className='ok-btn'>
            {type === 'warning' ? getText("Vahvista", "Confirm") : "OK"}
          </button>
        </div>
      </div>
    </div>
  )
}