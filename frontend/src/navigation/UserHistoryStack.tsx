// This file defines the navigation stack for the user's history screens.
// The chain of screens inside the User's "History" tab: AttemptHistory → AttemptResult.
// Defines what screen comes after what when the user taps through.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserHistoryStackParamList } from '../types/navigation.types';
import { AttemptHistoryScreen } from '../screens/user/AttemptHistoryScreen';
import { AttemptResultScreen } from '../screens/user/AttemptResultScreen';

const Stack = createNativeStackNavigator<UserHistoryStackParamList>();

export const UserHistoryStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="UserAttemptHistory"
        component={AttemptHistoryScreen}
        options={{ title: 'My History' }}
      />
      <Stack.Screen
        name="AttemptResult"
        component={AttemptResultScreen}
        options={{ title: 'Result Details' }}
      />
    </Stack.Navigator>
  );
};
