import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  function handleSignUp() {
    if (!email.trim() || password.length < 6) {
      setError('Introduce un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }
    setError(null);
    router.replace('/home');
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F6]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerClassName="flex-grow justify-center"
          keyboardShouldPersistTaps="handled">
          <View className="w-full max-w-[440px] self-center px-6 py-8">

            {/* Logo */}
            <View className="mb-10">
              <Link href="/" asChild>
                <TouchableOpacity className="w-11 h-11 bg-white border border-[#DCE5E2] rounded-xl items-center justify-center mb-9">
                  <ArrowLeft size={20} color="#324943" />
                </TouchableOpacity>
              </Link>
              <View className="flex-row items-center mb-9">
                <View className="w-11 h-11 bg-[#145F52] rounded-xl items-center justify-center">
                  <Text className="text-white text-xl font-bold">M</Text>
                </View>
                <View className="ml-3">
                  <Text className="text-[#16332E] text-base font-bold">MACEDO</Text>
                  <Text className="text-[#70817D] text-xs">Tu espacio, en orden</Text>
                </View>
              </View>
              <Text className="text-[#16332E] text-[30px] leading-9 font-bold">
                Crea tu cuenta
              </Text>
              <Text className="text-[#70817D] text-[15px] leading-6 mt-2">
                Empieza hoy. Solo te tomará un minuto.
              </Text>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-[#324943] text-sm font-bold mb-2">
                Correo electrónico
              </Text>
              <View className={`flex-row items-center bg-white rounded-xl border px-4 h-14 ${focusedField === 'email' ? 'border-[#145F52]' : 'border-[#DCE5E2]'}`}>
                <Mail size={19} color={focusedField === 'email' ? '#145F52' : '#8A9A96'} />
                <TextInput
                  className="flex-1 ml-3 text-[#16332E] text-[15px]"
                  placeholder="tucorreo@ejemplo.com"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-[#324943] text-sm font-bold mb-2">
                Contraseña
              </Text>
              <View className={`flex-row items-center bg-white rounded-xl border px-4 h-14 ${focusedField === 'password' ? 'border-[#145F52]' : 'border-[#DCE5E2]'}`}>
                <Lock size={19} color={focusedField === 'password' ? '#145F52' : '#8A9A96'} />
                <TextInput
                  className="flex-1 ml-3 text-[#16332E] text-[15px]"
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  {showPassword ? (
                    <EyeOff size={19} color="#70817D" />
                  ) : (
                    <Eye size={19} color="#70817D" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {error && (
              <View className="bg-[#FFF0ED] border border-[#F5C8BE] rounded-xl px-4 py-3 mb-4">
                <Text className="text-[#A93E2B] text-sm">{error}</Text>
              </View>
            )}

            {/* Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              activeOpacity={0.8}
              className="bg-[#145F52] rounded-xl h-14 items-center justify-center">
              <Text className="text-white text-base font-semibold">
                Registrarme
              </Text>
            </TouchableOpacity>

            {/* Sign in */}
            <View className="flex-row flex-wrap justify-center mt-8">
              <Text className="text-[#70817D] text-sm mr-1">
                ¿Ya tienes una cuenta?
              </Text>
              <Link href="/" className="text-[#145F52] text-sm font-bold">
                Inicia sesión
              </Link>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
