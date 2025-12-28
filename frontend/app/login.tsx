import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { useAuth } from "./contexts/AuthContext";

// Use your computer's local IP address for Expo testing
const API_URL = "http://10.153.87.168:5000/api/auth";

const Login: React.FC = () => {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const isDark = useColorScheme() === "dark";

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const bgColor = isDark ? "bg-[#221d10]" : "bg-[#f8f8f6]";
  const textColor = isDark ? "text-[#f8f8f6]" : "text-[#221d10]";
  const subTextColor = isDark ? "text-[#9ca3af]" : "text-[#4b5563]";
  const placeholderColor = isDark ? "#9ca3af" : "#6b7280";
  const inputBg = isDark ? "bg-[#1e1e1e]/50" : "bg-[#e2e8f0]/50";
  const socialBg = inputBg;

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user and token in auth context
        console.log("Login response data:", data);
        await authLogin(data.user, data.token);
        console.log("User stored in context, navigating to Home...");
        router.push("/screens/Home");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !phone || !signupPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FirstName: firstName,
          LastName: lastName,
          email,
          phone,
          password: signupPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message, [
          {
            text: "OK",
            onPress: () => {
              setIsSignup(false);
              setEmailOrPhone(email);
            },
          },
        ]);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="p-6"
        >
          {/* Header */}
          <View className="flex-row justify-center items-center relative mb-8">
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
          <View className="flex-grow items-center justify-center">
            <Text className={`text-4xl font-bold ${textColor}`}>
              {isSignup ? "Sign Up" : "Welcome"}
            </Text>
            <Text className={`text-base text-center mt-2 max-w-[280px] ${subTextColor}`}>
              {isSignup
                ? "Create an account to book your next haircut"
                : "Sign in or create an account to book your next haircut"}
            </Text>

            {/* Input Fields */}
            {isSignup ? (
              <>
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-8 ${inputBg} ${textColor}`}
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-3 ${inputBg} ${textColor}`}
                  value={lastName}
                  onChangeText={setLastName}
                />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-3 ${inputBg} ${textColor}`}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  placeholder="Phone"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-3 ${inputBg} ${textColor}`}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-3 ${inputBg} ${textColor}`}
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry
                />
              </>
            ) : (
              <>
                <TextInput
                  placeholder="Email or Phone"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-12 ${inputBg} ${textColor}`}
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  autoCapitalize="none"
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={placeholderColor}
                  className={`w-full h-14 rounded-xl px-4 text-base mt-3 ${inputBg} ${textColor}`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              className="w-full h-14 bg-yellow-500 rounded-xl justify-center items-center mt-3"
              onPress={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#221d10" />
              ) : (
                <Text className="text-[#221d10] font-bold text-base">
                  {isSignup ? "Sign Up" : "Continue"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Login/Signup */}
            <TouchableOpacity
              onPress={() => setIsSignup(!isSignup)}
              className="mt-4"
            >
              <Text className={`text-sm ${subTextColor}`}>
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <Text className="text-yellow-500 font-bold">
                  {isSignup ? "Login" : "Sign Up"}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            {!isSignup && (
              <>
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
                    <Text className={`font-bold text-sm ${textColor}`}>Google</Text>
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
              </>
            )}
          </View>

          {/* Footer */}
          <Text className={`text-xs text-center max-w-[260px] self-center mt-8 mb-4 ${subTextColor}`}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
