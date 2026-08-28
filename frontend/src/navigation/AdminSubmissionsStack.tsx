// This file defines the navigation stack for the admin submissions screens.
// The chain inside the Admin's "Submissions" tab: pick a quiz → QuizSubmissions.
// Defines what screen comes after what when the admin taps through.


import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminSubmissionsStackParamList } from '../types/navigation.types';
import { SubmissionsQuizListScreen } from '../screens/admin/SubmissionsQuizListScreen';
import { QuizSubmissionsScreen } from '../screens/admin/QuizSubmissionsScreen';

const Stack = createNativeStackNavigator<AdminSubmissionsStackParamList>();

export const AdminSubmissionsStack: React.FC = () => {
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
        name="SubmissionsQuizList"
        component={SubmissionsQuizListScreen}
        options={{ title: 'Submissions By Quiz' }}
      />
      <Stack.Screen
        name="QuizSubmissions"
        component={QuizSubmissionsScreen}
        options={{ title: 'Submissions' }}
      />
    </Stack.Navigator>
  );
};
