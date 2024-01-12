import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useRef } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Marker } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import * as Location from "expo-location";

interface Props {
    listings: any;
}

const INITIAL_REGION = {
    latitude: 37.33,
    longitude: -122,
    latitudeDelta: 9,
    longitudeDelta: 9,
};

const ListingsMap = memo(({ listings }: Props) => {
    const router = useRouter();
    const mapRef = useRef<any>(null);

    // When the component mounts, locate the user
    useEffect(() => {
        onLocateMe();
    }, []);

    // When a marker is selected, navigate to the listing page
    const onMarkerSelected = (event) => {
        router.push({
            pathName: "/",
            params: { filter: { market: event.name } },
        });
    };

    // Focus the map on the user's location
    const onLocateMe = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            return;
        }

        let location = await Location.getCurrentPositionAsync({});

        const region = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 7,
            longitudeDelta: 7,
        };

        mapRef.current?.animateToRegion(region);
    };

    // Overwrite the renderCluster function to customize the cluster markers
    const renderCluster = (cluster: any) => {
        const { id, geometry, onPress, properties } = cluster;

        const points = properties.point_count;
        return (
            <Marker
                key={`cluster-${id}`}
                coordinate={{
                    longitude: geometry.coordinates[0],
                    latitude: geometry.coordinates[1],
                }}
                onPress={onPress}
            >
                <View style={styles.marker}>
                    <Text
                        style={{
                            color: "#283106",
                            textAlign: "center",
                            fontFamily: "Rubik",
                        }}
                    >
                        {points}
                    </Text>
                </View>
            </Marker>
        );
    };

    return (
        <View style={defaultStyles.container}>
            <MapView
                ref={mapRef}
                animationEnabled={false}
                style={StyleSheet.absoluteFillObject}
                initialRegion={INITIAL_REGION}
                clusterColor="#DFE0DC1A"
                clusterTextColor="#283106"
                clusterFontFamily="Rubik"
                renderCluster={renderCluster}
            >
                {listings.map((item: any) => (
                    <Marker
                        coordinate={{
                            latitude: item.location.latitude,
                            longitude: item.location.longitude,
                        }}
                        key={item.id}
                        onPress={() => onMarkerSelected(item)}
                    >
                        <View style={styles.marker}>
                            <Text style={styles.markerText}>
                                {item.name}
                            </Text>
                        </View>
                    </Marker>
                ))}
            </MapView>
            <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
                <Ionicons name="navigate" size={24} color={Colors.dark} />
            </TouchableOpacity>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marker: {
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        elevation: 5,
        borderRadius: 12,
        shadowColor: "#283106",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
    markerText: {
        fontSize: 14,
        fontFamily: "Rubik",
    },
    locateBtn: {
        position: "absolute",
        top: 70,
        right: 20,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#283106",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 10,
        },
    },
});

export default ListingsMap;