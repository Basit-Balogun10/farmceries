import { useCallback, useEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import ModalHeaderText from '@/components/ModalHeaderText';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Cache the Clerk JWT
const tokenCache = {
    async getToken(key) {
        try {
            return SecureStore.getItemAsync(key);
        } catch (err) {
            return null;
        }
    },
    async saveToken(key, value) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Inter: Inter_400Regular,
        Rubik: Rubik_400Regular,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded) {
        return null;
    }

    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
        >
            <RootLayoutNav />
        </ClerkProvider>
    );
};

function RootLayoutNav() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    // Automatically open login if user is not authenticated
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            console.log('Not signed in')
            router.push("/(modals)/login");
        }
    }, [isLoaded]);

    return (
        <Stack>
            <Stack.Screen
                name="(modals)/login"
                options={{
                    presentation: "modal",
                    title: "Help us identify you",
                    headerTitleStyle: {
                        fontFamily: "Rubik",
                    },
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ headerTitle: "" }} />
            <Stack.Screen
                name="(modals)/filter"
                options={{
                    presentation: "modal",
                    animation: "fade",
                    headerTransparent: true,
                    headerTitle: (props) => <ModalHeaderText />,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                backgroundColor: "#fff",
                                borderColor: Colors.grey,
                                borderRadius: 20,
                                borderWidth: 1,
                                padding: 4,
                            }}
                        >
                            <Ionicons name="close-outline" size={22} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="(modals)/payment"
                options={{
                    presentation: "modal",
                    title: "Complete Payment",
                    headerTitleStyle: {
                        fontFamily: "Rubik",
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="close-outline" size={28} />
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}