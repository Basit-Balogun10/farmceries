import React, { useRef } from "react";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { View, TouchableOpacity, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

const makePayment = () => {
    const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { amount, billingEmail } = params;
    const { user } = useUser();

    const addNewOrder = async () => {
        try {
            const response = await axios.post(
                `https://farmceries-backend.vercel.app/api/orders`,
                {
                    // userEmail: user?.emailAddresses[0]?.emailAddress,
                    userEmail: "basitbalogun10@gmail.com",
                    productId: "65b62cdd3854e17dfb6275a8",
                }
            );

            console.log(response.data);
        } catch (error) {
            console.error("Error adding a new order:", error);
        }
    };

    const verifyPayment = async (reference) => {
        try {
            const response = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.EXPO_PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Payment Verification: ", response.data);

            const isPaymentSuccessful =
                response.data.data.status === "success" &&
                response.data.data.amount.toString() === amount.toString();

            return isPaymentSuccessful;
        } catch (error) {
            console.error("Error verifying payment:", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Paystack
                paystackKey={process.env.EXPO_PAYSTACK_SECRET_KEY}
                billingEmail={billingEmail}
                amount={amount}
                // firstName={user?.firstName}
                // lastName={user?.lastName}
                billingName="Basit Balogun"
                firstName="Basit"
                lastName="Balogun"
                autoStart
                activityIndicatorColor="#283106"
                // channels={[
                //     "card",
                //     "bank",
                //     "ussd",
                //     "qr",
                //     "mobile_money",
                // ]}
                onCancel={(e) => {
                    console.log("Payment Cancelled")
                    console.log("failure res: ", e);

                    router.back();
                    // handle response here
                }}
                onSuccess={async (res) => {
                    console.log("success res: ", res);
                    // const isPaymentSuccessful = await verifyPayment(res.reference);

                    // if (isPaymentSuccessful) {
                    //     await addNewOrder();
                    // } 

                    // router.replace({
                    //     pathName: "/(modals)/confirmPayment",
                    //     params: { isPaymentSuccessful },
                    // });
                    // handle response here
                }}
                ref={paystackWebViewRef}
            />
            
            <TouchableOpacity
                onPress={() => paystackWebViewRef?.current?.startTransaction()}
            >
                <Text>Pay Now</Text>
            </TouchableOpacity>
        </View>
    );
};

export default makePayment;
