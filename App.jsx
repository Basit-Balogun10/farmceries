import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View } from "react-native";
import AppText from "./components/AppText";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular } from "@expo-google-fonts/inter";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded, fontError] = useFonts({
        Inter: Inter_400Regular,
        Rubik: Rubik_400Regular,
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync(); 
            console.log("Done...");
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <View
                className="flex-1 items-center justify-center bg-light"
                onLayout={onLayoutRootView}
            >
                <AppText>Open up App.js to start working your app!</AppText>
                <AppText>
                    Paragraphs p-tags, h-tags with the Text Component
                </AppText>
                <Text className="font-inter text-base text-green-dark">
                    Written with Inter
                </Text>
                <StatusBar style="auto" />
            </View>
        </SafeAreaProvider>
    );
}
