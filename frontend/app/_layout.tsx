import { Stack } from 'expo-router';
import { useFonts, Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useState, useEffect } from 'react';
import Splash from './screens/Splash';
import "../global.css";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen for 5 seconds
  if (showSplash) {
    return <Splash />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="test" options={{ title: 'Test Styles' }} />
      <Stack.Screen name="Home" options={{ title: 'Home Page' }} />
      <Stack.Screen name="shopDetail" options={{ title: 'Shop Detail Page' }} />
      <Stack.Screen name="booking" options={{ title: 'Booking Page' }} />
      <Stack.Screen name="My Booking Screen" options={{ title: 'My Booking Page' }} />
      <Stack.Screen name="My Profile Screen" options={{ title: 'My Profile Page' }} />
      <Stack.Screen name="Notification" options={{ title: 'Notification' }} />
      <Stack.Screen name="Payment History" options={{ title: 'Payment History' }} />
      <Stack.Screen name="Chat Screen" options={{ title: 'Chat Screen' }} />
    </Stack>
  );
}
