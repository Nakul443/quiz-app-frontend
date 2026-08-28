// this file contains utility functions for formatting error messages received from API responses or other sources

export const formatError = (error: any): string => {
  if (error && error.response) {
    // Server responded with a status code outside 2xx range
    const data = error.response.data;
    if (data && data.message) {
      return data.message;
    }
    if (data && typeof data === 'string') {
      return data;
    }
    return `Server Error: ${error.response.status}`;
  } else if (error && error.request) {
    // Request was made but no response was received
    return 'Network Error: No response received from server. Please check your connection.';
  } else if (error && error.message) {
    // Something else triggered the error
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
