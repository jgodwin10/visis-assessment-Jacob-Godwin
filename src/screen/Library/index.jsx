import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For star icon
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetch from "../../hooks/useFetch";

const PADDING = StatusBar.currentHeight;

const LibraryScreen = () => {
	const [savedText, setSavedText] = useState("");

	const { fetchBooks, books } = useFetch();

	useEffect(() => {
		getText();
	}, []);

	useEffect(() => {
		// if (savedText?.trim()) {
		fetchBooks(savedText);
		// }
	}, [savedText]);

	const getText = async () => {
		try {
			const value = await AsyncStorage.getItem("savedText");

			setSavedText(value);
		} catch (error) {
			console.error("Error retrieving text:", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.heading}>My Library</Text>

			<FlatList
				data={books}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.card}>
						{item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
						<View style={{ flex: 1 }}>
							<Text style={styles.bookTitle}>{item.title}</Text>
							<Text style={styles.bookAuthor}>By {item.authors}</Text>

							{/* Rating Section */}
							<View style={styles.ratingContainer}>
								<Ionicons name="star" size={16} color="#FFD700" />
								<Text style={styles.rating}>{item.rating ? item.rating.toFixed(1) : "N/A"}</Text>
							</View>

							{/* Description */}
							<Text style={styles.bookDescription} numberOfLines={3}>
								{item.description}
							</Text>
						</View>
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#121212", paddingTop: PADDING / 2, paddingBottom: 70, paddingHorizontal: 20 },
	heading: { color: "#fff", fontSize: 22, fontFamily: "Bold", paddingBottom: 25 },
	tabs: { flexDirection: "row", marginBottom: 15 },
	activeTab: { backgroundColor: "#444", padding: 10, borderRadius: 10, marginRight: 10 },
	inactiveTab: { backgroundColor: "#222", padding: 10, borderRadius: 10 },
	tabText: { color: "#fff", fontSize: 16 },
	card: { flexDirection: "row", backgroundColor: "#1E1E1E", padding: 10, borderRadius: 10, marginBottom: 10 },
	thumbnail: { width: 90, height: 140, marginRight: 10, borderRadius: 10 },
	bookTitle: { color: "#fff", fontSize: 18, fontFamily: "Bold" },
	bookAuthor: { color: "#bbb", fontSize: 14, marginBottom: 5 },
	ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
	rating: { color: "#FFD700", fontSize: 14, marginLeft: 5 },
	bookDescription: { color: "#ccc", fontSize: 12, marginTop: 5, lineHeight: 18 },
});

export default LibraryScreen;
