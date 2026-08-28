import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { registerSchema, RegisterFormData } from '../../validators/auth.validator';
import { useRegister } from '../../hooks/mutations/useRegister';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      password: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
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
            <View className="items-center mb-6">
              <Text className="text-3xl font-extrabold text-primary mb-2">
                Create Account
              </Text>
              <Text className="text-sm text-text-secondary text-center">
                Sign up to start taking or compiling quizzes
              </Text>
            </View>

            {/* Error Message Box */}
            {registerMutation.isError && (
              <View className="mb-5 bg-red-50 border border-red-100 p-4 rounded-xl">
                <Text className="text-sm font-medium text-danger text-center">
                  {registerMutation.error.message}
                </Text>
              </View>
            )}

            {/* Form Section */}
            <View className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Full Name"
                    placeholder="Enter full name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.name?.message}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />

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

              {/* Role Selector */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-text mb-2">
                  I want to register as:
                </Text>
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => setValue('role', 'user')}
                    activeOpacity={0.7}
                    className={`flex-1 flex-row items-center justify-center p-3 border rounded-xl ${
                      selectedRole === 'user'
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Text className="text-lg mr-2">👨‍🎓</Text>
                    <Text
                      className={`text-sm font-semibold ${
                        selectedRole === 'user' ? 'text-primary' : 'text-text-secondary'
                      }`}
                    >
                      User
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setValue('role', 'admin')}
                    activeOpacity={0.7}
                    className={`flex-1 flex-row items-center justify-center p-3 border rounded-xl ${
                      selectedRole === 'admin'
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Text className="text-lg mr-2">🔑</Text>
                    <Text
                      className={`text-sm font-semibold ${
                        selectedRole === 'admin' ? 'text-primary' : 'text-text-secondary'
                      }`}
                    >
                      Admin
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.role && (
                  <Text className="text-xs font-medium text-danger mt-1">
                    {errors.role.message}
                  </Text>
                )}
              </View>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Create a password"
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
                title="Sign Up"
                onPress={handleSubmit(onSubmit)}
                isLoading={registerMutation.isPending}
                className="mt-4"
              />
            </View>

            {/* Bottom Redirect */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-sm text-text-secondary">
                Already have an account?{' '}
              </Text>
              <Button
                title="Sign In"
                onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
