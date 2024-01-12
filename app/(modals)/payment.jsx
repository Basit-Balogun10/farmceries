import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { defaultStyles } from "@/constants/Styles";
import paymentSuccessfulAnimation from "@/assets/lottie/paymentSuccessful.json";
import cardAnimation from "@/assets/lottie/cardAnimation.json";
import AppText from "@/components/AppText";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";

const payment = () => {
    const animation = useRef(null);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const params = useLocalSearchParams();
    const router = useRouter();

    const { productId } = params;

    const paymentFormValidationSchema = Yup.object().shape({
        cardNumber: Yup.string()
            .matches(/^[0-9]+$/, "Card number must only contain digits")
            .min(16, "Card number must be 16 digits")
            .max(16, "Card number must be 16 digits")
            .required("Required"),
        expirationDate: Yup.string()
            .matches(/^\d{2}\/\d{2}$/, "Invalid format (MM/YY)")
            .required("Required"),
        cvv: Yup.string()
            .matches(/^[0-9]+$/, "CVV must only contain digits")
            .min(3, "CVV must be 3 digits")
            .max(3, "CVV must be 3 digits")
            .required("Required"),
    });

    const FSI_SANDBOX_API_KEY = process.env.EXPO_FSI_SANDBOX_API_KEY;

    const addNewOrder = async () => {
        try {
            const response = await axios.post(
                "https://farmceries-backend.vercel.app/api/orders",
                {
                    userEmail: user?.emailAddresses[0]?.emailAddress, // Replace with the actual user email
                    productId, // Replace with the actual product ID
                }
            );

            console.log(response.data);
        } catch (error) {
            console.error("Error adding a new order:", error);
        }
    };

    const checkout = async (values) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://fsi.ng/api/v1/flutterwave/v3/charges?type=card",
                {
                    client: "C10EgEYkJrusinoq55RgQ7rl+hlselSCuuX6GWx6VIJ7Ec7hXCGXup9Ukx8Luge/2HH2WYqXHvqdgrwMxhwlFMUV7tgqgH9ZCoe37pCnvkSkToNPiAbU0jG7L5i+WCxVR5/RaF0p0wbts8nb291rlgpnkk7QPuI2HcqR9R5Uairt/0O+PEmmFhF9v9A92X1w3zyAsGKQH98XxJxP9tAn176RahJL0upUhxrkJHoyJdaE55iicZGpg7Gu/CMYkgQHBGj3ODzL4Bla+pO+50wh5j2BIR+yjx8/V6uMw0qEPvfi5w+zQMoyQhFKvaYxk9P23L+SqR1tBzkty/aV4SCwLmpnzQnbXUewBqxZTQH+1MI=",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "sandbox-key":
                            "yc02d9dALxM4rR3xIwXtWdMTfBhtLp6S1704983041",
                        Authorization: "dskjdks",
                    },
                }
            );

            console.log(response.data);

            await addNewOrder();
            setPaymentSuccessful(true);
        } catch (error) {
            console.error("Error completing payment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (paymentSuccessful) {
            animation.current?.play();
        }
    }, [paymentSuccessful]);

    return (
        <View className="flex-1 px-4">
            {paymentSuccessful ? (
                <View className="flex-1 items-center justify-center">
                    <AppText className="text-lg font-semibold">
                        Payment Successful
                    </AppText>
                    <LottieView
                        autoPlay
                        loop={true}
                        ref={animation}
                        className="mx-auto"
                        style={{
                            width: 200,
                            height: 200,
                            // backgroundColor: "#DFE0DC1A",
                        }}
                        source={paymentSuccessfulAnimation}
                    />
                    <TouchableOpacity
                    className="px-12"
                        style={defaultStyles.btn}
                        onPress={() => router.replace("/(tabs)/orders")}
                    >
                        <Text style={defaultStyles.btnText}>
                            Show my Orders
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="mt-6">
                    <View className="flex w-full justify-center">
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{
                                width: 150,
                                height: 150,
                                marginLeft: "auto",
                                marginRight: "auto",
                                // backgroundColor: "#DFE0DC1A",
                            }}
                            source={cardAnimation}
                        />
                    </View>
                    <Formik
                        initialValues={{
                            cardNumber: "",
                            expirationDate: "",
                            cvv: "",
                        }}
                        validationSchema={paymentFormValidationSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            await checkout(values);
                            setSubmitting(false);
                        }}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            touched,
                            errors,
                        }) => (
                            <View>
                                <View className={`mb-4`}>
                                    <TextInput
                                        onChangeText={handleChange(
                                            "cardNumber"
                                        )}
                                        onBlur={handleBlur("cardNumber")}
                                        value={values.cardNumber}
                                        className={`h-14 p-4 font-[Rubik] border ${
                                            touched.cardNumber &&
                                            errors.cardNumber
                                                ? "border-red-500"
                                                : "border-green-pale"
                                        } rounded-md tracking-wider`}
                                        placeholder="Enter your card number"
                                        keyboardType="numeric"
                                        maxLength={16}
                                    />

                                    {touched.cardNumber && errors.cardNumber ? (
                                        <Text style={{ color: "red" }}>
                                            {errors.cardNumber}
                                        </Text>
                                    ) : null}
                                </View>
                                <View className="flex flex-row gap-4">
                                    <View className={`flex-1 mb-4`}>
                                        <TextInput
                                            onChangeText={handleChange(
                                                "expirationDate"
                                            )}
                                            onBlur={handleBlur(
                                                "expirationDate"
                                            )}
                                            value={values.expirationDate}
                                            className={`h-14 p-4 font-[Rubik] border ${
                                                touched.expirationDate &&
                                                errors.expirationDate
                                                    ? "border-red-500"
                                                    : "border-green-pale"
                                            } rounded-md tracking-wider`}
                                            placeholder="MM/YY"
                                            // keyboardType="numeric"
                                        />
                                        {touched.expirationDate &&
                                        errors.expirationDate ? (
                                            <Text style={{ color: "red" }}>
                                                {errors.expirationDate}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View className={`flex-1 mb-4`}>
                                        <TextInput
                                            onChangeText={handleChange("cvv")}
                                            onBlur={handleBlur("cvv")}
                                            value={values.cvv}
                                            className={`h-14 p-4 font-[Rubik] border ${
                                                touched.cvv && errors.cvv
                                                    ? "border-red-500"
                                                    : "border-green-pale"
                                            } rounded-md tracking-wider`}
                                            placeholder="CVV"
                                            keyboardType="numeric"
                                            maxLength={3}
                                        />
                                        {touched.cvv && errors.cvv ? (
                                            <Text style={{ color: "red" }}>
                                                {errors.cvv}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                                <View className="mt-4">
                                    <TouchableOpacity
                                        style={defaultStyles.btn}
                                        onPress={handleSubmit}
                                        disabled={isLoading}
                                    >
                                        <Text style={defaultStyles.btnText}>
                                            Checkout
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            )}
        </View>
    );
};

export default payment;
