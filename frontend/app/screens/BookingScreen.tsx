import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

interface Barber {
  _id: string;
  user_id: {
    FirstName: string;
    LastName: string;
    profileImage?: string;
  };
  experience: number;
  specialization: string[];
  availability: {
    date: Date;
    slots: {
      time: string;
      isBooked: boolean;
    }[];
  }[];
}

const API_URL = "http://10.107.204.168:5000/api";

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, loading } = useAuth();
  
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [shopName, setShopName] = useState<string>("");
  const [shopId, setShopId] = useState<string>("");
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Debug auth state
  useEffect(() => {
    console.log("Auth state - Loading:", loading, "User:", user);
  }, [loading, user]);

  useEffect(() => {
    // Parse params
    if (params.services && typeof params.services === 'string') {
      const parsedServices = JSON.parse(params.services);
      setServices(parsedServices);
    }
    if (params.barbers && typeof params.barbers === 'string') {
      const parsedBarbers = JSON.parse(params.barbers);
      setBarbers(parsedBarbers);
      if (parsedBarbers.length > 0) {
        setSelectedBarberId(parsedBarbers[0]._id);
      }
    }
    if (params.shopName) {
      setShopName(params.shopName as string);
    }
    if (params.shopId) {
      setShopId(params.shopId as string);
    }
  }, [params.services, params.barbers, params.shopName, params.shopId]);

  // Refresh barber data to get updated slot availability
  const refreshBarberData = async () => {
    if (!shopId) return;
    try {
      const response = await fetch(`${API_URL}/shops/${shopId}`);
      const data = await response.json();
      if (data.success && data.data.barbers) {
        setBarbers(data.data.barbers);
      }
    } catch (error) {
      console.error("Error refreshing barber data:", error);
    }
  };

  const selectedBarber = barbers.find(b => b._id === selectedBarberId);
  
  // Find slots for selected date
  const selectedDateStr = selectedDate.toDateString();
  const dateAvailability = selectedBarber?.availability.find(
    av => new Date(av.date).toDateString() === selectedDateStr
  );
  // Show all slots (both available and booked) so user can see what's taken
  const allSlots = dateAvailability?.slots || [];
  const availableSlots = allSlots.filter(s => !s.isBooked);
  
  // Generate calendar days (30 days from today)
  const calendarDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const serviceFee = 5;
  const servicesTotal = services.reduce((sum, s) => sum + s.price, 0);
  const total = servicesTotal + serviceFee;

  const handleConfirmBooking = async () => {
    if (!selectedBarberId) {
      Alert.alert("Select Barber", "Please select a barber");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Select Time", "Please select a time slot");
      return;
    }

    console.log("Current user:", user);
    
    if (!user) {
      Alert.alert(
        "Authentication Required", 
        "Please login first to book an appointment",
        [
          {
            text: "Go to Login",
            onPress: () => router.push("/login")
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      return;
    }

    setIsBooking(true);

    try {
      // Handle both _id and id for backward compatibility with old sessions
      const userId = user._id || (user as any).id;
      
      const bookingData = {
        user_id: userId,
        shop_id: shopId,
        barber_id: selectedBarberId,
        services: services.map(s => s._id),
        date: selectedDate.toISOString(),
        slot_time: selectedTime,
        payment: {
          method: "cash",
          amount: total,
          status: "pending"
        }
      };

      console.log("Creating booking:", bookingData);

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh barber data to show updated slot availability
        await refreshBarberData();
        // Clear selected time so booked slot won't be selected
        setSelectedTime(null);
        
        Alert.alert(
          "Booking Confirmed! 🎉",
          `Shop: ${shopName}\nBarber: ${selectedBarber?.user_id.FirstName} ${selectedBarber?.user_id.LastName}\nServices: ${services.map(s => s.name).join(", ")}\nDate: ${format(selectedDate, "MMM d, yyyy")}\nTime: ${selectedTime}\nTotal: $${total}\n\nYour booking has been confirmed!`,
          [
            {
              text: "OK",
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert("Booking Failed", data.message || "Unable to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white dark:bg-stone-800">
        <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#ecb613" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-stone-900 dark:text-stone-100 -ml-10">
          Book Appointment
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 gap-4">
          
          {/* Selected Services */}
          <View>
            <Text className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">Selected Services</Text>
            <View className="bg-white dark:bg-stone-800 rounded-xl p-4 gap-2">
              {services.map((service) => (
                <View key={service._id} className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-semibold text-stone-900 dark:text-stone-100">{service.name}</Text>
                    <Text className="text-xs text-stone-500 dark:text-stone-400">{service.duration} mins</Text>
                  </View>
                  <Text className="font-bold text-primary">${service.price}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Select Barber */}
          <View>
            <Text className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">Select Barber</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-3"
            >
              {barbers.map((barber) => {
                const active = barber._id === selectedBarberId;
                return (
                  <TouchableOpacity
                    key={barber._id}
                    onPress={() => {
                      setSelectedBarberId(barber._id);
                      setSelectedTime(null); // Reset time when barber changes
                    }}
                    className={`items-center w-24 mr-2 p-3 rounded-xl ${
                      active ? "bg-primary/20 border-2 border-primary" : "bg-white dark:bg-stone-800"
                    }`}
                  >
                    <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-2">
                      {barber.user_id.profileImage ? (
                        <ImageBackground
                          source={{ uri: barber.user_id.profileImage }}
                          className="w-16 h-16 rounded-full"
                          imageStyle={{ borderRadius: 32 }}
                        />
                      ) : (
                        <MaterialIcons name="person" size={32} color="#ecb613" />
                      )}
                    </View>
                    <Text className={`text-sm text-center ${active ? "font-bold text-stone-900 dark:text-stone-100" : "text-stone-700 dark:text-stone-300"}`}>
                      {barber.user_id.FirstName}
                    </Text>
                    <Text className="text-xs text-stone-500 dark:text-stone-400 text-center">{barber.experience}y exp</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Select Date */}
          {selectedBarberId && (
            <View>
              <Text className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">Select Date</Text>
              <View className="bg-white dark:bg-stone-800 rounded-xl p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <TouchableOpacity
                    onPress={() => {
                      const prev = new Date(selectedDate);
                      prev.setDate(prev.getDate() - 7);
                      if (prev >= new Date()) {
                        setSelectedDate(prev);
                        setSelectedTime(null);
                      }
                    }}
                    className="w-8 h-8 items-center justify-center rounded-full"
                  >
                    <MaterialIcons name="chevron-left" size={24} color="#ecb613" />
                  </TouchableOpacity>

                  <Text className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {format(selectedDate, "MMMM yyyy")}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      const next = new Date(selectedDate);
                      next.setDate(next.getDate() + 7);
                      const maxDate = new Date();
                      maxDate.setDate(maxDate.getDate() + 30);
                      if (next <= maxDate) {
                        setSelectedDate(next);
                        setSelectedTime(null);
                      }
                    }}
                    className="w-8 h-8 items-center justify-center rounded-full"
                  >
                    <MaterialIcons name="chevron-right" size={24} color="#ecb613" />
                  </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
                  {calendarDays.map((day) => {
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    return (
                      <TouchableOpacity
                        key={day.toISOString()}
                        onPress={() => {
                          setSelectedDate(day);
                          setSelectedTime(null);
                        }}
                        className={`w-14 h-14 mr-3 rounded-full items-center justify-center ${
                          isSelected ? "bg-primary" : "bg-stone-100 dark:bg-stone-700"
                        }`}
                      >
                        <Text className={`text-sm ${isSelected ? "font-bold text-stone-900" : "text-stone-900 dark:text-stone-100"}`}>
                          {format(day, "d")}
                        </Text>
                        <Text className={`text-xs ${isSelected ? "text-stone-900" : "text-stone-500 dark:text-stone-400"}`}>
                          {format(day, "EEE")}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          )}

          {/* Select Time Slot */}
          {selectedBarberId && selectedDate && (
            <View>
              <Text className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">
                Select Time Slot - {format(selectedDate, "MMM d, yyyy")}
              </Text>
              <View className="bg-white dark:bg-stone-800 rounded-xl p-4">
                {allSlots.length > 0 ? (
                  <View className="flex-row flex-wrap gap-2">
                    {allSlots.map((slot, idx) => {
                      const active = slot.time === selectedTime;
                      const isBooked = slot.isBooked;
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => !isBooked && setSelectedTime(slot.time)}
                          disabled={isBooked}
                          className={`px-4 py-3 rounded-lg border-2 ${
                            isBooked
                              ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 opacity-50"
                              : active 
                              ? "bg-primary border-primary" 
                              : "bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-600"
                          }`}
                        >
                          <Text className={`text-sm font-semibold ${
                            isBooked 
                              ? "text-red-600 dark:text-red-400 line-through" 
                              : active 
                              ? "text-stone-900" 
                              : "text-stone-700 dark:text-stone-300"
                          }`}>
                            {slot.time}
                          </Text>
                          {isBooked && (
                            <Text className="text-xs text-red-600 dark:text-red-400 mt-1">Booked</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <Text className="text-stone-500 dark:text-stone-400 text-center py-4">No slots available for this date</Text>
                )}
                {availableSlots.length === 0 && allSlots.length > 0 && (
                  <Text className="text-red-600 dark:text-red-400 text-center py-2 text-sm">All slots are booked for this date</Text>
                )}
              </View>
            </View>
          )}

          {/* Payment Summary */}
          <View>
            <Text className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">Payment Summary</Text>
            <View className="bg-white dark:bg-stone-800 rounded-xl p-4 gap-2">
              {services.map((service) => (
                <View key={service._id} className="flex-row justify-between">
                  <Text className="text-stone-600 dark:text-stone-400">{service.name}</Text>
                  <Text className="font-medium text-stone-900 dark:text-stone-100">${service.price}</Text>
                </View>
              ))}
              <View className="flex-row justify-between">
                <Text className="text-stone-600 dark:text-stone-400">Service Fee</Text>
                <Text className="font-medium text-stone-900 dark:text-stone-100">${serviceFee}</Text>
              </View>
              <View className="border-t border-stone-200 dark:border-stone-700 my-2" />
              <View className="flex-row justify-between">
                <Text className="font-bold text-stone-900 dark:text-stone-100">Total</Text>
                <Text className="font-bold text-primary text-lg">${total}</Text>
              </View>
            </View>
          </View>

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Footer / Confirm */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700">
        <View className="p-4">
          <TouchableOpacity
            onPress={handleConfirmBooking}
            className="w-full h-14 px-5 rounded-xl bg-primary items-center justify-center shadow-lg"
            disabled={!selectedBarberId || !selectedTime || isBooking}
          >
            <View className="flex-row items-center">
              {isBooking ? (
                <>
                  <MaterialIcons name="hourglass-empty" size={20} color="#221d10" />
                  <Text className="font-bold text-stone-900 text-base ml-2">Processing...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="check-circle" size={20} color="#221d10" />
                  <Text className="font-bold text-stone-900 text-base ml-2">Confirm Booking - ${total}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}