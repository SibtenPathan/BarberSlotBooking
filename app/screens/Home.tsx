import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const categories = ["Men's Cut", "Beard Trim", "Hair Styling"];

const API_URL = "http://10.20.56.168:5000/api";

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
}

const Home: React.FC = () => {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchShops = async () => {
    try {
      console.log("Fetching shops from:", `${API_URL}/shops`);
      const response = await fetch(`${API_URL}/shops`);
      const data = await response.json();
      
      console.log("Response data:", data);
      
      if (data.success) {
        setShops(data.data);
        setFilteredShops(data.data);
        console.log("Shops loaded:", data.data.length);
      } else {
        console.log("API returned success: false");
        Alert.alert("Error", "Failed to fetch shops");
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      Alert.alert("Network Error", "Could not connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    let filtered = shops;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(shop =>
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category (placeholder for future implementation)
    // if (selectedCategory !== "All") {
    //   filtered = filtered.filter(shop => shop.category === selectedCategory);
    // }

    setFilteredShops(filtered);
  }, [searchQuery, selectedCategory, shops]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShops();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Search */}
      <View className="px-4 pt-4 pb-3">
        <View className="relative">
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <MaterialIcons
              name="search"
              size={20}
              color="#9ca3af"
            />
          </View>
          <TextInput
            placeholder="Search barbershops by name or city"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 py-3 pl-10 pr-4 border border-stone-300 dark:border-stone-700"
          />
        </View>
      </View>

      {/* Category Filters */}
      <View className="px-4 pb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {["All", ...categories].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat
                    ? "bg-primary"
                    : "bg-stone-100 dark:bg-stone-800"
                }`}
              >
                <Text className={`font-semibold text-sm ${
                  selectedCategory === cat
                    ? "text-stone-900"
                    : "text-stone-700 dark:text-stone-300"
                }`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 space-y-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Nearby Barbers */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {searchQuery ? `Search Results (${filteredShops.length})` : "Nearby You"}
            </Text>
            {!searchQuery && <Text className="text-sm font-semibold text-primary">See All</Text>}
          </View>
          
          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#ecb613" />
            </View>
          ) : filteredShops.length === 0 ? (
            <View className="py-12 items-center bg-stone-100 dark:bg-stone-800 rounded-2xl">
              <MaterialIcons name="search-off" size={48} color="#9ca3af" />
              <Text className="text-stone-600 dark:text-stone-400 mt-3 font-semibold">
                {searchQuery ? "No shops found" : "No shops available"}
              </Text>
              <Text className="text-stone-500 dark:text-stone-500 text-sm mt-1">
                {searchQuery ? "Try a different search term" : "Check back later"}
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {filteredShops.map((shop) => (
                <TouchableOpacity 
                  key={shop._id} 
                  className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden shadow-sm"
                  onPress={() => router.push(`/screens/ShopDetailScreen?shopId=${shop._id}`)}
                >
                  <ImageBackground
                    source={{ 
                      uri: shop.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"
                    }}
                    className="w-full h-48"
                  >
                    <View className="absolute top-3 right-3 bg-primary rounded-full px-3 py-1">
                      <Text className="text-xs font-bold text-stone-900">Open</Text>
                    </View>
                    <View className="absolute bottom-2 left-2 right-2 bg-black/60 rounded-lg p-2">
                      <View className="flex-row items-center">
                        <MaterialIcons name="access-time" size={14} color="#fff" />
                        <Text className="text-xs text-white font-semibold ml-1">
                          {shop.openTime} - {shop.closeTime}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                  
                  <View className="p-4">
                    <Text className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                      {shop.shopName}
                    </Text>
                    
                    <View className="flex-row items-center mb-2">
                      <MaterialIcons name="location-on" size={16} color="#ecb613" />
                      <Text className="text-xs text-stone-600 dark:text-stone-400 ml-1 flex-1">
                        {shop.location.address}, {shop.location.city}
                      </Text>
                    </View>
                    
                    {shop.description && (
                      <Text className="text-xs text-stone-500 dark:text-stone-500 mb-3" numberOfLines={2}>
                        {shop.description}
                      </Text>
                    )}
                    
                    <View className="flex-row items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-700">
                      <View className="flex-row items-center">
                        <MaterialIcons name="star" size={16} color="#ecb613" />
                        <Text className="text-sm font-bold text-stone-900 dark:text-stone-100 ml-1">4.8</Text>
                        <Text className="text-xs text-stone-500 dark:text-stone-500 ml-1">(120 reviews)</Text>
                      </View>
                      <View className="flex-row items-center">
                        <MaterialIcons name="arrow-forward" size={16} color="#ecb613" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-32 right-4 h-14 w-14 rounded-full bg-primary justify-center items-center shadow-lg">
        <MaterialIcons name="add" size={28} color="#221d10" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center border-t border-stone-200 dark:border-stone-800 bg-background-light dark:bg-background-dark py-3 px-4 absolute bottom-0 w-full">
        {["Home", "Bookings", "Profile"].map((item, idx) => (
          <TouchableOpacity key={idx} className="flex flex-col items-center">
            <MaterialIcons
              name={
                item === "Home"
                  ? "home"
                  : item === "Bookings"
                  ? "book-online"
                  : "person"
              }
              size={24}
              color={item === "Home" ? "#ecb613" : "#6b7280"}
            />
            <Text
              className={`text-xs font-bold ${
                item === "Home" ? "text-primary" : "text-stone-500 dark:text-stone-400"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Home;