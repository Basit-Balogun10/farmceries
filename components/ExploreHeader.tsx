import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import appData from "@/assets/data/appData.json";

interface Props {
    onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const categories = appData.categories

    const selectCategory = (index: number) => {
        const selected = itemsRef.current[index];
        setActiveIndex(index);
        selected?.measure((x) => {
            scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCategoryChanged(categories[index].name);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <View style={styles.actionRow}>
                    <TextInput
                        style={styles.searchBtn}
                        onChangeText={setSearchTerm}
                        value={searchTerm}
                        placeholder="Search products"
                    />
                    <Link href={"/(modals)/filter"} asChild>
                        <TouchableOpacity style={styles.filterBtn}>
                            <Ionicons name="options-outline" size={24} />
                        </TouchableOpacity>
                    </Link>
                </View>

                <ScrollView
                    horizontal
                    ref={scrollRef}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: "center",
                        gap: 20,
                        paddingHorizontal: 16,
                    }}
                >
                    {categories.map((item, index) => (
                        <TouchableOpacity
                            ref={(el) => (itemsRef.current[index] = el)}
                            key={index}
                            style={
                                activeIndex === index
                                    ? styles.categoriesBtnActive
                                    : styles.categoriesBtn
                            }
                            onPress={() => selectCategory(index)}
                        >
                            <MaterialIcons
                                name={item.icon as any}
                                size={24}
                                color={
                                    activeIndex === index ? "#000" : Colors.grey
                                }
                            />
                            <Text
                                style={
                                    activeIndex === index
                                        ? styles.categoryTextActive
                                        : styles.categoryText
                                }
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        height: 130,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingBottom: 16,
    },

    searchBtn: {
        backgroundColor: "#fff",
        flexDirection: "row",
        gap: 10,
        padding: 14,
        alignItems: "center",
        width: 280,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#c2c2c2",
        borderRadius: 30,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#A2A0A2",
        borderRadius: 24,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: "Rubik",
        color: Colors.grey,
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: "Rubik",
        color: "#000",
    },
    categoriesBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "#000",
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
});

export default ExploreHeader;
