import { useAlertStore } from '../stores/alertStore'
import '../styles/Alert.css'
import useLanguage from '../hooks/language/useLanguage'

export const Alert = () => {
  const {
    isOpen,
    type,
    title,
    message,
    showCancelButton,
    hideAlert
  } = useAlertStore()
  
  const { getText } = useLanguage()

  if (!isOpen) return null

  return (
    <div className={`overlay ${type}`}>
      <div className='modal' role='dialog' aria-modal='true'>
        <div className='title'>{title}</div>
        <div className='message'>{message}</div>
        <div className='alert-btn-container'>
          {showCancelButton && (
            <button onClick={() => hideAlert(true)} className="cancel-btn">
              {getText("Peruuta", "Cancel")}
            </button>
          )}
          <button onClick={() => hideAlert(false)} className='ok-btn'>
            {type === 'warning' ? getText("Vahvista", "Confirm") : "OK"}
          </button>
        </div>
      </div>
    </div>
  )
}