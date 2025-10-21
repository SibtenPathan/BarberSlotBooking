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
      <Stack.Screen name="screens/Home" options={{ title: 'Home Page' }} />
    </Stack>
  );
}
