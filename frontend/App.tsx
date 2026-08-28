/**
 * Quiz/Assessment App Entrypoint
 * Wraps root component in all global providers (React Query, Auth, Navigation)
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Configure a global React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Minimize retry overhead in slow test network scopes
      refetchOnWindowFocus: false, // Prevent redundant requests on mobile state changes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <StatusBar barStyle="dark-content" />
            <RootNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
