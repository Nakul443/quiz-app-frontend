// This file defines the root navigator for the app,
// which decides which stack to show based on the user's authentication state and role.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { AdminTabNavigator } from './AdminTabNavigator';
import { UserTabNavigator } from './UserTabNavigator';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Unauthenticated Flow
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user?.role === 'admin' ? (
        // Authenticated Admin Flow
        <Stack.Screen name="AdminApp" component={AdminTabNavigator} />
      ) : (
        // Authenticated User Flow
        <Stack.Screen name="UserApp" component={UserTabNavigator} />
      )}
    </Stack.Navigator>
  );
};
export default RootNavigator;
