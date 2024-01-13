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
import { useUser } from "@clerk/clerk-expo";

const payment = () => {
    const animation = useRef(null);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useUser();

    const { productId } = params;

    const paymentFormValidationSchema = Yup.object().shape({
        cardNumber: Yup.string()
            .matches(/^[0-9]+$/, "Card number must only contain digits")
            .min(16, "Card number must be 16 digits")
            .max(16, "Card number must be 16 digits")
            .required("Required"),
        expirationMonth: Yup.string()
            .matches(/^[0-9]+$/, "Expiration month must only contain digits")
            .min(2, "Expiration month must be 2 digits")
            .max(2, "Expiration month must be 2 digits")
            .required("Required"),
        expirationYear: Yup.string()
            .matches(/^[0-9]+$/, "Expiration year must only contain digits")
            .min(2, "Expiration month must be 2 digits")
            .max(2, "Expiration month must be 2 digits")
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

            // await addNewOrder();
            setPaymentSuccessful(true);
            animation.current?.play();
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
            <View className={`flex-1 items-center mt-12 ${paymentSuccessful ? '' : 'hidden'}`}>
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
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                    source={paymentSuccessfulAnimation}
                />
                {/* <TouchableOpacity
                    className="px-12"
                    style={defaultStyles.btn}
                    onPress={() => router.push('/(tabs)/_layout')}
                >
                    <Text style={defaultStyles.btnText}>Shop again</Text>
                </TouchableOpacity> */}
            </View>
            <View className={`mt-6 ${paymentSuccessful ? 'hidden' : ''}`}>
                <View className="flex w-full justify-center">
                    <LottieView
                        autoPlay
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
                        expirationMonth: "",
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
                                    onChangeText={handleChange("cardNumber")}
                                    onBlur={handleBlur("cardNumber")}
                                    value={values.cardNumber}
                                    className={`h-14 p-4 font-[Rubik] border ${
                                        touched.cardNumber && errors.cardNumber
                                            ? "border-red-500"
                                            : "border-green-pale"
                                    } rounded-md`}
                                    placeholder="Enter your card number"
                                    keyboardType="numeric"
                                    maxLength={16}
                                />

                                {touched.cardNumber && errors.cardNumber ? (
                                    <Text className="text-red-500 text-center">
                                        {errors.cardNumber}
                                    </Text>
                                ) : null}
                            </View>
                            <View className="flex flex-row gap-4">
                                <View className={`flex-1 mb-4`}>
                                    <TextInput
                                        onChangeText={handleChange(
                                            "expirationMonth"
                                        )}
                                        onBlur={handleBlur("expirationMonth")}
                                        value={values.expirationMonth}
                                        className={`h-14 p-4 text-center font-[Rubik] border ${
                                            touched.expirationMonth &&
                                            errors.expirationMonth
                                                ? "border-red-500"
                                                : "border-green-pale"
                                        } rounded-md`}
                                        placeholder="MM"
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                    {touched.expirationMonth &&
                                    errors.expirationMonth ? (
                                        <Text className="text-red-500 text-center">
                                            {errors.expirationMonth}
                                        </Text>
                                    ) : null}
                                </View>
                                <View className={`flex-1 mb-4`}>
                                    <TextInput
                                        onChangeText={handleChange(
                                            "expirationYear"
                                        )}
                                        onBlur={handleBlur("expirationYear")}
                                        value={values.expirationYear}
                                        className={`h-14 p-4 text-center font-[Rubik] border ${
                                            touched.expirationYear &&
                                            errors.expirationYear
                                                ? "border-red-500"
                                                : "border-green-pale"
                                        } rounded-md`}
                                        placeholder="YY"
                                        keyboardType="numeric"
                                        maxLength={2}
                                    />
                                    {touched.expirationYear &&
                                    errors.expirationYear ? (
                                        <Text className="text-red-500 text-center">
                                            {errors.expirationYear}
                                        </Text>
                                    ) : null}
                                </View>
                                <View className={`flex-1 mb-4`}>
                                    <TextInput
                                        onChangeText={handleChange("cvv")}
                                        onBlur={handleBlur("cvv")}
                                        value={values.cvv}
                                        className={`h-14 p-4 text-center font-[Rubik] border ${
                                            touched.cvv && errors.cvv
                                                ? "border-red-500"
                                                : "border-green-pale"
                                        } rounded-md`}
                                        placeholder="CVV"
                                        keyboardType="numeric"
                                        maxLength={3}
                                    />
                                    {touched.cvv && errors.cvv ? (
                                        <Text className="text-red-500 text-center">
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
        </View>
    );
};

export default payment;
