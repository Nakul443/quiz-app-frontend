import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  textClassName = '',
}) => {
  const isButtonDisabled = disabled || isLoading;

  // Base container styles
  let containerStyles = 'flex-row items-center justify-center rounded-xl font-semibold ';

  // Variant container styles
  if (variant === 'primary') {
    containerStyles += isButtonDisabled ? 'bg-primary/50' : 'bg-primary active:bg-primary-dark';
  } else if (variant === 'secondary') {
    containerStyles += isButtonDisabled ? 'bg-gray-200' : 'bg-gray-100 active:bg-gray-200';
  } else if (variant === 'danger') {
    containerStyles += isButtonDisabled ? 'bg-danger/50' : 'bg-danger active:bg-danger-dark';
  } else if (variant === 'outline') {
    containerStyles += 'border border-gray-300 bg-transparent active:bg-gray-50';
  } else if (variant === 'text') {
    containerStyles += 'bg-transparent active:bg-gray-50';
  }

  // Size container styles
  if (size === 'sm') {
    containerStyles += ' px-3 py-1.5';
  } else if (size === 'md') {
    containerStyles += ' px-5 py-3';
  } else if (size === 'lg') {
    containerStyles += ' px-6 py-4';
  }

  // Base text styles
  let textStyles = 'text-center font-medium ';

  // Variant text styles
  if (variant === 'primary') {
    textStyles += 'text-white';
  } else if (variant === 'secondary') {
    textStyles += 'text-text';
  } else if (variant === 'danger') {
    textStyles += 'text-white';
  } else if (variant === 'outline') {
    textStyles += 'text-text';
  } else if (variant === 'text') {
    textStyles += 'text-primary';
  }

  // Size text styles
  if (size === 'sm') {
    textStyles += ' text-xs';
  } else if (size === 'md') {
    textStyles += ' text-sm';
  } else if (size === 'lg') {
    textStyles += ' text-base';
  }

  if (isButtonDisabled) {
    if (variant === 'outline' || variant === 'text') {
      textStyles += ' text-gray-400';
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isButtonDisabled}
      className={`${containerStyles} ${className}`}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#4f46e5'}
            className="mr-2"
          />
          <Text className={`${textStyles} ${textClassName}`}>{title}</Text>
        </View>
      ) : (
        <Text className={`${textStyles} ${textClassName}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
