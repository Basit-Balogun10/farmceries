import React from "react";

const Signup = () => {
    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <View>
                <Text>Signup</Text>
                <Link href="/Signin">Already own an account?</Link>
            </View>
        </SafeAreaView>
    );
};

export default Signup;
