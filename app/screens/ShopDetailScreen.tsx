import React from "react";
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BarberDetailScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="flex-row items-center p-4">
        <TouchableOpacity>
          <Text className="text-white dark:text-white">{"< Back"}</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-white dark:text-white pr-6">
          Barber Shop
        </Text>
      </View>

      <ScrollView className="p-4 space-y-6">
        {/* Rating Section */}
        <View className="flex-row flex-wrap gap-4">
          <View className="flex flex-col gap-1">
            <Text className="text-4xl font-black text-white dark:text-white">4.8</Text>
            <View className="flex-row">
              {/* Stars */}
              {[...Array(4)].map((_, i) => (
                <Text key={i} className="text-primary">★</Text>
              ))}
              <Text className="text-primary/50">★</Text>
            </View>
            <Text className="text-base text-white/70 dark:text-white/70">125 reviews</Text>
          </View>
          <View className="flex-1 justify-center">
            {/* Rating bars */}
            {[5, 4, 3, 2, 1].map((rating, i) => (
              <View key={i} className="flex-row items-center gap-2 mb-1">
                <Text className="text-sm text-white dark:text-white">{rating}</Text>
                <View className="flex-1 h-2 bg-primary/20 rounded-full">
                  <View
                    className="h-2 rounded-full bg-primary"
                    style={{ width: rating === 5 ? "75%" : rating === 4 ? "15%" : rating === 3 ? "5%" : rating === 2 ? "3%" : "2%" }}
                  />
                </View>
                <Text className="text-sm text-white/70 dark:text-white/70">{rating === 5 ? "75%" : rating === 4 ? "15%" : rating === 3 ? "5%" : rating === 2 ? "3%" : "2%"}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text className="text-sm text-white/70 dark:text-white/70">1.2 miles away</Text>

        {/* Images Grid */}
        <View className="grid grid-cols-2 grid-rows-2 gap-2 aspect-[4/3] rounded-xl overflow-hidden">
          <ImageBackground
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYcKdMf5b5G5Zg7lOynK91o9E7rGNHkEVl4tu72OL6K5lC6Ph3xrXYLVpDsIZLZGl5rk-pukgZbP3ffi69RagN8gVkys591TAfyDkbaJynjpd1EqkVFNNWwKp_ioMoybbsOUJMPtAJipUmXEBCkUr_5UlDg4KelAq8nbY3ntLESslIKDHs5-M4yGfqfeVBsWV7FdO9F60AJVCJCKM51bO63Al_zSIUxe7Cldlnax8ZIAPp-tCOhMOZd8HWVPggniojfHSpibuHoUuP" }}
            className="row-span-2"
          />
          <ImageBackground
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPniAlJaa6yt786EQc1N50oOe3aZ5aE2cyCnMZpKSrUFQaToUvUu8KzBzUaeDgEJnjobdEiD5Wv3TOq29TFB7vsFYCZbqw1fkNfVexC4CKyzJa4HySoTsc_X7wVYqixeyAL74ga-uLd8S-jw_t3VHM6FgLbSodX3O5r1OJsM2bFkGOoBVMSAnR62xCfTmkh0aWpyMihGkeVY3yuXb4JrcgQ8a5OfDYaiKS4VjgLXVdNrJOlBvGVl_5vr9oa8zqq1AeulnyDQc_TWxA" }}
          />
          <ImageBackground
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHhMG6ylv2bfjYGJqMMnFf21Gg2aWer6QwP0ToFO_bkTLCaYl_o22iNXlu0DTye2XPQA_IBRY0rcKfI-B4QaVDly_1lJFxqFsAVNduNtCIU5jfWNuVuGS70DtspH1Mk4A-XfEBr6V6CvoTSugUEJS1JpEpuQhLYpjV0a13kflsbYTeURNPlWfT-Y7SRLV6tQXqyVbpsOiPCQpD6gipaf4wXKJllYHMXjLnwxnCp6XCceRiX3jpVrLsxMxjqXH1ab54k5xDLghUM6qF" }}
          />
        </View>

        {/* Barbers List */}
        <View>
          <Text className="text-xl font-bold text-white dark:text-white mb-4">Barbers</Text>
          {[
            { name: "Ethan", specialty: "Fades", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeJpsecAt3FZClwgQkPqrUmiO-Lwqu6tH9yDgCyJRg4f3hQAuDqHBRRnkYUTouVMFvlZXChg3vTRaou3tfX0nf86Xqe1hwdDoaYCoLnp8jNKNfevq-5XXqCOZWC8MxnPT0IAqe7_cEAS6w7E8JZ3vlWbNM-6OfmvdlJxNuw3P_QmlZwyGrPOMrMXbQ42jiXVOPNg_B7SUyADCARgWRX-1vSXl63lEqo18xZQxAtiywIwjZQR9OqoogjfyU0wEIlTIQIDSWyio0cCZL" },
            { name: "Noah", specialty: "Long Hair", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFaqZmArytoSkNRiTBPbQVMYIp0RpWdL4qAAHlu0IlqO4n2VlFKla0kkVSFkimV8gnkpMZjRb2HxjyL1QU8xu9_9oTmwXT3i1YsshrE3ck-TGDfP3WvOxDl3Lsz0tVj880V97-OGSDuajY6SlYTUAZwONArQ56hmQvQHDJaOI58clgoKG8GflR6o0-yemC3WPQpS7W1ZHXS-HiAVFZyUml0uU8ptOcfTmB28e_xf2SmbEdnZz_bQEV3kL06tvrXUxKMrn0rBnTiO1y" },
          ].map((barber, idx) => (
            <View key={idx} className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-4">
                <ImageBackground
                  source={{ uri: barber.image }}
                  className="h-14 w-14 rounded-full"
                />
                <View>
                  <Text className="font-medium text-white">{barber.name}</Text>
                  <Text className="text-sm text-white/70">Specialty: {barber.specialty}</Text>
                </View>
              </View>
              <TouchableOpacity className="h-10 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 justify-center">
                <Text className="text-sm font-medium text-primary">View</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Available Slots */}
        <View>
          <Text className="text-xl font-bold text-white dark:text-white mb-4">Available Slots</Text>
          <View className="flex-row flex-wrap gap-3">
            {["10:00 AM", "11:00 AM", "12:00 PM"].map((time, idx) => (
              <TouchableOpacity key={idx} className="h-10 px-4 rounded-lg bg-primary/20 dark:bg-primary/30 justify-center">
                <Text className="text-sm font-medium text-primary">{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="p-4 bg-background-light/80 dark:bg-background-dark/80">
        <TouchableOpacity className="w-full h-12 px-5 rounded-lg bg-primary justify-center items-center">
          <Text className="font-bold text-background-dark text-base">Book</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BarberDetailScreen;
