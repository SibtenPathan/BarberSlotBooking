import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * InAppChatScreen.tsx
 * - Uses nativewind className Tailwind utilities
 * - Simple local state for messages (replace with websocket / API as needed)
 * - Left = barber/shop, Right = user
 */

type Message = {
  id: string;
  from: "shop" | "user";
  text: string;
  avatar?: string;
};

const SHOP_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDVG9C9bAqOFG9-1tR25YPOHBbRIIK3WXunYuAbUFw3LEDaJzH4Ut_M4soPunsUiCbgsXWFaRdpgiJZusXqccH2N9CVUbhYXUixbOPSLLSPYQVzrXECE3IaXk0vgS323dMTfeG5oiJeFoSFuQ6p7c15aIySEh3Fi4DHvhXm46xeznfcl--cQcKUx4Y8DyVxmVpDC_5ImY5Xb30ICYQnDkPtLkjmR7XP7kfiHPrn_p_56ZeTh9lykYPLed021ejzPHP1N6-Eb9qyJ8G7";

const USER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgDq2_1myP-Qs9LuVBH6PDmmNehv7FChWylPA3qAOpd_grCluSjzMfIIqvaNiIBTvwiVRjgLIYqFZq5J0Usy8qZtWpakbFUw7lStK8zBjPfMBO5t4HWOONmcXUKUnDDpN2MPHQS0rRd3NDbtMefyYe4sj1WzB7SZI9RMCZ3JEAgBvn6QwgBVWSxYTWq6_bCb7Es524eG6mhcjNsyXG1JaZhVTFRd9hr2LOAFp1vwtRl9DlzHvM70UFOcEMfUeFiFcgkbppCM-thV98";

export default function InAppChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", from: "shop", text: "Hi there! How can I help you today?", avatar: SHOP_AVATAR },
    { id: "m2", from: "user", text: "Hi! I'd like to book an appointment for a haircut.", avatar: USER_AVATAR },
    { id: "m3", from: "shop", text: "Sure, what day and time are you thinking?", avatar: SHOP_AVATAR },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView | null>(null);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: Math.random().toString(36).slice(2),
      from: "user",
      text: trimmed,
      avatar: USER_AVATAR,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // auto-scroll to bottom after next frame
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // placeholder auto-reply (simulate shop response)
    setTimeout(() => {
      const reply: Message = {
        id: Math.random().toString(36).slice(2),
        from: "shop",
        text: "Thanks — I have an opening tomorrow at 10:00 AM. Want to book it?",
        avatar: SHOP_AVATAR,
      };
      setMessages((prev) => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 800);
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-background-light/80 dark:bg-background-dark/80 border-b border-white/10 dark:border-white/10">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <MaterialIcons name="arrow-back-ios-new" size={20} color={Platform.OS === "ios" ? "#111827" : "#fff"} />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-black dark:text-white">Barber Shop</Text>

          <View className="w-10" />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 p-4 space-y-6"
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {messages.map((m) =>
            m.from === "shop" ? (
              <View key={m.id} className="flex-row items-end gap-3">
                <ImageBackground
                  source={{ uri: m.avatar }}
                  className="w-10 h-10 rounded-full shrink-0"
                  imageStyle={{ borderRadius: 999 }}
                />
                <View className="flex flex-col items-start gap-1">
                  <Text className="text-sm text-black/50 dark:text-white/50">Barber Shop</Text>
                  <View className="bg-black/10 dark:bg-white/10 p-3 rounded-lg rounded-bl-none max-w-[72%]">
                    <Text className="text-black dark:text-white">{m.text}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View key={m.id} className="flex-row items-end gap-3 justify-end">
                <View className="flex flex-col items-end gap-1">
                  <Text className="text-sm text-black/50 dark:text-white/50">You</Text>
                  <View className="bg-primary p-3 rounded-lg rounded-br-none max-w-[72%]">
                    <Text className="text-background-dark">{m.text}</Text>
                  </View>
                </View>
                <ImageBackground
                  source={{ uri: m.avatar }}
                  className="w-10 h-10 rounded-full shrink-0"
                  imageStyle={{ borderRadius: 999 }}
                />
              </View>
            )
          )}
        </ScrollView>

        {/* Input */}
        <View className="p-4 bg-background-light dark:bg-background-dark border-t border-white/10 dark:border-white/10">
          <View className="flex-row items-center gap-3">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#6b7280"
              className="flex-1 h-12 px-4 rounded-lg bg-black/10 dark:bg-white/10 text-black dark:text-white"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="w-12 h-12 items-center justify-center bg-primary rounded-lg"
              activeOpacity={0.8}
            >
              <MaterialIcons name="send" size={20} color="#221d10" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}