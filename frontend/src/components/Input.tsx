import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerClassName = '', style, ...props }, ref) => {
    return (
      <View className={`mb-4 w-full ${containerClassName}`}>
        {label && (
          <Text className="text-sm font-medium text-text mb-1.5">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`w-full bg-white border ${
            error ? 'border-danger' : 'border-gray-200'
          } rounded-xl px-4 py-3 text-sm text-text font-normal`}
          placeholderTextColor="#9ca3af"
          style={style}
          {...props}
        />
        {error && (
          <Text className="text-xs font-medium text-danger mt-1">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
