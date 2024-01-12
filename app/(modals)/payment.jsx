import { View, Text } from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const payment = () => {
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    const loginFormValidationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Required"),
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
                        email: "",
                    }}
                    validationSchema={loginFormValidationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        checkout(values);
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
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                    className={`h-14 p-4 font-Gilroy border ${
                                        touched.email && errors.email
                                            ? "border-red-500"
                                            : "border-secondaryColor"
                                    } rounded-md tracking-wider`}
                                    placeholder="Enter your card number"
                                />
                                {touched.email && errors.email ? (
                                    <AppText textStyle={`text-red-500`}>
                                        {errors.email}
                                    </AppText>
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
