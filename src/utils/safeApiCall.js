import { handleApiError } from "./apiErrorHandler"

export const safeApiCall = async (apiCall, errorMessage) => {
  try {
    const response = await apiCall()
    return { success: true, data: response.data }
  } catch (error) {
    const errorText = handleApiError(error, errorMessage)
    return { success: false, error: errorText }
  }
}