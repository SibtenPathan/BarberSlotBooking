import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://10.20.56.168:5000/api";

interface Slot {
  time: string;
  isBooked: boolean;
}

interface Availability {
  date: Date;
  slots: Slot[];
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
  availability: Availability[];
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

interface Shop {
  _id: string;
  shopName: string;
  description: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  openTime: string;
  closeTime: string;
  barbers?: any[];
  owner_id?: {
    FirstName: string;
    LastName: string;
  };
  barbersDetails?: Barber[];
  services?: Service[];
}

const BarberDetailScreen = () => {
  const router = useRouter();
  const { shopId } = useLocalSearchParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

  useEffect(() => {
    fetchShopDetails();
  }, [shopId]);

  const fetchShopDetails = async () => {
    try {
      console.log("Fetching shop details for:", shopId);
      const response = await fetch(`${API_URL}/shops/${shopId}`);
      const data = await response.json();
      
      if (data.success) {
        setShop(data.data);
        console.log("Shop details loaded:", data.data);
      } else {
        Alert.alert("Error", "Failed to fetch shop details");
      }
    } catch (error) {
      console.error("Error fetching shop details:", error);
      Alert.alert("Network Error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#ecb613" />
        <Text className="text-stone-500 dark:text-stone-400 mt-3">Loading shop details...</Text>
      </SafeAreaView>
    );
  }

  if (!shop) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
        <MaterialIcons name="store" size={64} color="#9ca3af" />
        <Text className="text-stone-600 dark:text-stone-400 mt-3 text-lg font-semibold">Shop not found</Text>
        <TouchableOpacity 
          className="mt-4 px-6 py-3 bg-primary rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-stone-900 font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="flex-row items-center">
            <MaterialIcons name="arrow-back" size={24} color="#ecb613" />
            <Text className="text-primary ml-2 font-semibold">Back</Text>
          </View>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-stone-900 dark:text-stone-100 pr-16">
          {shop.shopName}
        </Text>
      </View>

      <ScrollView className="p-4">
        {/* Shop Info Card */}
        <View className="bg-white dark:bg-stone-800 rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            {shop.shopName}
          </Text>
          
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="location-on" size={20} color="#ecb613" />
            <Text className="text-sm text-stone-600 dark:text-stone-400 ml-2 flex-1">
              {shop.location.address}, {shop.location.city}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <MaterialIcons name="access-time" size={20} color="#ecb613" />
            <Text className="text-sm text-stone-600 dark:text-stone-400 ml-2">
              {shop.openTime} - {shop.closeTime}
            </Text>
          </View>

          {shop.description && (
            <View className="mt-2 pt-3 border-t border-stone-200 dark:border-stone-700">
              <Text className="text-sm text-stone-600 dark:text-stone-400 leading-5">
                {shop.description}
              </Text>
            </View>
          )}

          {/* Rating Section */}
          <View className="flex-row items-center mt-4 pt-3 border-t border-stone-200 dark:border-stone-700">
            <View className="flex-row items-center">
              <MaterialIcons name="star" size={20} color="#ecb613" />
              <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 ml-1">4.8</Text>
              <Text className="text-sm text-stone-500 dark:text-stone-500 ml-1">(125 reviews)</Text>
            </View>
          </View>
        </View>

        {/* Images Grid */}
        {shop.images && shop.images.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">Photos</Text>
            <View className="flex-row gap-2">
              {shop.images.slice(0, 3).map((image, idx) => (
                <ImageBackground
                  key={idx}
                  source={{ uri: image }}
                  className="flex-1 h-32 rounded-xl"
                  imageStyle={{ borderRadius: 12 }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Owner Info */}
        {shop.owner_id && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">Owner</Text>
            <View className="bg-white dark:bg-stone-800 rounded-xl p-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                  <MaterialIcons name="person" size={24} color="#ecb613" />
                </View>
                <View className="ml-3">
                  <Text className="font-semibold text-stone-900 dark:text-stone-100">
                    {shop.owner_id.FirstName} {shop.owner_id.LastName}
                  </Text>
                  <Text className="text-sm text-stone-500 dark:text-stone-500">Shop Owner</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Services */}
        {shop.services && shop.services.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">Services</Text>
            <View className="gap-2">
              {shop.services.map((service) => (
                <View key={service._id} className="bg-white dark:bg-stone-800 rounded-xl p-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                        {service.name}
                      </Text>
                      <Text className="text-sm text-stone-500 dark:text-stone-500 mt-1">
                        {service.description}
                      </Text>
                      <View className="flex-row items-center mt-2">
                        <MaterialIcons name="access-time" size={14} color="#9ca3af" />
                        <Text className="text-xs text-stone-500 dark:text-stone-500 ml-1">
                          {service.duration} mins
                        </Text>
                      </View>
                    </View>
                    <View className="ml-3">
                      <Text className="font-bold text-primary text-lg">${service.price}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Barbers */}
        {shop.barbersDetails && shop.barbersDetails.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">Our Barbers</Text>
            <View className="gap-3">
              {shop.barbersDetails.map((barber) => {
                const todaySlots = barber.availability[0]?.slots || [];
                const availableSlots = todaySlots.filter(slot => !slot.isBooked);
                const isExpanded = selectedBarber === barber._id;

                return (
                  <View key={barber._id} className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden">
                    {/* Barber Header */}
                    <TouchableOpacity 
                      className="p-4"
                      onPress={() => setSelectedBarber(isExpanded ? null : barber._id)}
                    >
                      <View className="flex-row items-center">
                        <View className="w-14 h-14 bg-primary/20 rounded-full items-center justify-center">
                          {barber.user_id.profileImage ? (
                            <ImageBackground
                              source={{ uri: barber.user_id.profileImage }}
                              className="w-14 h-14 rounded-full"
                              imageStyle={{ borderRadius: 28 }}
                            />
                          ) : (
                            <MaterialIcons name="person" size={28} color="#ecb613" />
                          )}
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="font-bold text-stone-900 dark:text-stone-100 text-base">
                            {barber.user_id.FirstName} {barber.user_id.LastName}
                          </Text>
                          <Text className="text-sm text-stone-500 dark:text-stone-500 mt-0.5">
                            {barber.experience} years experience
                          </Text>
                          <View className="flex-row flex-wrap gap-1 mt-1">
                            {barber.specialization.slice(0, 2).map((spec, idx) => (
                              <Text key={idx} className="text-xs text-primary">
                                {spec}{idx < Math.min(barber.specialization.length - 1, 1) ? ' • ' : ''}
                              </Text>
                            ))}
                          </View>
                        </View>
                        <View className="items-center">
                          <Text className="text-xs text-stone-500 dark:text-stone-500 mb-1">Available</Text>
                          <Text className="font-bold text-primary text-base">{availableSlots.length}</Text>
                          <MaterialIcons 
                            name={isExpanded ? "expand-less" : "expand-more"} 
                            size={24} 
                            color="#ecb613" 
                          />
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Available Slots - Expandable */}
                    {isExpanded && (
                      <View className="px-4 pb-4 border-t border-stone-200 dark:border-stone-700 pt-3">
                        <Text className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                          Available Slots Today
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                          {availableSlots.length > 0 ? (
                            availableSlots.map((slot, idx) => (
                              <TouchableOpacity 
                                key={idx} 
                                className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-700 border-2 border-transparent active:border-primary"
                              >
                                <Text className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                                  {slot.time}
                                </Text>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <Text className="text-sm text-stone-500 dark:text-stone-500 italic">
                              No available slots today
                            </Text>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-4" />
      </ScrollView>

      {/* Footer */}
      <View className="p-4 bg-background-light/80 dark:bg-background-dark/80">
      {/* Footer */}
      <View className="p-4 border-t border-stone-200 dark:border-stone-800 bg-background-light dark:bg-background-dark">
        <TouchableOpacity className="w-full h-14 px-5 rounded-xl bg-primary justify-center items-center shadow-lg">
          <View className="flex-row items-center">
            <MaterialIcons name="event" size={20} color="#221d10" />
            <Text className="font-bold text-stone-900 text-base ml-2">Book Appointment</Text>
          </View>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default BarberDetailScreen;
