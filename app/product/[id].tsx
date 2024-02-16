import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
    Link,
    useLocalSearchParams,
    useNavigation,
    useRouter,
} from "expo-router";
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
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
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
    const navigation = useNavigation();
    const product = appData.products.find(
        (item) => item.id === parseInt(id, 10)
    );
    console.log("Data: ", appData, id);
    console.log("Product: ", product);
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const [priceError, setPriceError] = useState(false);
    const [customPrice, setCustomPrice] = useState("");
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);
    const params = useLocalSearchParams();
    const { user } = useUser();

    const FARMCERIES_API = process.env.EXPO_FARMCERIES_API;

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

    const handlePriceChange = (value) => {
        if (
            product?.hasPriceRange &&
            (value < product?.minPrice || value > product.maxPrice)
        ) {
            setPriceError(true);
        } else {
            setPriceError(false);
        }

        setCustomPrice(value);
    };

    const addNewOrder = async () => {
        try {
            const response = await axios.post(
                `https://farmceries-backend.vercel.app/api/orders`,
                {
                    // userEmail: user?.emailAddresses[0]?.emailAddress,
                    userEmail: 'basitbalogun10@gmail.com',
                    productId: "65b62cdd3854e17dfb6275a8",
                }
            );

            console.log(response.data);
        } catch (error) {
            console.error("Error adding a new order:", error);
        }
    };

    const handleRedirect = (event) => {
        console.log("Event: ", event);
        if (Constants.platform.ios) {
            console.log("dismissing on ios");
            WebBrowser.dismissBrowser();
        }
        // else {
        //     Linking.removeEventListener("url", handleRedirect);
        // }

        const data = Linking.parse(event.url);
        setPaymentData(data);
    };

    const openBrowserAsync = async (url) => {
        // const redirectUrl = Linking.createURL('payment', {
        //     queryParams: {
        //         paymentSuccessful: true,
        //         productId: productId,
        //     }
        // });
        // const result = await WebBrowser.openBrowserAsync(
        //     `https://checkout.flutterwave.com/v3/checkout?public_key=${FSI_SANDBOX_API_KEY}&tx_ref=${Date.now()}&amount=100&currency=NGN&redirect_url=${redirectUrl}&payment_options=card`,
        //     {
        //         showInRecents: true,
        //     }
        // );

        // if (Constants.platform.ios) {
        //     WebBrowser.dismissBrowser();
        // } else {
        //     removeLinkingListener();
        // }

        // const data = Linking.parse(result.url);
        // setPaymentData(data);

        try {
            const eventSubscription = Linking.addEventListener(
                "url",
                handleRedirect
            );
            let result = await WebBrowser.openBrowserAsync(url);

            if (Constants.platform.ios) {
                eventSubscription.remove();
            }

            setPaymentResult(result);
        } catch (error) {
            console.log("Payment error: ", error);
        }
    };

    const verifyPayment = async (reference) => {
        try {
            const response = await axios.get(
                `https://farmceries-backend.vercel.app/api/paystack/verify-payment?reference=${reference}&amount=${
                    Number(customPrice || product.price) * 100
                }`
            );

            console.log("Payment Verification: ", response.data);
            return response.data.success;
        } catch (error) {
            console.error("Error verifying payment:", error);
        }
    };

    const checkout = async (values) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                `https://farmceries-backend.vercel.app/api/paystack/payment-link`,
                {
                    email: "basitbalogun10@gmail.com",
                    callback_url: Linking.createURL("payment", {
                        queryParams: {
                            cancelled: false,
                        },
                    }),
                    cancellation_url: Linking.createURL("payment", {
                        queryParams: {
                            cancelled: true,
                        },
                    }),
                    amount: Number(customPrice || product.price) * 100, // Price in Kobo,
                }
            );

            const paymentLink = response.data.data.authorization_url;
            console.log("Payment Link: ", response.data);

            await openBrowserAsync(paymentLink);
            // Check result type (cancelled, dismissed or successful)
            // If cancelled (clicked on Cancel), gets redirected with cancellation_url, restult type is 'dismiss'
            // If dimissed (cliked on Done), no rediretion, result type is 'cancel'
            // Verify payment
            const isPaymentSuccessful = await verifyPayment(
                response.data.data.reference
            );
            console.log("Is payment successful: ", isPaymentSuccessful);

            if (isPaymentSuccessful) {
                await addNewOrder();
            } else {
                

            }

            router.push(`/(modals)/confirmPayment?isPaymentSuccessful=${isPaymentSuccessful}`);

            setPaymentSuccessful(true);
        } catch (error) {
            console.error("Error completing payment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Payment result: ", paymentResult);
    }, [paymentResult]);

    useEffect(() => {
        console.log("Payment data: ", paymentData);
    }, [paymentData]);

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

                        <View className="flex flex-1 flex-row items-center justify-between">
                            <View className="">
                                <Text
                                    style={{ fontWeight: "500", fontSize: 16 }}
                                >
                                    Uploaded by {product.vendor.name}
                                </Text>
                                <View className="flex flex-row">
                                    <Text className="font-[Rubik]">
                                        Opening Hours:
                                    </Text>
                                    <Text className="font-[Rubik] ml-2">
                                        {product.vendor.openingHour} -{" "}
                                        {product.vendor.closingHour}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row items-center ml-4">
                                <Ionicons name="star" size={16} />
                                <Text className="font-[Rubik] ml-2">
                                    {product.vendor.rating}
                                </Text>
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
                                onChangeText={handlePriceChange}
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

                    <TouchableOpacity
                        style={defaultStyles.btn}
                        className={`${
                            (product.hasPriceRange && customPrice === "") ||
                            priceError
                                ? "opacity-50"
                                : "opacity-100"
                        } px-5`}
                        disabled={
                            (product.hasPriceRange && customPrice === "") ||
                            priceError
                        }
                        onPress={checkout}
                    >
                        <Text style={defaultStyles.btnText}>Buy Product</Text>
                    </TouchableOpacity>
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
        fontWeight: "bold",
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
