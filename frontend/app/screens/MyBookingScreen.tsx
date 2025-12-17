import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * MyBookingScreen.tsx
 * - Uses nativewind className Tailwind utilities (dark mode class is supported)
 * - No external date libs required
 * - Replace sample data with real data from your backend as needed
 */

type Booking = {
  id: string;
  dateISO: string; // ISO string for date/time
  title: string;
  shop: string;
  image: string;
};

const UPCOMING: Booking[] = [
  {
    id: "b1",
    dateISO: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    title: "Classic Cut",
    shop: "The Barber Shop",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv-7vquDRp6BlfrKeKET5BCFej36EmIQWCRf0csRl4aAuMoztJpCcmIXScJ1nHfZ3AfMBVmqsCPfwhEFYWIfVhlNZ7j0OPxemmB6UkMRuoczIkZgaynwFAzVnKHea00KFIscQWQOGa5dmJ2J6UcB4Tb1tdNevGICOaAfcIMzlTugxQFExBKSDDlDTC76admv0fzDNmBhahsUkoVwJIDON0O2vOXoZIAXScI4qKyXmKomGh94rXST82QIIdyHW_KzhIuccG-4s0bsQo",
  },
];

const PAST: Booking[] = [
  {
    id: "b2",
    dateISO: new Date("2024-05-15T10:00:00").toISOString(),
    title: "Fade",
    shop: "The Barber Shop",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ7fENeYcVO2IUIZHrkuVgmnxCDl6dxfIKFERbghB8Lz1LW1U60wROiU-9wCpBDBOxcjbxJ-A71wFMsASCmlYxQH7eEie_RSWyHt1Xfr9R92L7wiWQQ06p_TGFBmMYSoNbUa5E1pEZ6Xizp0PHXL31LJVsQw7NK_SXnIP-kKKm4RFBqkuiZov5wl3SlaBuxPHmQ8CfuTDTA8CUVdczCHJQww17os3HzaV12hVxnyQjBzq3TCZkJ6Q-kfZM6QiGRD-k1NvQChTyW0ul",
  },
];

function formatReadable(dateISO: string) {
  const d = new Date(dateISO);
  // Example: "Tomorrow, 10:00 AM" or "May 15, 2024"
  const today = new Date();
  const diffDays = Math.floor((d.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / (24 * 60 * 60 * 1000));
  const time = new Date(dateISO).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;
  return `${new Date(dateISO).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

export default function MyBookingScreen() {
  function onReschedule(booking: Booking) {
    Alert.alert("Reschedule", `Reschedule booking: ${booking.title}`, [
      { text: "OK" },
    ]);
  }

  function onCancel(booking: Booking) {
    Alert.alert(
      "Cancel booking",
      `Are you sure you want to cancel "${booking.title}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: () => {
            // TODO: call API to cancel
            Alert.alert("Canceled", "Your booking has been canceled.");
          },
        },
      ]
    );
  }

  function onRebook(booking: Booking) {
    // TODO: navigate to booking flow with prefilled data
    Alert.alert("Rebook", `Rebooking ${booking.title} at ${booking.shop}`);
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => { /* navigation.goBack() */ }} className="w-10 h-10 items-center justify-center">
          <MaterialIcons name="arrow-back-ios" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
          Bookings
        </Text>
        <View className="w-8" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {/* Upcoming */}
        <Text className="px-2 pb-2 pt-4 text-xl font-bold text-gray-900 dark:text-white">
          Upcoming
        </Text>

        <View className="space-y-4">
          {UPCOMING.map((b) => (
            <View key={b.id} className="flex-row items-stretch gap-4 rounded-xl bg-white dark:bg-black/20 p-4 shadow-sm">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {formatReadable(b.dateISO)}
                </Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {b.title}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">{b.shop}</Text>

                <View className="mt-4 flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => onReschedule(b)}
                    className="flex-1 rounded-lg bg-gray-200 dark:bg-white/10 px-4 py-2"
                  >
                    <Text className="text-sm font-medium text-gray-800 dark:text-white text-center">Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onCancel(b)}
                    className="flex-1 rounded-lg bg-gray-200 dark:bg-white/10 px-4 py-2"
                  >
                    <Text className="text-sm font-medium text-gray-800 dark:text-white text-center">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ImageBackground
                source={{ uri: b.image }}
                className="w-24 h-24 flex-shrink-0 rounded-lg"
                imageStyle={{ borderRadius: 12 }}
              />
            </View>
          ))}
        </View>

        {/* Past */}
        <Text className="px-2 pb-2 pt-4 text-xl font-bold text-gray-900 dark:text-white">Past</Text>

        <View className="space-y-4 pb-8">
          {PAST.map((b) => (
            <View key={b.id} className="flex-row items-stretch gap-4 rounded-xl bg-white dark:bg-black/20 p-4 shadow-sm">
              <View className="flex-1">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(b.dateISO).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-white mt-1">{b.title}</Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">{b.shop}</Text>

                <View className="mt-4">
                  <TouchableOpacity
                    onPress={() => onRebook(b)}
                    className="w-full rounded-lg bg-primary px-4 py-2"
                  >
                    <Text className="text-sm font-bold text-black text-center">Rebook</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <ImageBackground
                source={{ uri: b.image }}
                className="w-24 h-24 flex-shrink-0 rounded-lg"
                imageStyle={{ borderRadius: 12 }}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer / Nav */}
      <View className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 border-t border-gray-200 dark:border-white/10">
        <View className="flex-row justify-around p-2">
          <TouchableOpacity className="flex flex-col items-center gap-1 p-2" onPress={() => { /* navigate to home */ }}>
            <MaterialIcons name="home" size={22} color="#6b7280" />
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center gap-1 p-2" onPress={() => { /* already here */ }}>
            <MaterialIcons name="calendar-month" size={22} color="#ecb613" />
            <Text className="text-xs font-medium text-primary">Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center gap-1 p-2" onPress={() => { /* navigate to profile */ }}>
            <MaterialIcons name="person" size={22} color="#6b7280" />
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}