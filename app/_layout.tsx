import 'react-native-get-random-values'
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// UIKITTEN IMPORTS
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Text } from '@ui-kitten/components';
import { useUserContext } from '@/contexts/UserContext';

import { getAuth } from 'firebase/auth';
import Header from './components/header';
import CombinedContextProvider from '@/contexts/CombinedContextProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
  const router = useRouter();
  const auth = getAuth();

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Lato-Regular": require('../assets/fonts/Lato-Regular.ttf'),
    "Lato-Thin": require('../assets/fonts/Lato-Thin.ttf'),
  });



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (<CombinedContextProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
          <IconRegistry icons={EvaIconsPack}/>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack >
            <Stack.Screen name="(screens)/index" options={{headerShown: false}}/>
                <Stack.Screen name="(screens)/contractor-screen" options={{header: (props) => {
                  const {user} = useUserContext()
                  return <Header companyName={user?.companyName} email={user?.email} />
                }}} />

<Stack.Screen name="(screens)/driver-screen" options={{header: (props) => {
                  const {user} = useUserContext()
                  return <Header companyName={user?.companyName} email={user?.email} />
                }}} />

                {/* <Stack.Screen name="(screens)/driver-screen" options={{headerShown: true, title:"Driver", headerBackVisible: false}}/> */}
                <Stack.Screen name="(screens)/customer-screen" options={{headerShown: true, title:"Customer", headerBackVisible: false}}/>
                <Stack.Screen name="+not-found" />
            </Stack>
              <StatusBar style="auto" />
          </ThemeProvider>
          
          </ApplicationProvider>
        </CombinedContextProvider>
  );
}
