// This file defines the navigation stack for the user's quiz screens.
// The chain of screens inside the User's "Quizzes" tab: QuizList → QuizDetailUser → AttemptQuestion → AttemptResult.
// Defines what screen comes after what when the user taps through.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserQuizStackParamList } from '../types/navigation.types';
import { QuizListScreen } from '../screens/user/QuizListScreen';
import { QuizDetailUserScreen } from '../screens/user/QuizDetailUserScreen';
import { AttemptQuestionScreen } from '../screens/user/AttemptQuestionScreen';
import { AttemptResultScreen } from '../screens/user/AttemptResultScreen';

const Stack = createNativeStackNavigator<UserQuizStackParamList>();

export const UserQuizStack: React.FC = () => {
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
        name="UserQuizList"
        component={QuizListScreen}
        options={{ title: 'Browse Quizzes' }}
      />
      <Stack.Screen
        name="QuizDetailUser"
        component={QuizDetailUserScreen}
        options={{ title: 'Quiz Details' }}
      />
      <Stack.Screen
        name="AttemptQuestion"
        component={AttemptQuestionScreen}
        options={{ title: 'Take Quiz', gestureEnabled: false, headerBackVisible: false }} // prevent user accidentally navigating back during attempt
      />
      <Stack.Screen
        name="AttemptResult"
        component={AttemptResultScreen}
        options={{ title: 'Quiz Results', headerBackVisible: false }} // navigate back explicitly via Close/Done
      />
    </Stack.Navigator>
  );
};
