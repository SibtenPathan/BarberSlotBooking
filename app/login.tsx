import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const Login: React.FC = () => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const bgColor = isDark ? "bg-[#221d10]" : "bg-[#f8f8f6]";
  const textColor = isDark ? "text-[#f8f8f6]" : "text-[#221d10]";
  const subTextColor = isDark ? "text-[#9ca3af]" : "text-[#4b5563]";
  const placeholderColor = isDark ? "#9ca3af" : "#6b7280";
  const inputBg = isDark ? "bg-[#1e1e1e]/50" : "bg-[#e2e8f0]/50";
  const socialBg = inputBg;

  return (
    <SafeAreaView className={`flex-1 justify-between p-6 ${bgColor}`}>
      {/* Header */}
      <View className="flex-row justify-center items-center relative">
        <Text className={`text-lg font-bold ${textColor}`}>Barber Booking</Text>
        <TouchableOpacity className="absolute right-0">
          <MaterialIcons
            name="help-outline"
            size={24}
            color={isDark ? "#a3a3a3" : "#6b7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Main */}
      <View className="flex-grow items-center justify-center -mt-8">
        <Text className={`text-4xl font-bold ${textColor}`}>Welcome</Text>
        <Text className={`text-base text-center mt-2 max-w-[280px] ${subTextColor}`}>
          Sign in or create an account to book your next haircut.
        </Text>

        {/* Input Field */}
        <TextInput
          placeholder="Email or Phone"
          placeholderTextColor={placeholderColor}
          className={`w-full h-14 rounded-xl px-4 text-base mt-12 ${inputBg}`}
        />

        {/* Continue Button */}
        <TouchableOpacity
          className="w-full h-14 bg-yellow-500 rounded-xl justify-center items-center mt-3"
          onPress={() => router.push("/screens/Home")}
        >
          <Text className="text-[#221d10] font-bold text-base">Continue</Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text className={`text-sm text-center mt-8 ${subTextColor}`}>
          Or continue with
        </Text>

        {/* Social Buttons */}
        <View className="flex-row justify-center mt-3 space-x-3 w-full">
          <TouchableOpacity
            className={`flex-1 h-12 ${socialBg} rounded-xl flex-row items-center justify-center space-x-2`}
          >
            <FontAwesome5
              name="google"
              size={16}
              color={isDark ? "#f8f8f6" : "#374151"}
            />
            <Text className={`font-bold text-sm ${textColor}`}>oogle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 h-12 ${socialBg} rounded-xl flex-row items-center justify-center space-x-2`}
          >
            <FontAwesome5
              name="facebook"
              size={16}
              color={isDark ? "#f8f8f6" : "#374151"}
            />
            <Text className={`font-bold text-sm ${textColor}`}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Text className={`text-xs text-center max-w-[260px] self-center mb-4 ${subTextColor}`}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </SafeAreaView>
  );
};

export default Login;
