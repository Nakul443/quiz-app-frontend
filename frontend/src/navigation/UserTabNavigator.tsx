// This file defines the bottom tab navigator for the user section of the app.
// It contains two tabs: "Quizzes" and "My History", each with its own stack navigator.
// The "Quizzes" tab allows the user to view and attempt quizzes,
// while the "My History" tab allows the user to view their past quiz attempts.

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserTabParamList } from '../types/navigation.types';
import { UserQuizStack } from './UserQuizStack';
import { UserHistoryStack } from './UserHistoryStack';

const Tab = createBottomTabNavigator<UserTabParamList>();

export const UserTabNavigator: React.FC = () => {
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
        component={UserQuizStack}
        options={{
          tabBarLabel: 'Quizzes',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📖</Text>
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={UserHistoryStack}
        options={{
          tabBarLabel: 'My History',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📜</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
