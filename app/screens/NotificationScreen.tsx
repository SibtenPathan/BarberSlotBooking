import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * NotificationScreen.tsx
 * - Tailwind classes via nativewind (className supported)
 * - Replace sampleNotifications with your API data as needed
 */

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  icon?: "task-alt" | "schedule" | "local-offer";
  onPress?: () => void;
};

const sampleNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Booking Confirmed",
    body: "Your appointment with Alex is confirmed for tomorrow at 2 PM.",
    icon: "task-alt",
    onPress: () => Alert.alert("Booking Confirmed", "Details shown here."),
  },
  {
    id: "n2",
    title: "Appointment Reminder",
    body: "Don't forget your haircut with Ben at 10 AM today.",
    icon: "schedule",
    onPress: () => Alert.alert("Reminder", "Don't be late 😉"),
  },
  {
    id: "n3",
    title: "Special Offer",
    body: "Get 20% off your next haircut with Chris.",
    icon: "local-offer",
    onPress: () => Alert.alert("Offer", "20% off applied."),
  },
];

export default function NotificationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => {
            /* implement navigation.goBack() */
          }}
          className="w-10 h-10 items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text className="flex-1 text-center text-lg font-bold text-black dark:text-white">
          Notifications
        </Text>

        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="p-4 space-y-4">
        {sampleNotifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            activeOpacity={0.85}
            onPress={n.onPress}
            className="flex-row items-start gap-4 rounded-xl bg-white/5 dark:bg-black/10 p-4 shadow-sm"
          >
            <View className="h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <MaterialIcons
                name={n.icon ?? "notifications"}
                size={24}
                color="#ecb613"
              />
            </View>

            <View className="flex-1">
              <Text className="font-bold text-black dark:text-white">{n.title}</Text>
              <Text className="text-sm text-black/60 dark:text-white/60 mt-1">
                {n.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* If no notifications */}
        {sampleNotifications.length === 0 && (
          <View className="rounded-xl bg-white/5 dark:bg-black/10 p-6 items-center">
            <Text className="text-sm text-black/60 dark:text-white/60">
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <View className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-black/10 dark:border-white/10">
        <View className="flex-row justify-around p-2">
          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => {
              /* navigate to Home */
            }}
          >
            <MaterialIcons name="home" size={22} color="#6b7280" />
            <Text className="text-xs text-black/60 dark:text-white/60">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => {
              /* navigate to Bookings */
            }}
          >
            <MaterialIcons name="calendar-month" size={22} color="#6b7280" />
            <Text className="text-xs text-black/60 dark:text-white/60">Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => {
              /* navigate to Notifications (current) */
            }}
          >
            <MaterialIcons name="notifications" size={22} color="#ecb613" />
            <Text className="text-xs font-bold text-primary">Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2"
            onPress={() => {
              /* navigate to Profile */
            }}
          >
            <MaterialIcons name="person" size={22} color="#6b7280" />
            <Text className="text-xs text-black/60 dark:text-white/60">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}