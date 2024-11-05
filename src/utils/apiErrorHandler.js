export const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response) {
    const statusMessages = {
      400: "Invalid request",
      401: "Please login again",
      403: "Permission denied",
      404: "Not found",
      409: "Conflict with existing data",
      500: "Server error",
      502: "Service temporarily unavailable",
      503: "Service unavailable",
      504: "Request timeout"
    }
    if (error.response.status === 401) {
      localStorage.removeItem('token')
    }
    return  error.response.data?.message ||
            statusMessages[error.response.status] ||
            defaultMessage
  }
  if (error.request) {
    if (!navigator.onLine) {
      return "You are offline. Please check your internet connection."
    }
    return "Network error. Please check your connection."
  }
  return defaultMessage
}