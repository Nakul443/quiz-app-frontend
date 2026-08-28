import React from 'react';
import { View, Text } from 'react-native';

interface TimerProps {
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = (totalSeconds: number): string => {
    if (totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  let colorClasses = 'text-text bg-gray-50 border-gray-100';
  
  if (seconds < 20) {
    colorClasses = 'text-danger bg-red-50 border-red-100';
  } else if (seconds < 60) {
    colorClasses = 'text-amber-600 bg-amber-50 border-amber-100';
  }

  return (
    <View className={`px-4 py-2 rounded-xl border flex-row items-center justify-center ${colorClasses}`}>
      <Text className="font-bold text-base tracking-wider">
        {formatTime(seconds)}
      </Text>
    </View>
  );
};
