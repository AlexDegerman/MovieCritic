import { create } from 'zustand'

export const useAlertStore = create((set, get) => ({
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
  onClose: null,
  onCancel: null,
  showCancelButton: false,

  showAlert: (title, message, options = {}) => {
    set({
      isOpen: true,
      type: options.type || 'info',
      title,
      message,
      onClose: options.onClose,
      onCancel: options.onCancel,
      showCancelButton: options.showCancelButton || false
    })
  },

  hideAlert: (isCancel = false) => {
    const state = get()
    
    if (isCancel) {
      state.onCancel?.()
    } else {
      state.onClose?.()
    }

    set({
      isOpen: false,
      type: 'info',
      title: '',
      message: '',
      onClose: null,
      onCancel: null,
      showCancelButton: false
    })
  }
}))