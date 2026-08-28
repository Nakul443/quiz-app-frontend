import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Question } from '../types/api.types';
import { Card } from './Card';

interface QuestionCardProps {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption?: (optionId: string) => void;
  correctOptionId?: string;
  showFeedback?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  correctOptionId,
  showFeedback = false,
}) => {
  const isReadOnly = !onSelectOption;

  return (
    <Card className="mb-4">
      {/* Question Text */}
      <Text className="text-base font-semibold text-text mb-4 leading-6">
        {question.question_text}
      </Text>

      {/* Options List */}
      <View className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option._id;
          const isCorrect = correctOptionId === option._id;

          let optionStyle = 'border-gray-200 bg-white';
          let optionTextStyle = 'text-text-secondary';
          let numberBadgeStyle = 'bg-gray-100 text-text-secondary';

          if (showFeedback) {
            if (isCorrect) {
              // Correct option (should be highlighted green)
              optionStyle = 'border-success bg-success-light';
              optionTextStyle = 'text-success-dark font-medium';
              numberBadgeStyle = 'bg-success text-white';
            } else if (isSelected && !isCorrect) {
              // Selected option but it's incorrect (highlighted red)
              optionStyle = 'border-danger bg-red-50';
              optionTextStyle = 'text-danger-dark font-medium';
              numberBadgeStyle = 'bg-danger text-white';
            }
          } else {
            if (isSelected) {
              optionStyle = 'border-primary bg-primary-light';
              optionTextStyle = 'text-primary font-medium';
              numberBadgeStyle = 'bg-primary text-white';
            }
          }

          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...

          return (
            <TouchableOpacity
              key={option._id}
              disabled={isReadOnly}
              onPress={() => onSelectOption && onSelectOption(option._id)}
              activeOpacity={isReadOnly ? 1 : 0.7}
              className={`flex-row items-center border rounded-xl p-4 mb-3 ${optionStyle}`}
            >
              {/* Option Index Badge */}
              <View className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${numberBadgeStyle}`}>
                <Text className="text-xs font-semibold">{optionLetter}</Text>
              </View>

              {/* Option Text */}
              <Text className={`flex-1 text-sm leading-5 ${optionTextStyle}`}>
                {option.option_text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
};
