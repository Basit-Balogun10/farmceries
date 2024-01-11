import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Link } from "expo-router";

const index = () => {
    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <View>
                <Text>Signin</Text>
                {/* <Link href="/Signup">Don't own an account?</Link> */}
            </View>
        </SafeAreaView>
    );
};

export default index;
