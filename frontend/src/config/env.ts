// this file is used to load environment variables from the .env file and make them available in the application code

import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

if (!ENV_API_BASE_URL) {
  throw new Error('API_BASE_URL is not set. Check your .env file.');
}

export const API_BASE_URL = ENV_API_BASE_URL;
