import {
    ActivityIndicator,
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import Colors from "@/constants/Colors";
import {
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Link } from "expo-router";
import appData from "@/assets/data/appData.json";
import axios from "axios";

interface Props {
    onCategoryChanged: (category: string) => void;
    products: [];
    setProducts: React.Dispatch<React.SetStateAction<[]>>;
}

const ExploreHeader = ({ onCategoryChanged, products, setProducts }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [labels, setLabels] = useState([]);
    const categories = appData.categories;

    const GOOGLE_CLOUD_VISION_API_KEY =
        process.env.EXPO_GOOGLE_CLOUD_VISION_API_KEY;

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                analyzeImage(imageUri);
            }
        } catch (error) {
            console.log("Error in picking image: ", error);
            alert("Unable to select your image. Please retry.");
        }
    };

    const analyzeImage = async (imageUri: string) => {
        try {
            if (!imageUri) {
                alert("Please select an image first");
                return;
            }
            console.log('Analyzing...')

            // console.log('key: ', GOOGLE_CLOUD_VISION_API_KEY)
            const cloudVisionAPIURL = `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBr9z-90n8yQKSy40iu522hCLL6mU_fGdU`;

            const base64ImageData = await FileSystem.readAsStringAsync(
                imageUri,
                {
                    encoding: FileSystem.EncodingType.Base64,
                }
            );

            const requestsData = {
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [
                            {
                                type: "LABEL_DETECTION",
                                maxResults: 30,
                            },
                        ],
                    },
                ],
            };

            const response = await axios.post(cloudVisionAPIURL, requestsData);
            console.log("Analysis result: ", response);
            const labels = response.data.responses[0].labelAnnotations.map( labelAnonotation => labelAnonotation.description )
            console.log(`Labels: ${labels}`)
            
            handleMultipleSearch(labels);
        } catch (error) {
            console.error("Error analyzing image: ", error);
            alert("Unable to analyze your image. Please try again later.");
        }
    };

    const handleMultipleSearch = (values) => {
        if (values.length === 0) {
            setProduts(products)
        } else {
            let filteredProducts = [];
            console.log('Values: ', values)

            values.forEach(value => {
                const filtered = handleSearch(value, true)
                console.log('Filtered: ', filtered)
                filteredProducts = [...filteredProducts, ...filtered]
            })
            console.log('Filtered Products: ', filteredProducts)

            setSearchTerm("");
            setProducts(Array.from(new Set(filteredProducts)))
        }
    }

    const handleSearch = (value, returnResult) => {
        setSearchTerm(value);
        if (value === "") {
            setProducts(products);
        } else {
            const filteredProducts = products.filter((product) => {
                return (
                    product.name.toLowerCase().includes(value.toLowerCase()) ||
                    product.aliases.some((alias: string) =>
                        alias.toLowerCase().includes(value.toLowerCase())
                    )
                );
            });

            if (returnResult) {
                return filteredProducts
            } else {
                setProducts(filteredProducts);
            }
        }
    };

    const selectCategory = (index: number) => {
        const selected = itemsRef.current[index];
        setActiveIndex(index);
        selected?.measure((x) => {
            scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCategoryChanged(categories[index].name);
    };

    useEffect(() => {
        console.log("Labels: ", labels);
    }, [labels]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                {/* <Text className="font-bold text-2xl pl-4 mt-4 mb-2">Welcome, {user.firstName}</Text> */}
                <View style={styles.actionRow}>
                    <View className="relative">
                        <TextInput
                            style={styles.searchBtn}
                            onChangeText={handleSearch}
                            value={searchTerm}
                            placeholder="Search products"
                        />
                        <TouchableOpacity
                            className="absolute right-4 top-3"
                            onPress={pickImage}
                        >
                            <FontAwesome5
                                name="camera"
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                    </View>
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
                            <MaterialCommunityIcons
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
        // height: 170,
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
