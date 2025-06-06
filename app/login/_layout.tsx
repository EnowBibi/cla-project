import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" 
           options={{ title: 'Forgot Password' }} 
        />
        <Stack.Screen name="CodeVerification" 
           options={{ title: 'Forgot Password' }} 
        />
        <Stack.Screen name="ResetPassword" 
           options={{ title: 'Forgot Password' }} 
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
