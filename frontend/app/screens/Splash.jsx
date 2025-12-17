// app/screens/Splash.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function Splash() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Center Content */}
      <View style={styles.center}>
        <Text style={styles.title}>Book My Barber</Text>
        <Text style={styles.subtitle}>Skip the Queue, Style on Time.</Text>
      </View>

      {/* Bottom Dots */}
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotInactive]} />
        <View style={[styles.dot, styles.dotInactive]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f6", // light mode background
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  center: {
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#221d10", // dark text color
    fontFamily: "Manrope", // load this font in your app (expo-font)
  },
  subtitle: {
    marginTop: 8,
    fontSize: 18,
    color: "rgba(34, 29, 16, 0.7)", // 70% opacity dark text
    textAlign: "center",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#ecb613",
  },
  dotInactive: {
    backgroundColor: "rgba(236, 182, 19, 0.3)",
  },
});
