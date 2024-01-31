import React, { useState, useEffect } from "react";
import { View } from "react-native";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import listingsData from "@/assets/data/airbnb-listings.json";
import ListingsMap from "@/components/ListingsMap";
import listingsDataGeo from "@/assets/data/airbnb-listings.geo.json";
import { Stack, useLocalSearchParams } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import appData from "@/assets/data/appData.json";

const Page = () => {
    const [products, setProducts] = useState(appData.products);
    const [markets, setMarkets] = useState(appData.markets);
    const [category, setCategory] = useState<string>("All");
    const [isFiltered, setIsFiltered] = useState(false);
    const params = useLocalSearchParams();

    useEffect(() => {
        console.log("params:", params);
        if (params.filter) {
            const { filter, value } = params;

            if (filter === "price") {
                const parsedPrice = value.split(",");
                const min = parsedPrice[0] || 0;
                const max = parsedPrice[1] || Infinity;
                const filteredProducts = products.filter((product) => {
                    if (product.hasPriceRange) {
                        return (
                            product.minPrice >= min && product.maxPrice <= max
                        );
                    }
                    return product.price >= min && product.price <= max;
                });
                setProducts(filteredProducts);
            }

            if (filter === "market") {
                // const filteredMarkets = markets.filter((market) => market.name.toLowerCase() === market.toLowerCase())
                const filteredProducts = products.filter(
                    (product) =>
                        product.vendor.markets.includes(value.toLowerCase())
                );
                setProducts(filteredProducts);
            }

            if (filter === "vendor") {
                const filteredProducts = products.filter(
                    (product) =>
                        product.vendor.name.toLowerCase() ===
                        value.toLowerCase()
                );
                setProducts(filteredProducts);
            }

            setIsFiltered(true);
        }
    }, [params]);

    const handleCategoryFilter = (category: string) => {
        setCategory(category);

        if (category === "All") {
            setProducts(appData.products);
            setMarkets(appData.markets);
        } else {
            const filteredProducts = appData.products.filter(
                (product) =>
                    product.category.toLowerCase() === category.toLowerCase()
            );
            setProducts(filteredProducts);
        }
    };

    return (
        <View style={{ flex: 1, marginTop: 80 }}>
            <Stack.Screen
                options={{
                    header: () => (
                        <ExploreHeader
                            products={products}
                            setProducts={setProducts}
                            onCategoryChanged={handleCategoryFilter}
                        />
                    ),
                }}
            />
            <ListingsMap listings={markets} />
            <ListingsBottomSheet
                listings={products}
                isFiltered={isFiltered}
                category={category}
            />
        </View>
    );
};

export default Page;
