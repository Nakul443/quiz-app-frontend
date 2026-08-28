// This file defines the bottom tab navigator for the admin section of the app.
// It contains two tabs: "Quizzes" and "Submissions", each with its own stack navigator.
// The "Quizzes" tab allows the admin to manage quizzes,
// while the "Submissions" tab allows the admin to view submissions for quizzes.

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from '../types/navigation.types';
import { AdminQuizStack } from './AdminQuizStack';
import { AdminSubmissionsStack } from './AdminSubmissionsStack';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f46e5', // Theme primary
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="QuizzesTab"
        component={AdminQuizStack}
        options={{
          tabBarLabel: 'Quizzes',
          // Simple emoji placeholders for icons using standard React Native Text
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📝</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SubmissionsTab"
        component={AdminSubmissionsStack}
        options={{
          tabBarLabel: 'Submissions',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📊</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
