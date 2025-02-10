import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Image, FlatList, Animated, StyleSheet, Dimensions, TextInput, StatusBar } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetch from "../../hooks/useFetch";
import { styles } from "./styles";
import { RefreshControl } from "react-native";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = width * 0.65;
const SPACING = 10;
const INACTIVE_SCALE = 0.8;
const INACTIVE_OPACITY = 0.5;

const HomeScreen = ({ navigation }) => {
	const { fetchBooks, books } = useFetch();
	const scrollX = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef(null);
	const [query, setQuery] = useState("");
	const [refreshing, setRefreshing] = useState(false);

	//fetch data using query (web development) on component mount
	useEffect(() => {
		fetchBooks();
	}, []);

	//fetch a queried/searched data
	useEffect(() => {
		fetchBooks(query);
	}, [query]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchBooks();
		setRefreshing(false);
	}, []);

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
					<Image source={{ uri: item.thumbnail }} style={styles.image} />
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
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			/>
		</SafeAreaView>
	);
};

export default HomeScreen;
