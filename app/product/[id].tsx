import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    Share,
    TextInput,
} from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import appData from "@/assets/data/appData.json";
import Colors from "@/constants/Colors";
import Animated, {
    SlideInDown,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from "react-native-reanimated";
import { defaultStyles } from "@/constants/Styles";
import { useUser } from "@clerk/clerk-expo";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const DetailsPage = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const product = appData.products.find(
        (item) => item.id === parseInt(id, 10)
    );
    console.log("Data: ", appData, id);
    console.log("Product: ", product);
    const navigation = useNavigation();
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const [priceError, setPriceError] = useState(false);
    const [customPrice, setCustomPrice] = useState("");
    const redirectURL = Linking.createURL("/(tabs)/orders");
    const { user } = useUser();

    const shareListing = async () => {
        try {
            await Share.share({
                title: product.name,
                url: product.image,
            });
        } catch (err) {
            console.log(err);
        }
    };

    // const getPaymentLink = async (product) => {
    //     try {
    //         const response = await axios.post(
    //             "https://farmceries-backend.vercel.app/api/flutterwave/payment-link",
    //             {
    //                 amount: product.hasPriceRange ? customPrice : product.price, // Replace with the actual amount
    //                 redirect_url: redirectURL,
    //                 customer: {
    //                     email: user?.emailAddresses[0]?.emailAddress,
    //                 },
    //             }
    //         );

    //         console.log("Flutterwave Payment Link:", response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error getting payment link:", error);
    //     }
    // };

    // const checkout = async (product) => {
    //     console.log("Checking out...");

    //     if (product.hasPriceRange && customPrice === "") {
    //         setPriceError(true);
    //         return;
    //     }

    //     const paymentLink = await getPaymentLink(product);
    //     let result = WebBrowser.openBrowserAsync(paymentLink);
    //     console.log("PAYMENT RESULT: ", result);
    // };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerTransparent: true,

            headerBackground: () => (
                <Animated.View
                    style={[headerAnimatedStyle, styles.header]}
                ></Animated.View>
            ),
            headerRight: () => (
                <View style={styles.bar}>
                    <TouchableOpacity
                        style={styles.roundButton}
                        onPress={shareListing}
                    >
                        <Ionicons
                            name="share-outline"
                            size={22}
                            color={"#000"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundButton}>
                        <Ionicons
                            name="heart-outline"
                            size={22}
                            color={"#000"}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color={"#000"} />
                </TouchableOpacity>
            ),
        });
    }, []);

    const scrollOffset = useScrollViewOffset(scrollRef);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [2, 1, 1]
                    ),
                },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollOffset.value,
                [0, IMG_HEIGHT / 1.5],
                [0, 1]
            ),
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                ref={scrollRef}
                scrollEventThrottle={16}
            >
                <Animated.Image
                    source={{ uri: product.image }}
                    style={[styles.image, imageAnimatedStyle]}
                    resizeMode="cover"
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.location}>{product.shortDesc}</Text>
                    <Text style={styles.rooms}>
                        Date Uploaded · {product.dateCreated.split("T")[0]} ·{" "}
                        Freshness Period · {product.shelfLife.split("T")[0]}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 4 }}>
                        <Ionicons name="star" size={16} />
                        <Text style={styles.ratings}>
                            {product.rating} · {product.number_of_reviews}{" "}
                            reviews
                        </Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image
                            source={{ uri: product.vendor.image }}
                            style={styles.host}
                        />

                        <View>
                            <Text style={{ fontWeight: "500", fontSize: 16 }}>
                                Posted by {product.vendor.name}
                            </Text>
                            <View className="flex flex-row items-center">
                                <View className="flex flex-row">
                                    <Ionicons name="star" size={16} />
                                    <Text className="font-[Rubik] ml-2">
                                        {product.vendor.rating}
                                    </Text>
                                </View>
                                <View className="flex flex-row ml-4">
                                    <Text className="font-[Rubik]">
                                        Opening Hours:
                                    </Text>
                                    <Text className="font-[Rubik] ml-2">
                                        {product.vendor.openHour} -{" "}
                                        {product.vendor.closingHour}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />
                    </View>
                    <View className="mt-4">
                        <Text className="" style={styles.description}>
                            {product.longDesc}
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>

            <Animated.View
                style={defaultStyles.footer}
                entering={SlideInDown.delay(200)}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                    }}
                >
                    {product.hasPriceRange ? (
                        <View className="gap-2">
                            <Text className="text-xs">
                                Desired Quantity ₦{product.minPrice} - ₦
                                {product.maxPrice}
                            </Text>
                            <TextInput
                                placeholder={`${product.minPrice} -  ${product.maxPrice}`}
                                keyboardType="numeric"
                                value={customPrice}
                                onChangeText={setCustomPrice}
                                className={`h-12 p-2 w-32 font-[Rubik] border ${
                                    priceError
                                        ? "border-red-500"
                                        : "border-green-pale"
                                } rounded-md text-center`}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.footerText}>
                            <Text className="" style={styles.footerPrice}>
                                ₦{product.price}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Link href="/(modals)/payment" asChild>
                        <TouchableOpacity
                            style={defaultStyles.btn}
                            className={`${
                                product.hasPriceRange && customPrice === "" ? "opacity-50" : "opacity-100"
                            } px-5`}
                            disabled={
                                product.hasPriceRange && customPrice === ""
                            }
                            onPress={() =>
                                router.push({
                                    pathName: "/(modals)/payment",
                                    params: { productId: product.id },
                                })
                            }
                        >
                            <Text style={defaultStyles.btnText}>
                                Buy Product
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    image: {
        height: IMG_HEIGHT,
        width: width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: "#fff",
    },
    name: {
        fontSize: 26,
        fontWeight: "bold",
        fontFamily: "Rubik",
    },
    location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: "Rubik",
    },
    rooms: {
        fontSize: 16,
        color: Colors.grey,
        marginVertical: 4,
        fontFamily: "Rubik",
    },
    ratings: {
        fontSize: 16,
        fontFamily: "Rubik",
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
    },
    host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
    },
    hostView: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    footerText: {
        height: "100%",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    footerPrice: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: "Rubik",
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        color: Colors.primary,
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    header: {
        backgroundColor: "#fff",
        height: 100,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
    },

    description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: "Rubik",
    },
});

export default DetailsPage;
