import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";

type Service = { id: string; name: string; price: number };
type Barber = { id: string; name: string; title?: string; image: string };

const SERVICES: Service[] = [
  { id: "haircut", name: "Haircut", price: 30 },
  { id: "beard", name: "Beard Trim", price: 12 },
  { id: "color", name: "Hair Color", price: 45 },
  { id: "style", name: "Styling", price: 20 },
];

const BARBERS: Barber[] = [
  {
    id: "ethan",
    name: "Ethan",
    title: "Senior Barber",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8yM_8YHomO3yxrYkvCh5QoabW6d-OsFfqAyVeelWx_TXx-9osjnshq9ftBH2hfxGCWhAViwBN97LdKeNWZRIjcRy3b_Q0wSVZhmjpsWiq4Pl7RIkjfEMvAtcCDrL6_9wfXZaPIUVGXwIquZ0RvMKkk9Ct-W38rn8A_dDR4bR2hdK_JjM-7oJcsmXBY-TKx-ollraHpGoXukCfTp-BOa1EqHeO-9L_fMMXVww-hW64iulHj6yuU0LTb0YMBecul1eWjqZRfVNGCC7",
  },
  {
    id: "noah",
    name: "Noah",
    title: "Barber",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBILB95Ef7v-0xvvE5YrMldMFMB7n92YROy4oXUHP58iL0c7HJXBxi9nI7fowiKczS9QsinfP19mKBTadTZ5_P89kbQ7z8K-zEzQeUjiKlHXAKrDPIDv43DuuhY9TJ8TOeS0zbjukxGvKLlwDxDJIcDYQ4FccKVuSOLcbmFHFOZp1vMvhYwlqCtQBSozEA8KTBAFlHLpYC_4SHjsaBYm1jQDZ_LOEl_d2GDwPaFb4xXkiPO1288hujdzdhBChJuBOSAowNFjC99Mtk9",
  },
  {
    id: "liam",
    name: "Liam",
    title: "Junior Barber",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbAADJphrq4Yu7JyJKpfcnc-9gSYMF_NCOKuHlZvajnFQum6VBZtXSxO2X0n7_o1pVwPUl6KxdjdlGGj7LTYj8cN35jjFLYZfeM-JWsAMlWrhrbI6mPPyCWENE3LGlud6OGazYIYQVYQq2sauPbjHkRDyWfHM0ZlIVu3ZJ9atCYw8ztLkwoWf7oUvTyaqEuSMk7ecVNGab1H6FUIN8ejyhOxoWXh2T7ZtCiGHjCCwCNmLRsxHH9vPcqJzKuxLmvrR3knm-1u8Z2glV",
  },
];

const AVAILABLE_TIMES = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"];

export default function BookingScreen() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [selectedBarberId, setSelectedBarberId] = useState<string>(BARBERS[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(AVAILABLE_TIMES[1]); // default 10:30

  const service = SERVICES.find((s) => s.id === selectedServiceId)!;
  const barber = BARBERS.find((b) => b.id === selectedBarberId)!;

  const serviceFee = 5;
  const total = service.price + serviceFee;

  function onConfirm() {
    // Replace with navigation / API call in your app
    Alert.alert(
      "Booking Confirmed",
      `Service: ${service.name}\nBarber: ${barber.name}\nDate: ${format(selectedDate, "MMM d, yyyy")}\nTime: ${selectedTime}\nTotal: $${total}`
    );
  }

  // small calendar: render 30 days from today
  const calendarDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <MaterialIcons name="arrow-back-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white -ml-10">
          Book Appointment
        </Text>
      </View>

      <ScrollView className="flex-1 pb-40">
        <View className="p-4 space-y-6">
          {/* Select Service */}
          <View>
            <Text className="text-base font-bold text-white mb-3">Select Service</Text>
            <View className="flex-row flex-wrap gap-3">
              {SERVICES.map((s) => {
                const active = s.id === selectedServiceId;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => setSelectedServiceId(s.id)}
                    className={`px-4 py-2 rounded-lg ${
                      active ? "bg-primary text-black" : "bg-primary/20 text-white/90"
                    }`}
                    >
                    <Text className={`${active ? "font-bold" : "font-medium"}`}>{s.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Select Barber */}
          <View>
            <Text className="text-base font-bold text-white mb-3">Select Barber</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              {BARBERS.map((b) => {
                const active = b.id === selectedBarberId;
                return (
                  <TouchableOpacity
                    key={b.id}
                    onPress={() => setSelectedBarberId(b.id)}
                    className="flex items-center gap-2 flex-shrink-0 w-24 mr-4"
                  >
                    <ImageBackground
                      source={{ uri: b.image }}
                      className={`w-24 h-24 rounded-full ${active ? "ring-2 ring-primary" : ""}`}
                      imageStyle={{ borderRadius: 999 }}
                    />
                    <View className="items-center">
                      <Text className={`text-sm ${active ? "font-bold text-white" : "text-white/90"}`}>{b.name}</Text>
                      <Text className="text-xs text-white/60">{b.title}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Select Date */}
          <View>
            <Text className="text-base font-bold text-white mb-3">Select Date & Time</Text>

            <View className="rounded-xl p-3 bg-primary/10">
              <View className="flex-row items-center justify-between mb-3">
                <TouchableOpacity
                  onPress={() => {
                    const prev = new Date(selectedDate);
                    prev.setDate(prev.getDate() - 30);
                    setSelectedDate(prev);
                  }}
                  className="w-8 h-8 items-center justify-center rounded-full"
                >
                  <MaterialIcons name="chevron-left" size={20} color="#fff" />
                </TouchableOpacity>

                <Text className="text-sm font-bold text-white">
                  {format(selectedDate, "MMMM yyyy")}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    const next = new Date(selectedDate);
                    next.setDate(next.getDate() + 30);
                    setSelectedDate(next);
                  }}
                  className="w-8 h-8 items-center justify-center rounded-full"
                >
                  <MaterialIcons name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* simple horizontal date row (scrollable) */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
                {calendarDays.map((d) => {
                  const isSelected =
                    d.toDateString() === selectedDate.toDateString();
                  return (
                    <TouchableOpacity
                      key={d.toISOString()}
                      onPress={() => setSelectedDate(d)}
                      className={`w-14 h-14 mr-3 rounded-full items-center justify-center ${
                        isSelected ? "bg-primary" : "hover:bg-primary/20"
                      }`}
                    >
                      <Text className={`text-sm ${isSelected ? "font-bold text-black" : "text-white"}`}>
                        {format(d, "d")}
                      </Text>
                      <Text className={`text-xs ${isSelected ? "text-black" : "text-white/70"}`}>
                        {format(d, "EEE")}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Time slots */}
              <View className="flex-row justify-center gap-2 mt-4 flex-wrap">
                {AVAILABLE_TIMES.map((t) => {
                  const active = t === selectedTime;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setSelectedTime(t)}
                      className={`px-4 py-2 rounded-lg ${
                        active ? "bg-primary text-black" : "bg-primary/20 text-white/80"
                      }`}
                    >
                      <Text className={`${active ? "font-bold" : "font-medium"}`}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Payment Summary */}
          <View>
            <Text className="text-base font-bold text-white mb-3">Payment Summary</Text>
            <View className="space-y-2 text-sm">
              <View className="flex-row justify-between">
                <Text className="text-white/60">Service ({service.name})</Text>
                <Text className="font-medium text-white">${service.price}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/60">Service Fee</Text>
                <Text className="font-medium text-white">${serviceFee}</Text>
              </View>
              <View className="border-t border-white/20 my-2" />
              <View className="flex-row justify-between font-bold">
                <Text className="text-white">Total</Text>
                <Text className="text-white">${total}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer / Confirm */}
      <View className="absolute bottom-0 left-0 right-0 bg-background-dark/90 border-t border-primary/20">
        <View className="p-4">
          <TouchableOpacity
            onPress={onConfirm}
            className="w-full h-12 px-5 rounded-lg bg-primary items-center justify-center"
          >
            <Text className="font-bold text-black text-base">Confirm Booking</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-around items-center px-4 pb-4 pt-2 bg-primary/10">
          <TouchableOpacity className="flex flex-col items-center gap-1">
            <MaterialIcons name="home" size={20} color="#fff" />
            <Text className="text-xs text-white/60">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center gap-1">
            <MaterialIcons name="calendar-month" size={20} color="#ecb613" />
            <Text className="text-xs text-primary font-bold">Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex flex-col items-center gap-1">
            <MaterialIcons name="person" size={20} color="#fff" />
            <Text className="text-xs text-white/60">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}