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
 * PaymentHistoryScreen.tsx
 * - Tailwind via nativewind (use className)
 * - Replace sampleTransactions with backend data as needed
 */

type Transaction = {
  id: string;
  title: string;
  date: string; // human readable date
  amount: string;
  ref: string;
};

const sampleTransactions: Transaction[] = [
  { id: "t1", title: "Haircut & Shave", date: "July 26, 2024", amount: "$45.00", ref: "#24072601" },
  { id: "t2", title: "Beard Trim", date: "June 15, 2024", amount: "$30.00", ref: "#24061502" },
  { id: "t3", title: "Premium Cut", date: "May 3, 2024", amount: "$50.00", ref: "#24050303" },
];

export default function PaymentHistoryScreen() {
  function onTransactionPress(tx: Transaction) {
    Alert.alert(tx.title, `Amount: ${tx.amount}\nDate: ${tx.date}\nRef: ${tx.ref}`);
  }

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
          Payment History
        </Text>

        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="p-4 space-y-6">
        <View>
          <Text className="text-lg font-bold text-black dark:text-white mb-4">
            Recent Transactions
          </Text>

          <View className="space-y-3">
            {sampleTransactions.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                onPress={() => onTransactionPress(tx)}
                activeOpacity={0.9}
                className="flex-row items-center gap-4 rounded-xl bg-primary/10 dark:bg-primary/20 p-4 shadow-sm"
              >
                <View className="h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/30">
                  <MaterialIcons name="receipt-long" size={20} color="#ecb613" />
                </View>

                <View className="flex-1">
                  <Text className="font-bold text-black dark:text-white">{tx.title}</Text>
                  <Text className="text-sm text-black/60 dark:text-white/60">{tx.date}</Text>
                </View>

                <View className="text-right">
                  <Text className="font-bold text-black dark:text-white">{tx.amount}</Text>
                  <Text className="text-sm text-black/60 dark:text-white/60">{tx.ref}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View className="sticky bottom-0 border-t border-primary/20 bg-background-light dark:bg-background-dark/80">
        <View className="flex-row justify-around p-2">
          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2 rounded-lg"
            onPress={() => {
              /* navigate to Home */
            }}
          >
            <MaterialIcons name="home" size={22} color="#6b7280" />
            <Text className="text-xs font-medium text-black/60 dark:text-white/60">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2 rounded-lg"
            onPress={() => {
              /* navigate to Bookings */
            }}
          >
            <MaterialIcons name="calendar-month" size={22} color="#6b7280" />
            <Text className="text-xs font-medium text-black/60 dark:text-white/60">Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary/20 dark:bg-primary/30"
            onPress={() => {
              /* navigate to Profile */
            }}
          >
            <MaterialIcons name="person" size={22} color="#ecb613" />
            <Text className="text-xs font-bold text-primary">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
