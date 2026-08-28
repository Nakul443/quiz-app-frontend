// connection the the backend
// every API call reuses, with auth and error-handling built in

import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { getToken } from '../utils/secureStorage';
import { formatError } from '../utils/formatError';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let unauthorizedCallback: (() => void) | null = null;

export const registerUnauthorizedCallback = (callback: () => void) => {
  unauthorizedCallback = callback;
};

// Request interceptor to attach Authorization token
httpClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      if (token) {
        // attaches the token to the request headers for authentication
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching auth token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and normalize them
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (unauthorizedCallback) {
        unauthorizedCallback();
      }
    }

    // Normalize error using formatError and reject with a descriptive Error object
    const errorMessage = formatError(error);
    return Promise.reject(new Error(errorMessage));
  }
);

export default httpClient;
