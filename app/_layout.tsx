import { useFonts } from 'expo-font';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// UIKITTEN IMPORTS
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState()

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Lato-Regular": require('../assets/fonts/Lato-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // already logged go to contractor-screen >>> sure not yet so stay home
      if(currentUser) {
        router.push("/(screens)/contractor-screen") // depends on user type: Contractor(contractor-screen) | Driver(driver-screen) | Customer(customer-screen)
      } 
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
            <IconRegistry icons={EvaIconsPack}/>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(screens)/contractor-screen" options={{headerShown: true, title: "Contractor", headerBackVisible: false}}/>
        <Stack.Screen name="(screens)/driver-screen" options={{headerShown: true, title:"Driver", headerBackVisible: false}}/>
        <Stack.Screen name="(screens)/customer-screen" options={{headerShown: true, title:"Customer", headerBackVisible: false}}/>

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </ApplicationProvider>
  );
}
