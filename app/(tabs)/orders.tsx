import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
} from "react-native-reanimated";
import Colors from "@/constants/Colors";
import { FlatList } from "react-native-gesture-handler";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

  const Orders = () => {

    const [orders, setOrders] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/api/orders?userEmail=${user?.emailAddresses[0]?.emailAddress}`);

                console.log("Fetched user orders: ", response.data);
                setOrders(response.data)
            } catch (error) {
                console.error("Error fetching orders:", error);
                // Handle the error in your application
            }
        };

        fetchOrders()
    }, []);

    const renderOrderItem = ({ item }) => (
    <AnimatedTouchableOpacity
          style={styles.cardPreview}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
      >
          <Text style={styles.previewText}>{item.product}</Text>
          <Text style={styles.previewdData}>{item.status}</Text>
      </AnimatedTouchableOpacity>
  );

    return (
        <SafeAreaView className="flex-1">
            <FlatList
                data={orders}
                keyExtractor={(item) => item?._id?.toString()}
                renderItem={renderOrderItem}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  cardPreview: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
  previewText: {
        fontFamily: "Rubik",
        fontSize: 14,
        color: Colors.grey,
    },
    previewdData: {
        fontFamily: "Rubik",
        fontSize: 14,
        color: Colors.dark,
    },
})

export default Orders;
