import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
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
}

interface Shop {
  _id: string;
  shopName: string;
  location: {
    address: string;
    city: string;
    lat: number;
    long: number;
  };
}

interface Booking {
  _id: string;
  user_id: string;
  shop_id: Shop;
  barber_id: Barber;
  services: Service[];
  date: string;
  slot_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  payment: {
    method: string;
    amount: number;
    status: string;
  };
  createdAt: string;
}

const API_URL = "http://10.107.204.168:5000/api";

export default function MyBookingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userId = user._id || (user as any).id;
      const response = await fetch(`${API_URL}/bookings/user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data);
      } else {
        Alert.alert("Error", "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Alert.alert("Error", "Failed to fetch bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancelBooking = async (bookingId: string) => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                }
              });

              const data = await response.json();

              if (data.success) {
                Alert.alert("Success", "Booking cancelled successfully");
                fetchBookings(); // Refresh list
              } else {
                Alert.alert("Error", data.message || "Failed to cancel booking");
              }
            } catch (error) {
              console.error("Error cancelling booking:", error);
              Alert.alert("Error", "Failed to cancel booking");
            }
          }
        }
      ]
    );
  };

  // Separate bookings into upcoming and past
  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    return bookingDate >= now && b.status !== "cancelled" && b.status !== "completed";
  });
  
  const pastBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    return bookingDate < now || b.status === "cancelled" || b.status === "completed";
  });

  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 dark:bg-stone-900">
        <View className="flex-row items-center p-4 bg-white dark:bg-stone-800">
          <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#ecb613" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-stone-900 dark:text-stone-100 -ml-10">
            My Bookings
          </Text>
        </View>
        <View className="flex-1 items-center justify-center p-6">
          <MaterialIcons name="event-busy" size={64} color="#9ca3af" />
          <Text className="text-stone-900 dark:text-stone-100 text-lg font-semibold mt-4">Please Login</Text>
          <Text className="text-stone-500 dark:text-stone-400 text-center mt-2">You need to login to view your bookings</Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="mt-6 bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-stone-900 font-semibold">Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50 dark:bg-stone-900">
        <View className="flex-row items-center p-4 bg-white dark:bg-stone-800">
          <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#ecb613" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-stone-900 dark:text-stone-100 -ml-10">
            My Bookings
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ecb613" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white dark:bg-stone-800">
        <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#ecb613" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-stone-900 dark:text-stone-100 -ml-10">
          My Bookings
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white dark:bg-stone-800 px-4 py-2">
        <TouchableOpacity
          onPress={() => setActiveTab("upcoming")}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === "upcoming" ? "bg-primary" : "bg-stone-100 dark:bg-stone-700"
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === "upcoming" ? "text-stone-900" : "text-stone-600 dark:text-stone-300"
          }`}>
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <View className="w-2" />
        <TouchableOpacity
          onPress={() => setActiveTab("past")}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === "past" ? "bg-primary" : "bg-stone-100 dark:bg-stone-700"
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === "past" ? "text-stone-900" : "text-stone-600 dark:text-stone-300"
          }`}>
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ecb613"]} />
        }
      >
        {displayedBookings.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialIcons 
              name={activeTab === "upcoming" ? "event-available" : "history"} 
              size={64} 
              color="#9ca3af" 
            />
            <Text className="text-stone-900 dark:text-stone-100 text-lg font-semibold mt-4">
              No {activeTab} bookings
            </Text>
            <Text className="text-stone-500 dark:text-stone-400 text-center mt-2">
              {activeTab === "upcoming" 
                ? "You don't have any upcoming bookings" 
                : "You don't have any past bookings"}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {displayedBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isUpcoming={activeTab === "upcoming"}
                onCancel={handleCancelBooking}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Booking Card Component
function BookingCard({ 
  booking, 
  isUpcoming,
  onCancel 
}: { 
  booking: Booking; 
  isUpcoming: boolean;
  onCancel: (id: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "check-circle";
      case "pending":
        return "schedule";
      case "completed":
        return "done-all";
      case "cancelled":
        return "cancel";
      default:
        return "info";
    }
  };

  return (
    <View className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-sm">
      {/* Status Badge */}
      <View className="flex-row items-center justify-between mb-3">
        <View className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
          <MaterialIcons name={getStatusIcon(booking.status) as any} size={16} />
          <Text className={`ml-1 text-xs font-semibold uppercase ${getStatusColor(booking.status)}`}>
            {booking.status}
          </Text>
        </View>
        <Text className="text-xs text-stone-500 dark:text-stone-400">
          #{booking._id.slice(-6)}
        </Text>
      </View>

      {/* Shop Name */}
      <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
        {booking.shop_id.shopName}
      </Text>
      <Text className="text-sm text-stone-500 dark:text-stone-400 mb-3">
        <MaterialIcons name="location-on" size={14} /> {booking.shop_id.location.address}, {booking.shop_id.location.city}
      </Text>

      {/* Date and Time */}
      <View className="flex-row items-center mb-3">
        <View className="flex-1 flex-row items-center">
          <MaterialIcons name="calendar-today" size={16} color="#ecb613" />
          <Text className="ml-2 text-stone-700 dark:text-stone-300">
            {format(new Date(booking.date), "MMM d, yyyy")}
          </Text>
        </View>
        <View className="flex-1 flex-row items-center">
          <MaterialIcons name="access-time" size={16} color="#ecb613" />
          <Text className="ml-2 text-stone-700 dark:text-stone-300">
            {booking.slot_time}
          </Text>
        </View>
      </View>

      {/* Barber */}
      <View className="flex-row items-center mb-3">
        <MaterialIcons name="person" size={16} color="#ecb613" />
        <Text className="ml-2 text-stone-700 dark:text-stone-300">
          {booking.barber_id.user_id.FirstName} {booking.barber_id.user_id.LastName}
        </Text>
        <Text className="ml-2 text-xs text-stone-500 dark:text-stone-400">
          ({booking.barber_id.experience}y exp)
        </Text>
      </View>

      {/* Services */}
      <View className="mb-3">
        <Text className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">Services:</Text>
        {booking.services.map((service, idx) => (
          <View key={service._id} className="flex-row items-center justify-between py-1">
            <Text className="text-sm text-stone-600 dark:text-stone-400">• {service.name}</Text>
            <Text className="text-sm text-stone-600 dark:text-stone-400">${service.price}</Text>
          </View>
        ))}
      </View>

      {/* Payment */}
      <View className="border-t border-stone-200 dark:border-stone-700 pt-3 mb-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-stone-700 dark:text-stone-300">Total Amount:</Text>
          <Text className="text-lg font-bold text-primary">${booking.payment.amount}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-stone-500 dark:text-stone-400">Payment Method:</Text>
          <Text className="text-xs text-stone-600 dark:text-stone-400 uppercase">{booking.payment.method}</Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-stone-500 dark:text-stone-400">Payment Status:</Text>
          <Text className={`text-xs font-semibold uppercase ${
            booking.payment.status === "paid" 
              ? "text-green-600 dark:text-green-400" 
              : "text-yellow-600 dark:text-yellow-400"
          }`}>
            {booking.payment.status}
          </Text>
        </View>
      </View>

      {/* Actions */}
      {isUpcoming && booking.status !== "cancelled" && (
        <TouchableOpacity
          onPress={() => onCancel(booking._id)}
          className="bg-red-500 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}