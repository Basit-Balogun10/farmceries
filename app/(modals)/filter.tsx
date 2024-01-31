import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useState } from "react";
import Animated, {
    FadeIn,
    FadeOut,
    SlideInDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import appData from "@/assets/data/appData.json";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
// @ts-ignore
import DatePicker from "react-native-modern-datepicker";

const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Page = () => {
    const [openCard, setOpenCard] = useState(0);
    const [selectedPlace, setSelectedPlace] = useState(0);

    const [marketSearch, setMarketSearch] = useState("");
    const [vendorSearch, setVendorSearch] = useState("");
    const router = useRouter();
    const today = new Date().toISOString().substring(0, 10);
    const [markets, setMarkets] = useState(appData.markets);
    const [vendors, setVendors] = useState(appData.vendors);

    const [priceFilters, setPriceFilters] = useState([
        {
            title: "Minimum",
            desc: "Not less than",
            value: 0,
        },
        {
            title: "Maximum",
            desc: "Not more than",
            value: 0,
        },
    ]);

    const onClearAll = () => {
        setSelectedPlace(0);
        setOpenCard(0);
    };

    const handleMarketSearch = (text: string) => {
        setMarketSearch(text);
        if (text.length > 0) {
            const newMarkets = markets.filter((market) =>
                market.name.toLowerCase().includes(text.toLowerCase())
            );
            setMarkets(newMarkets);
        } else {
            setMarkets(appData.markets);
        }
    };

    const handleVendorSearch = (text: string) => {
        setMarketSearch(text);
        if (text.length > 0) {
            const newVendors = markets.filter((vendor) =>
                vendor.name.toLowerCase().includes(text.toLowerCase())
            );
            setVendors(newVendors);
        } else {
            setVendors(appData.vendors);
        }
    };

    const handleFilter = (filter, value) => {
        router.push(`/?filter=${filter}&value=${value}`);
    };

    return (
        <View className="flex-1 h-full">
            <BlurView intensity={70} style={styles.container} tint="light">
                {/*  Where */}
                <View style={styles.card}>
                    {openCard != 0 && (
                        <AnimatedTouchableOpacity
                            onPress={() => setOpenCard(0)}
                            style={styles.cardPreview}
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}
                        >
                            <Text style={styles.previewText}>Market</Text>
                            <Text style={styles.previewdData}>Everywhere</Text>
                        </AnimatedTouchableOpacity>
                    )}

                    {openCard == 0 && (
                        <Text style={styles.cardHeader}>
                            Where are you shopping from?
                        </Text>
                    )}
                    {openCard == 0 && (
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={styles.cardBody}
                        >
                            <View style={styles.searchSection}>
                                <Ionicons
                                    style={styles.searchIcon}
                                    name="ios-search"
                                    size={20}
                                    color="#283106"
                                />
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="Search markets"
                                    value={marketSearch}
                                    onChangeText={handleMarketSearch}
                                    placeholderTextColor={Colors.grey}
                                />
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.placesContainer}
                            >
                                {markets.map((market, index) => (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleFilter("market", market.name)
                                        }
                                        key={index}
                                    >
                                        <Image
                                            source={market.image}
                                            placeholder={blurhash}
                                            style={styles.place}
                                            contentFit="cover"
                                            transition={1000}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: "Rubik",
                                                paddingTop: 6,
                                            }}
                                            className="text-center"
                                        >
                                            {market.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    )}
                </View>

                {/*  Vendor */}
                <View style={styles.card}>
                    {openCard != 1 && (
                        <AnimatedTouchableOpacity
                            onPress={() => setOpenCard(1)}
                            style={styles.cardPreview}
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}
                        >
                            <Text style={styles.previewText}>Vendor</Text>
                            <Text style={styles.previewdData}>Anyone</Text>
                        </AnimatedTouchableOpacity>
                    )}

                    {openCard == 1 && (
                        <Text style={styles.cardHeader}>
                            Who are you buying from?
                        </Text>
                    )}
                    {openCard == 1 && (
                        <Animated.View
                            entering={FadeIn}
                            exiting={FadeOut}
                            style={styles.cardBody}
                        >
                            <View style={styles.searchSection}>
                                <Ionicons
                                    style={styles.searchIcon}
                                    name="ios-search"
                                    size={20}
                                    color="#283106"
                                />
                                <TextInput
                                    style={styles.inputField}
                                    placeholder="Search vendors"
                                    value={vendorSearch}
                                    onChangeText={handleVendorSearch}
                                    placeholderTextColor={Colors.grey}
                                />
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.placesContainer}
                            >
                                {vendors.map((vendor, index) => (
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleFilter("vendor", vendor.name)
                                        }
                                        key={index}
                                    >
                                        <Image
                                            source={vendor.image}
                                            style={styles.place}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: "Rubik",
                                                paddingTop: 6,
                                            }}
                                            className="text-center"
                                        >
                                            {vendor.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    )}
                </View>

                {/* Best before */}
                <View style={styles.card}>
                    {openCard != 2 && (
                        <AnimatedTouchableOpacity
                            onPress={() => setOpenCard(2)}
                            style={styles.cardPreview}
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}
                        >
                            <Text style={styles.previewText}>Best before</Text>
                            <Text style={styles.previewdData}>Anytime</Text>
                        </AnimatedTouchableOpacity>
                    )}

                    {openCard == 2 && (
                        <Text style={styles.cardHeader}>Freshness Period</Text>
                    )}

                    {openCard == 2 && (
                        <Animated.View style={styles.cardBody}>
                            <DatePicker
                                options={{
                                    defaultFont: "Rubik",
                                    headerFont: "Rubik",
                                    mainColor: Colors.primary,
                                    borderColor: "transparent",
                                }}
                                current={today}
                                selected={today}
                                mode={"calendar"}
                            />
                        </Animated.View>
                    )}
                </View>

                {/* Price */}
                <View style={styles.card}>
                    {openCard != 3 && (
                        <AnimatedTouchableOpacity
                            onPress={() => setOpenCard(3)}
                            style={styles.cardPreview}
                            entering={FadeIn.duration(200)}
                            exiting={FadeOut.duration(200)}
                        >
                            <Text style={styles.previewText}>Price</Text>
                            <Text style={styles.previewdData}>Set Pricing</Text>
                        </AnimatedTouchableOpacity>
                    )}

                    {openCard == 3 && (
                        <Text style={styles.cardHeader}>
                            What's your budget?
                        </Text>
                    )}

                    {openCard == 3 && (
                        <Animated.View style={styles.cardBody}>
                            {priceFilters.map((pricing, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.guestItem,
                                        index + 1 < priceFilters.length
                                            ? styles.itemBorder
                                            : null,
                                    ]}
                                >
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: "Rubik",
                                                fontSize: 14,
                                            }}
                                        >
                                            {pricing.title}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: "Rubik",
                                                fontSize: 14,
                                                color: Colors.grey,
                                            }}
                                        >
                                            {pricing.desc}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: "row",
                                            gap: 10,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                const newPricing = [
                                                    ...priceFilters,
                                                ];
                                                newPricing[index].value =
                                                    newPricing[index].value > 0
                                                        ? newPricing[index]
                                                              .value - 1
                                                        : 0;

                                                setPriceFilters(newPricing);
                                            }}
                                        >
                                            <Ionicons
                                                name="remove-circle-outline"
                                                size={26}
                                                color={
                                                    priceFilters[index].value >
                                                    0
                                                        ? Colors.grey
                                                        : "#cdcdcd"
                                                }
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: "Rubik",
                                                fontSize: 16,
                                                minWidth: 18,
                                                textAlign: "center",
                                            }}
                                        >
                                            {pricing.value}
                                        </Text>
                                        <TextInput
                                            placeholder={0}
                                            keyboardType="numeric"
                                            value={pricing.value}
                                            onChangeText={(text) => {
                                                const newPricing = [
                                                    ...priceFilters,
                                                ];
                                                newPricing[index].value = text;
                                                setPriceFilters(newPricing);
                                            }}
                                            className={`h-8 p-1 w-8 font-[Rubik] border border-green-pale rounded-md`}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                const newPricing = [
                                                    ...priceFilters,
                                                ];
                                                newPricing[index].value++;
                                                setPriceFilters(newPricing);
                                            }}
                                        >
                                            <Ionicons
                                                name="add-circle-outline"
                                                size={26}
                                                color={Colors.grey}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <View className="flex flex-row items-center justify-center">
                                <TouchableOpacity
                                    style={[
                                        defaultStyles.btn,
                                        { paddingRight: 20, paddingLeft: 50 },
                                    ]}
                                    onPress={() =>
                                        handleFilter(
                                            "price",
                                            `${priceFilters[0].value},${priceFilters[1].value}`
                                        )
                                    }
                                >
                                    <Text style={defaultStyles.btnText}>
                                        Apply
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    )}
                </View>

                {/* Footer */}
                <Animated.View
                    style={defaultStyles.footer}
                    entering={SlideInDown.delay(200)}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={{ height: "100%", justifyContent: "center" }}
                            onPress={onClearAll}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: "Rubik",
                                    textDecorationLine: "underline",
                                }}
                            >
                                Clear all
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        margin: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        gap: 20,
    },
    cardHeader: {
        fontFamily: "Rubik",
        fontSize: 24,
        padding: 20,
    },
    cardBody: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cardPreview: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },

    searchSection: {
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ABABAB",
        borderRadius: 8,
        marginBottom: 16,
    },
    searchIcon: {
        padding: 10,
    },
    inputField: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    placesContainer: {
        flexDirection: "row",
        gap: 25,
    },
    place: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    placeSelected: {
        borderColor: Colors.grey,
        borderWidth: 2,
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    previewText: {
        fontFamily: "Rubik",
        fontSize: 14,
        color: Colors.grey,
    },
    previewdData: {
        fontFamily: "Rubik",
        fontSize: 14,
        color: Colors.dark,
    },

    guestItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    itemBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.grey,
    },
});
export default Page;
