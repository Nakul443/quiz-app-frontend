import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Items Found',
  description = 'There are no items to display at the moment.',
  actionTitle,
  onAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-transparent">
      <Text className="text-lg font-bold text-text mb-2 text-center">
        {title}
      </Text>
      <Text className="text-sm text-text-secondary mb-6 text-center max-w-xs leading-5">
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
        />
      )}
    </View>
  );
};
