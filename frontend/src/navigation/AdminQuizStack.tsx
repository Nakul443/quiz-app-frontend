// This file defines the navigation stack for the admin quiz management screens.
// The chain of screens inside the Admin's "Quizzes" tab: AdminQuizList → QuizDetailAdmin → AddQuestion/EditQuestion.
// Defines what screen comes after what when the admin taps through.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminQuizStackParamList } from '../types/navigation.types';
import { AdminQuizListScreen } from '../screens/admin/AdminQuizListScreen';
import { QuizDetailAdminScreen } from '../screens/admin/QuizDetailAdminScreen';
import { CreateQuizScreen } from '../screens/admin/CreateQuizScreen';
import { AddQuestionScreen } from '../screens/admin/AddQuestionScreen';
import { EditQuestionScreen } from '../screens/admin/EditQuestionScreen';
import { QuizSubmissionsScreen } from '../screens/admin/QuizSubmissionsScreen';

const Stack = createNativeStackNavigator<AdminQuizStackParamList>();

export const AdminQuizStack: React.FC = () => {
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
        name="AdminQuizList"
        component={AdminQuizListScreen}
        options={{ title: 'Admin Quizzes' }}
      />
      <Stack.Screen
        name="QuizDetailAdmin"
        component={QuizDetailAdminScreen}
        options={{ title: 'Quiz Details' }}
      />
      <Stack.Screen
        name="CreateQuiz"
        component={CreateQuizScreen}
        options={{ title: 'Create Quiz' }}
      />
      <Stack.Screen
        name="AddQuestion"
        component={AddQuestionScreen}
        options={{ title: 'Add Question' }}
      />
      <Stack.Screen
        name="EditQuestion"
        component={EditQuestionScreen}
        options={{ title: 'Edit Question' }}
      />
      <Stack.Screen
        name="QuizSubmissions"
        component={QuizSubmissionsScreen}
        options={{ title: 'Quiz Submissions' }}
      />
    </Stack.Navigator>
  );
};
