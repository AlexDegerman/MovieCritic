export const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response) {
    const statusMessages = {
      400: "Invalid request",
      401: "Please login again",
      403: "Permission denied",
      404: "Not found",
      405: "Method not allowed",
      406: "Not acceptable",
      407: "Proxy authentication required",
      408: "Request timeout",
      409: "Conflict with existing data",
      411: "Length required", 
      412: "Precondition failed",
      415: "Unsupported media type",
      416: "Range not satisfiable",
      423: "Locked",
      426: "Upgrade required",
      429: "Too many requests from this IP, please try again later",
      500: "Server error",
      502: "Service temporarily unavailable",
      503: "Service unavailable",
      504: "Request timeout",
      505: "HTTP version not supported"
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