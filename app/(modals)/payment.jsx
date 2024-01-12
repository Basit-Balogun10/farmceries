import { View, Text } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";


const payment = () => {
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    const paymentFormValidationSchema = Yup.object().shape({
        cardNumber: Yup.string()
            .matches(/^[0-9]+$/, "Card number must only contain digits")
            .min(16, "Card number must be 16 digits")
            .max(16, "Card number must be 16 digits")
            .required("Required"),
        expirationDate: Yup.string()
            .matches(/^\d{2}\/\d{2}$/, "Invalid format (mm/yy)")
            .required("Required"),
        cvv: Yup.string()
            .matches(/^[0-9]+$/, "CVV must only contain digits")
            .min(3, "CVV must be 3 digits")
            .max(3, "CVV must be 3 digits")
            .required("Required"),
    });

    const FSI_SANDBOX_API_KEY = process.env.EXPO_FSI_SANDBOX_API_KEY;

    const checkout = async (values) => {
        try {
            const response = await axios.post(
                "https://fsi.ng/api/v1/flutterwave/v3/charges?type=card",
                {
                    client: "C10EgEYkJrusinoq55RgQ7rl+hlselSCuuX6GWx6VIJ7Ec7hXCGXup9Ukx8Luge/2HH2WYqXHvqdgrwMxhwlFMUV7tgqgH9ZCoe37pCnvkSkToNPiAbU0jG7L5i+WCxVR5/RaF0p0wbts8nb291rlgpnkk7QPuI2HcqR9R5Uairt/0O+PEmmFhF9v9A92X1w3zyAsGKQH98XxJxP9tAn176RahJL0upUhxrkJHoyJdaE55iicZGpg7Gu/CMYkgQHBGj3ODzL4Bla+pO+50wh5j2BIR+yjx8/V6uMw0qEPvfi5w+zQMoyQhFKvaYxk9P23L+SqR1tBzkty/aV4SCwLmpnzQnbXUewBqxZTQH+1MI=",
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "sandbox-key": FSI_SANDBOX_API_KEY,
                        Authorization: "dskjdks",
                    },
                }
            );

            console.log(response.data);
            setPaymentSuccessful(true);
        } catch (error) {
            console.error("Error completing payment:", error);
        }
    };

    return (
        <View className="flex-1 items-center justify-center">
            {paymentSuccessful ? (
                <TouchableOpacity
                    style={defaultStyles.btn}
                    onPress={() => router.replace("/(tabs)/orders")}
                >
                    <Text style={defaultStyles.btnText}>Show my Orders</Text>
                </TouchableOpacity>
            ) : (
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
                                    onChangeText={handleChange("cardNumber")}
                                    onBlur={handleBlur("cardNumber")}
                                    value={values.cardNumber}
                                    className={`h-14 p-4 font-Gilroy border ${
                                        touched.cardNumber && errors.cardNumber
                                            ? "border-red-500"
                                            : "border-green-pale"
                                    } rounded-md tracking-wider`}
                                    placeholder="Enter your card number"
                                />
                                {touched.cardNumber && errors.cardNumber ? (
                                    <Text style={{ color: "red" }}>
                                        {errors.cardNumber}
                                    </Text>
                                ) : null}
                            </View>
                            <View className={`mb-4`}>
                                <TextInput
                                    onChangeText={handleChange(
                                        "expirationDate"
                                    )}
                                    onBlur={handleBlur("expirationDate")}
                                    value={values.expirationDate}
                                    className={`h-14 p-4 font-Gilroy border ${
                                        touched.expirationDate &&
                                        errors.expirationDate
                                            ? "border-red-500"
                                            : "border-green-pale"
                                    } rounded-md tracking-wider`}
                                    placeholder="Enter expiration date (mm/yy)"
                                />
                                {touched.expirationDate &&
                                errors.expirationDate ? (
                                    <Text style={{ color: "red" }}>
                                        {errors.expirationDate}
                                    </Text>
                                ) : null}
                            </View>
                            <View className={`mb-4`}>
                                <TextInput
                                    onChangeText={handleChange("cvv")}
                                    onBlur={handleBlur("cvv")}
                                    value={values.cvv}
                                    className={`h-14 p-4 font-Gilroy border ${
                                        touched.cvv && errors.cvv
                                            ? "border-red-500"
                                            : "border-green-pale"
                                    } rounded-md tracking-wider`}
                                    placeholder="Enter CVV"
                                />
                                {touched.cvv && errors.cvv ? (
                                    <Text style={{ color: "red" }}>
                                        {errors.cvv}
                                    </Text>
                                ) : null}
                            </View>
                            <TouchableOpacity
                                style={defaultStyles.btn}
                                onPress={handleSubmit}
                            >
                                <Text style={defaultStyles.btnText}>
                                    Checkout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            )}
        </View>
    );
};

export default payment;
