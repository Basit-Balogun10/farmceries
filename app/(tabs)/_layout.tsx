import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarLabelStyle: {
                    fontFamily: "Rubik",
                },
            }}
    >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Explore",
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    tabBarLabel: "Orders",
                    tabBarIcon: ({ size, color }) => (
                        <Feather
                            name="package"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: "Profile",

                    headerShown: false,
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons
                            name="person-circle-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default Layout;
