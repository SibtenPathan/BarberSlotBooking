import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import {
  calculateTotalDuration,
  getAvailableStartSlots,
  getSlotDisplayInfo
} from "../utils/slotHelper";

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

const API_URL = "http://10.153.87.168:5000/api";
const { width } = Dimensions.get("window");
// Calculate width for 3 columns: screen width - padding (64px) - gaps (24px for 2 gaps)
const SLOT_CARD_WIDTH = (width - 88) / 3;

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
  
  // Calculate total duration of all selected services
  const totalDuration = calculateTotalDuration(services);
  
  // Find slots for selected date
  const selectedDateStr = selectedDate.toDateString();
  const dateAvailability = selectedBarber?.availability.find(
    av => new Date(av.date).toDateString() === selectedDateStr
  );
  
  // Get all slots for the day
  const allSlots = dateAvailability?.slots || [];
  
  // Get slots that can accommodate the full service duration
  const availableStartSlots = getAvailableStartSlots(allSlots, totalDuration);
  
  // For display purposes, show all slots with their status
  const displaySlots = allSlots;
  
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

  // Slot Status Legend Component
  const SlotLegend = () => (
    <View className="mb-4">
      <View className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded-r-lg mb-3">
        <View className="flex-row items-center mb-1">
          <MaterialIcons name="info" size={18} color="#3b82f6" />
          <Text className="ml-2 text-blue-800 dark:text-blue-300 font-medium">
            Service Duration: {totalDuration} minutes
          </Text>
        </View>
        <Text className="text-blue-600 dark:text-blue-400 text-xs">
          Only showing slots with {Math.ceil(totalDuration / 15)} consecutive 15-min blocks available
        </Text>
      </View>
      
      <Text className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
        Slot Status Legend
      </Text>
      <View className="flex-row flex-wrap gap-2">
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
          <Text className="text-xs text-stone-600 dark:text-stone-400">Can start here</Text>
        </View>
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full bg-primary mr-2" />
          <Text className="text-xs text-stone-600 dark:text-stone-400">Selected</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-stone-400 mr-2" />
          <Text className="text-xs text-stone-600 dark:text-stone-400">Insufficient time</Text>
        </View>
      </View>
    </View>
  );

  // Slot Counter Component
  const SlotCounter = () => (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-base font-bold text-stone-900 dark:text-stone-100">
        Select Time Slot - {format(selectedDate, "MMM d, yyyy")}
      </Text>
      <View className="flex-row items-center bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
        <Text className="text-sm font-medium text-stone-700 dark:text-stone-300">
          <Text className="text-green-600 dark:text-green-400">{availableStartSlots.length}</Text>
          <Text className="text-stone-500"> / </Text>
          <Text className="text-stone-700 dark:text-stone-300">{displaySlots.length}</Text>
          <Text className="text-stone-500"> slots</Text>
        </Text>
      </View>
    </View>
  );

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
            <View className="bg-white dark:bg-stone-800 rounded-xl p-4 gap-2 shadow-sm">
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
                    className={`items-center w-24 mr-2 p-3 rounded-xl shadow-sm ${
                      active ? "bg-primary/20 border-2 border-primary" : "bg-white dark:bg-stone-800"
                    }`}
                  >
                    <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center mb-2 shadow">
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
              <View className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-sm">
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
                    className="w-8 h-8 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-700"
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
                    className="w-8 h-8 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-700"
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
                        className={`w-14 h-14 mr-3 rounded-full items-center justify-center shadow ${
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
              <SlotCounter />
              <SlotLegend />
              
              <View className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-sm">
                {displaySlots.length > 0 ? (
                  <>
                    {availableStartSlots.length === 0 && displaySlots.length > 0 && (
                      <View className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-3 rounded-r-lg">
                        <View className="flex-row items-center">
                          <MaterialIcons name="warning" size={20} color="#f59e0b" />
                          <Text className="ml-2 text-amber-800 dark:text-amber-300 font-medium">
                            No slots available for {totalDuration} minute service
                          </Text>
                        </View>
                        <Text className="text-amber-600 dark:text-amber-400 text-sm mt-1">
                          Please select another date or choose a different barber
                        </Text>
                      </View>
                    )}
                    
                    <View className="flex-row flex-wrap gap-3">
                      {displaySlots.map((slot, idx) => {
                        const isSelected = slot.time === selectedTime;
                        const canStartHere = availableStartSlots.some(s => s.time === slot.time);
                        const slotInfo = getSlotDisplayInfo(slot, selectedTime, totalDuration);
                        
                        return (
                          <TouchableOpacity
                            key={idx}
                            onPress={() => canStartHere && setSelectedTime(slot.time)}
                            disabled={!canStartHere}
                            style={{ width: SLOT_CARD_WIDTH }}
                            className={`p-3 rounded-xl border-2 shadow-sm ${
                              isSelected
                                ? "bg-primary border-primary shadow-md" 
                                : canStartHere
                                ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                                : "bg-stone-100 dark:bg-stone-700/50 border-stone-300 dark:border-stone-600 opacity-50"
                            }`}
                          >
                            <View className="items-center">
                              {/* Icon based on status */}
                              <MaterialIcons 
                                name={
                                  isSelected ? "check-circle" :
                                  canStartHere ? "access-time" : 
                                  "block"
                                } 
                                size={20} 
                                color={
                                  isSelected ? "#221d10" :
                                  canStartHere ? "#16a34a" : 
                                  "#9ca3af"
                                }
                              />
                              
                              {/* Time */}
                              <Text className={`text-sm font-bold mt-1 ${
                                isSelected 
                                  ? "text-stone-900" 
                                  : canStartHere
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-stone-400 dark:text-stone-500"
                              }`}>
                                {slotInfo.displayTime}
                              </Text>
                              
                              {/* Status Badge */}
                              <View className={`mt-1 px-2 py-0.5 rounded-full ${
                                isSelected 
                                  ? "bg-primary/20" 
                                  : canStartHere
                                  ? "bg-green-100 dark:bg-green-900/40"
                                  : "bg-stone-200 dark:bg-stone-700"
                              }`}>
                                <Text className={`text-xs font-medium ${
                                  isSelected 
                                    ? "text-stone-900" 
                                    : canStartHere
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-stone-500 dark:text-stone-400"
                                }`}>
                                  {isSelected ? "SELECTED" : canStartHere ? "START" : "FULL"}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : (
                  <View className="py-8 items-center">
                    <MaterialIcons name="schedule" size={48} color="#9ca3af" />
                    <Text className="text-lg font-medium text-stone-500 dark:text-stone-400 mt-3">
                      No Slots Available
                    </Text>
                    <Text className="text-stone-400 dark:text-stone-500 text-center mt-2">
                      This barber has no working hours scheduled for this date.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Payment Summary */}
          <View>
            <Text className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">Payment Summary</Text>
            <View className="bg-white dark:bg-stone-800 rounded-xl p-4 gap-2 shadow-sm">
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
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 shadow-lg">
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