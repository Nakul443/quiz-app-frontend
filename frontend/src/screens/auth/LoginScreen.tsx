import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { loginSchema, LoginFormData } from '../../validators/auth.validator';
import { useLogin } from '../../hooks/mutations/useLogin';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-12">
            {/* Header Section */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-extrabold text-primary mb-2">
                QuizApp
              </Text>
              <Text className="text-sm text-text-secondary text-center">
                Sign in to create, manage or take assessments
              </Text>
            </View>

            {/* Error Message Box */}
            {loginMutation.isError && (
              <View className="mb-5 bg-red-50 border border-red-100 p-4 rounded-xl">
                <Text className="text-sm font-medium text-danger text-center">
                  {loginMutation.error.message}
                </Text>
              </View>
            )}

            {/* Form Section */}
            <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <Button
                title="Sign In"
                onPress={handleSubmit(onSubmit)}
                isLoading={loginMutation.isPending}
                className="mt-4"
              />
            </View>

            {/* Bottom Redirect */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-sm text-text-secondary">
                Don't have an account?{' '}
              </Text>
              <Button
                title="Sign Up"
                onPress={() => navigation.navigate('Register')}
                variant="text"
                size="sm"
                className="px-1 py-1"
                textClassName="font-semibold text-primary"
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
