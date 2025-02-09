import React, { useRef } from "react";
import { View, Text, Image, FlatList, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.65;
const ITEM_HEIGHT = 250;
const SPACING = 10;
const INACTIVE_SCALE = 0.8;
const INACTIVE_OPACITY = 0.5;
const ROTATION_ANGLE = "15deg"; // Angle for bending effect

const movies = [
    {
        id: "1",
        title: "KAĞITTAN HAYATLAR",
        image: "https://via.placeholder.com/300x400",
        rating: "IMDb 7.0",
    },
    {
        id: "2",
        title: "Movie 2",
        image: "https://via.placeholder.com/300x400",
        rating: "IMDb 8.0",
    },
    {
        id: "3",
        title: "Movie 3",
        image: "https://via.placeholder.com/300x400",
        rating: "IMDb 6.9",
    },
];

const MovieCarousel = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);

    const renderItem = ({ item, index }) => {
        const inputRange = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [INACTIVE_SCALE, 1, INACTIVE_SCALE],
            extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [INACTIVE_OPACITY, 1, INACTIVE_OPACITY],
            extrapolate: "clamp",
        });

        // **Bending effect for items not in view**
        const rotateY = scrollX.interpolate({
            inputRange,
            outputRange: ["-20deg", "0deg", "10deg"],
            extrapolate: "clamp",
        });

        return (
            <View style={styles.itemContainer}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            transform: [{ scale }, { rotateY }],
                            opacity,
                        },
                    ]}
                >
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Feature Movies</Text>
            <Animated.FlatList
                ref={flatListRef}
                data={movies}
                horizontal
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: width * 0.15 }}
                renderItem={renderItem}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingTop: 50,
    },
    heading: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
        marginBottom: 10,
    },
    itemContainer: {
        width: ITEM_WIDTH + SPACING,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        backgroundColor: "#1C1C1E",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    image: {
        width: "100%",
        height: "80%",
        borderRadius: 10,
    },
    title: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5,
        textAlign: "center",
    },
    ratingContainer: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "gold",
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    rating: {
        fontSize: 12,
        fontWeight: "bold",
        color: "black",
    },
});

export default MovieCarousel;
