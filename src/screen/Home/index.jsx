import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, FlatList, Animated, StyleSheet, Dimensions, TextInput, StatusBar } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.65;
const ITEM_HEIGHT = height / 2;
const SPACING = 10;
const INACTIVE_SCALE = 0.8;
const INACTIVE_OPACITY = 0.5;

const PADDING = StatusBar.currentHeight;

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const HomeScreen = ({ navigation }) => {
	const scrollX = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef(null);
	const [query, setQuery] = useState("");
	const [books, setBooks] = useState([]);

	useEffect(() => {
		fetchBooks("web development");
	}, []);

	useEffect(() => {
		fetchBooks(query || "web development");
	}, [query]);

	const fetchBooks = async (query) => {
		try {
			const response = await axios.get(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(query)}`);

			const booksData =
				response.data.items?.map((item) => ({
					id: item.id,
					title: item.volumeInfo.title || "Unknown Title",
					image: item.volumeInfo.imageLinks?.thumbnail.replace("http", "https") || item.volumeInfo.imageLinks?.smallThumbnail.replace("http", "https") || null,
					rating: item.volumeInfo.averageRating || Math.random() * 2 + 7, // Fake rating if missing
				})) || [];

			setBooks(booksData);
		} catch (error) {
			console.error("Error fetching books:", error.response?.data || error.message);
		}
	};

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

		return (
			<View style={styles.itemContainer}>
				<Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
					<Image source={{ uri: item.image }} style={styles.image} />
					<Text style={styles.title}>{item.title}</Text>
					<View style={styles.ratingContainer}>
						<Text style={styles.rating}>{item.rating ? item.rating.toFixed(1) : "N/A"}</Text>
					</View>
				</Animated.View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.top}>
				<View>
					<Text style={styles.heading}>Hello User!</Text>
					<Text style={styles.headSub}>Find Your Favourite Books Here!</Text>
				</View>

				<MaterialCommunityIcons onPress={() => navigation.navigate("OcrScanner")} name="qrcode-scan" size={24} color="white" />
			</View>
			<View style={styles.searchContainer}>
				<Ionicons name="search" size={20} color="gray" style={styles.icon} />
				<TextInput style={styles.input} placeholder="Search books..." placeholderTextColor="gray" value={query} onChangeText={setQuery} />
			</View>

			<View style={styles.featureContainer}>
				<Text style={styles.featureText}>Featured Books</Text>
			</View>

			<Animated.FlatList
				ref={flatListRef}
				data={books}
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
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		paddingTop: PADDING / 2,
	},
	heading: {
		color: "white",
		fontSize: 20,
		fontFamily: "Bold",
		marginLeft: 20,
		marginBottom: 10,
	},
	headSub: {
		color: "white",
		fontSize: 14,
		fontFamily: "Light",
		marginLeft: 20,
		marginBottom: 10,
	},
	itemContainer: {
		width: ITEM_WIDTH + SPACING,
		alignItems: "center",
		// justifyContent: "center",
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
		// paddingTop: 20,
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
		borderRadius: 5,
		// marginBottom: 20,
	},
	rating: {
		fontSize: 12,
		fontWeight: "bold",
		color: "black",
	},
	top: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginRight: 25,
		marginBottom: 10,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1E1E1E", // Search Bar Background Color
		borderRadius: 15,
		paddingHorizontal: 20,
		paddingVertical: 14,
		marginHorizontal: 20,
		marginBottom: 10,
		marginTop: 10,
	},
	icon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		color: "white",
		fontSize: 16,
	},
	featureContainer: {
		marginHorizontal: 20,
		marginTop: 20,
		marginBottom: 40,
	},
	featureText: {
		color: "white",
		fontFamily: "Bold",
		fontSize: 24,
	},
});

export default HomeScreen;
