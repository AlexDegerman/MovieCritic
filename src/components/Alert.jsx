import '../styles/Alert.css'

// This component displays a popup with a message that user closes with OK button
export const Alert = ({
  isOpen,
  type,
  title,
  message,
  onClose
}) => {

  if (!isOpen) return null

  return (
    <div className={`overlay ${type}`}>
      <div className='modal' role='dialog' aria-modal='true'>
        <div className='title'>{title}</div>
        <div className='message'>{message}</div>
        <div className='button-container'>
          <button onClick={onClose} className='button'>OK</button>
        </div>
      </div>
    </div>
  )
}