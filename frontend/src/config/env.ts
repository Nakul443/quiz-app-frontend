// this file is used to load environment variables from the .env file and make them available in the application code

import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

export const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:5000/api';
