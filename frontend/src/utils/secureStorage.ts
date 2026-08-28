// this file contains functions for securely storing and retrieving sensitive data,
// such as authentication tokens, using the react-native-keychain library

import * as Keychain from 'react-native-keychain';

export const saveToken = async (token: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword('token', token, {
      service: 'quiz_app_auth_token',
    });
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'quiz_app_auth_token',
    });
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({
      service: 'quiz_app_auth_token',
    });
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};
