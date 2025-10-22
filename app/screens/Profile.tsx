import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Switch,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Profile.tsx
 * - Uses nativewind `className` Tailwind utilities (dark mode via `class` on root)
 * - Replace placeholder images/data with your backend data as needed
 */

const preferredShop = {
  name: "The Sharp Edge",
  address: "123 Main St, Anytown",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDBjKTPINDMCprVI6DwR9hS6sLsrpJGA0zSr-a_C5aa0cefzL5t5802iQ3qfPYO_IJ6b6bIwPBjZ_dXiM12uEsOccyEer-tcuU1ZmnjMcYBWX19iPdfqNnbe236dMIb9ACQ-gVrQfnQsJBGmOVbZHTAYl_oYWz_UAT1zuqzsnbIYuNOpWWD-KFoXUNwjVQXbwW4-F15UMJ1fLl_j1EryaCxmqQ-b5IyDNyU00tIkhQMlQhbKixzyOB384ewtjigfcdD2f5nVguc0j2l",
};

const avatarUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxozkaHythRzKSGCA-LOHiGXbNheUdXhx-bfHlotkPM_-mVtJ2c4F1K5o5c07fYg_GG22nKVibYoStNOsD11G2BF7A0ErqG3C64ITDzrwsIb-LR6DOqvntHjIxs9QqIecRkDY50STlINrrgjhkOzNt4hP2jgi4xBMegaSXuwy_XIofmrUIla0H-nM8ao2-wE42wf-HyBQnW_VJyQi7cWFtCQmabH3lkH72yeBZmXb6a82V_Ziqz_BZTajc7N0ZcA-pvt2M22S-s6kP";

const Profile: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  function onToggleNotifications(value: boolean) {
    setNotificationsEnabled(value);
    // TODO: persist to API / storage
  }

  function onOpenPaymentMethods() {
    Alert.alert("Payment Methods", "Open payment methods screen (not implemented).");
  }

  function onOpenHelp() {
    Alert.alert("Help & Support", "Open help and support (not implemented).");
  }

  function onOpenAbout() {
    Alert.alert("About", "App version 1.0.0\nMade with ❤️");
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => {
            /* navigation.goBack ? */ Alert.alert("Back", "Go back (implement navigation)");
          }}
          className="w-10 h-10 items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-lg font-bold text-black dark:text-white pr-6">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Avatar + Name */}
        <View className="flex flex-col items-center gap-4 mb-8">
          <ImageBackground
            source={{ uri: avatarUrl }}
            className="w-32 h-32 rounded-full shadow-lg"
            imageStyle={{ borderRadius: 999 }}
          />
          <View className="text-center">
            <Text className="text-2xl font-bold text-black dark:text-white">Ethan Carter</Text>
            <Text className="text-sm text-black/60 dark:text-white/60">Member since 2021</Text>
          </View>
        </View>

        {/* Preferred Shops */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-black dark:text-white px-1 pb-2">Preferred Shops</Text>

          <View className="bg-white/5 dark:bg-black/20 p-4 rounded-xl flex-row items-center gap-4 shadow-sm">
            <View className="flex-1">
              <Text className="text-xs text-primary font-semibold uppercase tracking-wider">Preferred</Text>
              <Text className="text-base font-bold text-black dark:text-white">{preferredShop.name}</Text>
              <Text className="text-sm text-black/60 dark:text-white/60">{preferredShop.address}</Text>
            </View>

            <ImageBackground
              source={{ uri: preferredShop.image }}
              className="w-24 h-24 rounded-lg"
              imageStyle={{ borderRadius: 12 }}
            />
          </View>
        </View>

        {/* Settings */}
        <View>
          <Text className="text-lg font-bold text-black dark:text-white px-1 pb-2">Settings</Text>

          <View className="bg-white/5 dark:bg-black/20 rounded-xl shadow-sm overflow-hidden">
            {/* Notifications */}
            <View className="flex-row items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <Text className="text-base text-black dark:text-white">Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={onToggleNotifications}
                trackColor={{ false: "#ccc", true: "#ecb613" }}
                thumbColor={notificationsEnabled ? "#fff" : "#fff"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            {/* Payment Methods */}
            <TouchableOpacity
              onPress={onOpenPaymentMethods}
              className="flex-row items-center justify-between p-4 border-b border-black/10 dark:border-white/10"
            >
              <Text className="text-base text-black dark:text-white">Payment Methods</Text>
              <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity
              onPress={onOpenHelp}
              className="flex-row items-center justify-between p-4 border-b border-black/10 dark:border-white/10"
            >
              <Text className="text-base text-black dark:text-white">Help &amp; Support</Text>
              <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
            </TouchableOpacity>

            {/* About */}
            <TouchableOpacity onPress={onOpenAbout} className="flex-row items-center justify-between p-4">
              <Text className="text-base text-black dark:text-white">About</Text>
              <MaterialIcons name="chevron-right" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-black/10 dark:border-white/10">
        <View className="flex-row justify-around items-center p-2">
          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => Alert.alert("Navigate", "Go to Home (implement navigation)")}
          >
            <MaterialIcons name="home" size={22} color="#6b7280" />
            <Text className="text-xs text-black/60 dark:text-white/60">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => Alert.alert("Navigate", "Go to Bookings (implement navigation)")}
          >
            <MaterialIcons name="calendar-month" size={22} color="#6b7280" />
            <Text className="text-xs text-black/60 dark:text-white/60">Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => Alert.alert("Profile", "You are on Profile")}
          >
            <MaterialIcons name="person" size={22} color="#ecb613" />
            <Text className="text-xs font-bold text-primary">Profile</Text>
          </TouchableOpacity>
        </View>

        {/* small spacer so content doesn't overlap safe area */}
        <View className="h-4 bg-background-light dark:bg-background-dark" />
      </View>
    </SafeAreaView>
  );
};

export default Profile;