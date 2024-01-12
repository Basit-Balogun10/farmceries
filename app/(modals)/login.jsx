import { useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
} from "react-native";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";

import AppText from "@/components/AppText";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const Page = () => {
    const [expired, setExpired] = useState(false);
    const [verified, setVerified] = useState(false);
    const { signUp, isLoaded, setActive } = useSignUp();
    // const { startMagicLinkFlow, cancelMagicLinkFlow } =
    //     signUp?.createMagicLinkFlow();
    const [hasInitiatedMagicLink, setHasInitiatedMagicLink] = useState(false);

    const router = useRouter();
    // const redirectUrl = Linking.createURL("/");
    // console.log("Deep link: ", redirectUrl);

    if (!isLoaded) {
        return null;
    }

    useWarmUpBrowser();

    const { startOAuthFlow: googleAuth } = useOAuth({
        strategy: "oauth_google",
    });
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
    const { startOAuthFlow: microsoftAuth } = useOAuth({
        strategy: "oauth_microsoft",
    });
    const { startOAuthFlow: facebookAuth } = useOAuth({
        strategy: "oauth_facebook",
    });

    const loginFormValidationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Required"),
    });

    const onSelectAuth = async (strategy) => {
        const selectedAuth = {
            oauth_google: googleAuth,
            oauth_apple: appleAuth,
            oauth_microsoft: microsoftAuth,
            oauth_facebook: facebookAuth,
        }[strategy];

        try {
            console.log("creating session1....");
            const { createdSessionId, setActive, signIn, signUp } = await selectedAuth();
            console.log("creating session2....");

            if (createdSessionId) {
                console.log("Session ID: ", createdSessionId);
                setActive({ session: createdSessionId });
                console.log('successful')
                router.back();
            } else {
                console.log('Signin object: ', signIn)
                console.log('Signup object: ', signUp)
                console.error(
                    "Unable to complete authentication, please check requirements"
                );
            }
        } catch (err) {
            console.error("OAuth error: ", err, err.stack);
        }
    };

    // const authWithMagicLink = async (formData) => {
    //     setExpired(false);
    //     setVerified(false);

    //     // Start the sign up flow, by collecting
    //     // the user's email address.
    //     await signUp.create({ emailAddress: formData.email });

    //     // Start the magic link flow.
    //     // Pass your app URL that users will be navigated
    //     // when they click the magic link from their
    //     // email inbox.
    //     // su will hold the updated sign up object.
    //     const updatedSignup = await startMagicLinkFlow({
    //         redirectUrl,
    //     });

    //     // Check the verification result.
    //     const verification = updatedSignup.verifications.emailAddress;
    //     if (verification.verifiedFromTheSameClient()) {
    //         setVerified(true);
    //         // If you're handling the verification result from
    //         // another route/component, you should return here.
    //         // See the <MagicLinkVerification/> component as an
    //         // example below.
    //         // If you want to complete the flow on this tab,
    //         // don't return. Check the sign up status instead.
    //         // return;
    //     } else if (verification.status === "expired") {
    //         setExpired(true);
    //     }

    //     if (updatedSignup.status === "complete") {
    //         // Sign up is complete, we have a session.
    //         // Navigate to the after sign up URL.
    //         setActive({
    //             session: su.createdSessionId,
    //             beforeEmit: () => router.replace("/(tabs)/"),
    //         });
    //         return;
    //     }
    // };

    // if (verified) {
    //     return <AppText>Signed in on other tab</AppText>;
    // }

    return (
        <View style={styles.container}>
            <Formik
                initialValues={{
                    email: "",
                }}
                validationSchema={loginFormValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setHasInitiatedMagicLink(true);
                    await authWithMagicLink(values);
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
                            <View className={`mb-1`}>
                                <AppText>Email</AppText>
                            </View>
                            <TextInput
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                value={values.email}
                                className={`h-14 p-4 font-Gilroy border ${
                                    touched.email && errors.email
                                        ? "border-red-500"
                                        : "border-secondaryColor"
                                } rounded-md`}
                            />
                            {touched.email && errors.email ? (
                                <AppText textStyle={`text-red-500`}>
                                    {errors.email}
                                </AppText>
                            ) : null}
                            {expired && (
                                <AppText className="text-sm text-red-500">
                                    There was a problem completing your
                                    authentication - Magic link has expired
                                </AppText>
                            )}
                            {hasInitiatedMagicLink && (
                                <AppText className="text-sm text-green-500">
                                    Your Magic Link has been sent to the email
                                    provided, click on the link to complete your
                                    authentication
                                </AppText>
                            )}
                        </View>
                        <TouchableOpacity
                            style={defaultStyles.btn}
                            onPress={handleSubmit}
                        >
                            <Text style={defaultStyles.btnText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>

            <View style={styles.seperatorView}>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: "black",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Text style={styles.seperator}>or</Text>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: "black",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>

            <View style={{ gap: 20 }}>
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onSelectAuth("oauth_apple")}
                >
                    <Ionicons
                        name="md-logo-apple"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Apple
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onSelectAuth("oauth_google")}
                >
                    <Ionicons
                        name="md-logo-google"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Google
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onSelectAuth("oauth_facebook")}
                >
                    <Ionicons
                        name="md-logo-facebook"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Facebook
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onSelectAuth("oauth_microsoft")}
                >
                    <FontAwesome5
                        name="microsoft"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Microsoft
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 26,
    },

    seperatorView: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginVertical: 30,
    },
    seperator: {
        fontFamily: "Rubik",
        color: Colors.grey,
        fontSize: 16,
    },
    btnOutline: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    btnOutlineText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "Rubik",
    },
});
