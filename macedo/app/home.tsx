import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getGreeting } from '@/lib/greeting';
import { LogOut, Sun, Moon, Sunset, CheckCircle2, Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  const greeting = getGreeting();
  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 20;
  const Icon = isMorning ? Sun : isAfternoon ? Sunset : Moon;

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F6]">
      <View className="flex-1 w-full max-w-[720px] self-center px-6 py-8">

        <View className="flex-row items-center justify-between mb-12">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#145F52] rounded-xl items-center justify-center">
              <Text className="text-white text-lg font-bold">M</Text>
            </View>
            <Text className="text-[#16332E] text-base font-bold ml-3">MACEDO</Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Cerrar sesión"
            onPress={() => router.replace('/')}
            className="w-10 h-10 bg-white border border-[#DCE5E2] rounded-xl items-center justify-center">
            <LogOut size={18} color="#60736E" />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View className="mb-10">
          <View className="w-14 h-14 bg-[#E0EFEB] rounded-2xl items-center justify-center mb-5">
            <Icon size={26} color="#145F52" />
          </View>
          <Text className="text-[#70817D] text-sm">
            {greeting}
          </Text>
          <Text className="text-[#16332E] text-[30px] leading-9 font-bold mt-1">
            Usuario
          </Text>
        </View>

        {/* Info card */}
        <View className="bg-[#145F52] rounded-2xl p-6 mb-5">
          <View className="flex-row items-center mb-4">
            <CheckCircle2 size={21} color="#BCE4DA" />
            <Text className="text-white text-base font-bold ml-3">
              Todo está listo
            </Text>
          </View>
          <Text className="text-[#D6ECE7] text-sm leading-5">
            Has iniciado sesión correctamente. Desde aquí podrás acceder a toda tu información.
          </Text>
        </View>

        <View className="bg-white border border-[#DCE5E2] rounded-2xl p-5">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-[#FFF0EB] rounded-xl items-center justify-center mr-4">
              <Sparkles size={19} color="#D95D41" />
            </View>
            <View className="flex-1">
              <Text className="text-[#16332E] text-sm font-bold">Una experiencia más simple</Text>
              <Text className="text-[#70817D] text-xs leading-5 mt-1">Tu espacio personal ya está activo.</Text>
            </View>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
