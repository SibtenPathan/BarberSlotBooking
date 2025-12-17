import React from "react";
import { View, Text, SafeAreaView, ScrollView, ImageBackground, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const barbers = [
  {
    name: "The Sharp Edge",
    rating: 4.8,
    reviews: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3D8F9l8FvDoV4B_05vH1bzsYgzHf8NphOgN_WQJSgNKJhTXlKSb_4yZlC-f9-Hu_TbeZMVtzFnHTEB9eUbhy_FZbXILi-mbTAbBOuyfTiYFxl3_YxWk33HiNtXDM5CFz9xdLZceohQ4bOEa4kHfClRCQPneiSqOYTIlQHgMb5U7ndDciNMPavL6c6m9ywauKylCt05V6ngZIZR-r7braB1NoDrdlJ2_YSTjYLTTc7sTn5c8JGFN4RgfqgCqhVVtczuktSETnojkGE",
  },
  {
    name: "Fade Masters",
    rating: 4.9,
    reviews: 150,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBljOrH48zi8M1M8OqgLRXz0wbTu3nZVICxgKBYwuKlCR-nURKcEajs1zHVHThyNoS0QTXTLLZiZkzq_gR5Y06cT9zKDpryrl26YoTczQRT1i3o-II9Nm0wxslTINEwUMV_P-P7rxrrpU93YvEBnOaGiRsVFDK-G_PRVgA8TxwEbJDFsryJwRWGU-p1uICtgipFvfJtXz5IXwKp0mpEmsyrpXQYJRFeGv8aE7D8BLZsirEVw7MjStYz3a_mwULzIPbxdYhSmckw2WGO",
  },
  {
    name: "Clipper Kings",
    rating: 4.7,
    reviews: 90,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApeAMv0-4J1IxkppSN30YATT-by1cRFBX2Wuj78blPuLONgmHZM5Lppt1T0ruT0Z7BQVXra8MkHTeeGWPPsJhYgdwsfK_73ayOYqMO74hD33eIooZkx8P8E3jNz9Amx4AEjD_REivEAvyVhU4L9-w_tpu5kVPKsL_gSe_i0OFEe8YN6vEJUL-L0r-p8pHGWz1NDfXCj1hVE7z5PkzwesnZHxSDNFmGZTFCw_EZ_265jBKCceNpDlPcpKgjck09_vku5qjV_s_4BJEl",
  },
];

const categories = ["Men's Cut", "Beard Trim", "Hair Styling"];

const Home: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-background-light/80 dark:bg-background-dark/80">
        <View className="w-8" />
        <Text className="flex-1 text-center text-lg font-bold text-stone-900 dark:text-stone-100">
          Home
        </Text>
        <TouchableOpacity className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <MaterialIcons
            name="help-outline"
            size={20}
            color="#221d10"
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="px-4 py-3">
        <View className="relative">
          <MaterialIcons
            name="search"
            size={20}
            color="#6b7280"
            className="absolute left-3 top-3"
          />
          <TextInput
            placeholder="Search services or barbershops"
            className="w-full rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 py-3 pl-10 pr-4 border border-stone-300 dark:border-stone-700"
          />
        </View>
      </View>

      <ScrollView className="flex-1 space-y-4">
        {/* Nearby Barbers */}
        <View className="space-y-2 px-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Nearby You
            </Text>
            <Text className="text-sm font-semibold text-primary">See All</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-4 py-2"
          >
            {barbers.map((barber, idx) => (
              <View key={idx} className="w-64 space-y-2">
                <ImageBackground
                  source={{ uri: barber.image }}
                  className="aspect-square w-full rounded-xl"
                  imageStyle={{ borderRadius: 12 }}
                />
                <Text className="font-bold text-stone-900 dark:text-stone-100">
                  {barber.name}
                </Text>
                <Text className="text-sm text-stone-600 dark:text-stone-400">
                  <Text className="text-primary">★</Text> {barber.rating} ({barber.reviews} reviews)
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View className="space-y-2 px-4">
          <Text className="text-xl font-bold text-stone-900 dark:text-stone-100">Categories</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                className={`px-4 py-2 rounded-full ${
                  idx === 0
                    ? "bg-primary/20 dark:bg-primary/30 text-primary"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                }`}
              >
                <Text className="font-semibold text-sm">{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Map / Find Us */}
        <View className="space-y-2 px-4 pb-24">
          <Text className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Find Us
          </Text>
          <ImageBackground
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXsTCPAKCqWDBp9nvxmgKOUVZv5gD56j-JbUvu3jfkbgvyef1uTIDAPKRY2NfEXAifwLNJjyx2KgiA_wlop5Rv0diUNeLBHz-nkVTCIoUx8bLz_-uhG8dFwp0yD6wDArvodIEZu_2p3sqT3ZjOs3_xseLsyZSFtDt7Y2FAMJ269qebaxnC1MQag8f5BYM3fo7AUCzQsxxKGUr3ddc1HPwjAHnPlF0zXzCqnIZNAc4UHojDCBs3vvagTPjt9Lrkk-ttmqsQvDGSTmyq" }}
            className="w-full aspect-video rounded-xl"
            imageStyle={{ borderRadius: 12 }}
          />
        </View>
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