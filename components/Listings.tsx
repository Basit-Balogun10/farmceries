import {
    View,
    Text,
    StyleSheet,
    ListRenderItem,
    TouchableOpacity,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import {
    BottomSheetFlatList,
    BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";

interface Props {
    listings: any[];
    refresh: number;
    category: string;
}

const Listings = ({ listings: items, refresh, category }: Props) => {
    const listRef = useRef<BottomSheetFlatListMethods>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Update the view to scroll the list back top
    useEffect(() => {
        if (refresh) {
            scrollListTop();
        }
    }, [refresh]);

    const scrollListTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    // Use for "updating" the views data after category changed
    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [category]);

    // Render one listing row for the FlatList
    const renderRow: ListRenderItem<any> = ({ item }) => (
        <Link href={`/product/${item.id}`} asChild>
            <TouchableOpacity>
                <Animated.View
                    style={styles.listing}
                    entering={FadeInRight}
                    exiting={FadeOutLeft}
                >
                    <Animated.Image
                        source={{ uri: item.image }}
                        style={styles.image}
                    />
                    <TouchableOpacity
                        style={{ position: "absolute", right: 30, top: 30 }}
                    >
                        <Ionicons name="heart-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ fontSize: 16, fontFamily: "Rubik" }}>
                            {item.name}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                            <Ionicons name="star" size={16} />
                            <Text style={{ fontFamily: "Rubik" }}>
                                {item.rating}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: "Rubik" }}>
                        {item.shortDesc}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 4 }}>
                        <Text style={{ fontFamily: "Rubik" }}>
                            {item.hasPriceRange
                                ? `₦ ${item.minPrice} - ${item.maxPrice}`
                                : `₦ ${item.price}`}
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );

    return (
        <View style={defaultStyles.container}>
            <BottomSheetFlatList
                renderItem={renderRow}
                data={loading ? [] : items}
                ref={listRef}
                ListHeaderComponent={
                    <Text style={styles.info}>{items.length} {items.length > 1 ? 'products' : 'product'}</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listing: {
        padding: 16,
        gap: 10,
        marginVertical: 16,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
    },
    info: {
        textAlign: "center",
        fontFamily: "Rubik",
        fontSize: 16,
        marginTop: 4,
    },
});

export default Listings;
