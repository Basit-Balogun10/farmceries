import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import paymentSuccessfulAnimation from "@/assets/lottie/paymentSuccessful.json";
import paymentFailedAnimation from "@/assets/lottie/paymentFailed.json";
// import cardAnimation from "@/assets/lottie/cardAnimation.json";
import AppText from "@/components/AppText";
// import { TextInput } from "react-native-gesture-handler";
import LottieView from "lottie-react-native";
import { useUser } from "@clerk/clerk-expo";

const confirmPayment = () => {
    const animation = useRef(null);
    const router = useRouter();
    const params = useLocalSearchParams();
    const { isPaymentSuccessful } = params;
    const { user } = useUser();

    // useEffect(() => {
    //     if (paymentSuccessful) {
    //         console.log("Payment Successful: ", paymentSuccessful);
    //         animation.current?.play();
    //     }
    //     //  else {
    //     //     const url = Linking.useURL()
    //     //     if (url.queryParams.paymentSuccessful) {
    //     //         setPaymentSuccessful(true);
    //     //         console.log('Payment Successful: ', paymentSuccessful)
    //     //         animation.current?.play();
    //     //     }
    //     // }
    // }, [paymentSuccessful]);

    return (
        <View className="flex-1 px-4">
            {isPaymentSuccessful ? (
                <View className={`flex-1 items-center mt-12`}>
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
                    <TouchableOpacity
                        className="px-12"
                        style={defaultStyles.btn}
                        onPress={() => router.push("/(tabs)/orders")}
                    >
                        <Text style={defaultStyles.btnText}>
                            Show my orders
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className={`flex-1 items-center mt-12`}>
                    <AppText className="text-lg font-semibold">
                        Payment Failed
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
                        source={paymentFailedAnimation}
                    />
                    <TouchableOpacity
                        className="px-12"
                        style={defaultStyles.btn}
                        onPress={() => router.back()}
                    >
                        <Text style={defaultStyles.btnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default confirmPayment;
