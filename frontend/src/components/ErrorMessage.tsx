import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-transparent">
      <View className="bg-red-50 border border-red-100 rounded-2xl p-6 w-full max-w-sm items-center">
        <Text className="text-base font-semibold text-danger mb-2 text-center">
          Something went wrong
        </Text>
        <Text className="text-sm text-text-secondary mb-5 text-center leading-5">
          {message}
        </Text>
        {onRetry && (
          <Button
            title="Try Again"
            onPress={onRetry}
            variant="outline"
            size="sm"
            className="border-danger/30 active:bg-danger/5"
            textClassName="text-danger"
          />
        )}
      </View>
    </View>
  );
};
