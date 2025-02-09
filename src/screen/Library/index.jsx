import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For star icon
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PADDING = StatusBar.currentHeight;

const LibraryScreen = () => {
	const [books, setBooks] = useState([]);
	const [savedText, setSavedText] = useState("");

	useEffect(() => {
		getText();
	}, []);

	useEffect(() => {
		if (savedText.trim()) {
			fetchBooks(savedText);
		}
	}, [savedText]);

	const getText = async () => {
		try {
			const value = await AsyncStorage.getItem("savedText");
			// if (value !== null) {
				setSavedText(value || 'web development');
			// }
		} catch (error) {
			console.error("Error retrieving text:", error);
		}
	};

	const fetchBooks = async (query) => {
		try {
			const response = await axios.get(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(query)}`);

			const booksData =
				response.data.items?.map((item) => ({
					id: item.id,
					title: item.volumeInfo.title || "Unknown Title",
					authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
					description: item.volumeInfo.description || "No description available.",
					thumbnail: item.volumeInfo.imageLinks?.thumbnail.replace("http", "https") || item.volumeInfo.imageLinks?.smallThumbnail.replace("http", "https") || null,
					rating: item.volumeInfo.averageRating || Math.random() * 2 + 7, // Fake rating if missing
				})) || [];

			setBooks(booksData);
		} catch (error) {
			console.error("Error fetching books:", error.response?.data || error.message);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.heading}>My Library</Text>

			{/* Category Selection (Mocked for now) */}
			{/* <View style={styles.tabs}>
				<TouchableOpacity style={styles.activeTab}>
					<Text style={styles.tabText}>Scanned Books</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.inactiveTab}>
					<Text style={styles.tabText}>Saved</Text>
				</TouchableOpacity>
			</View> */}

			{/* Books List */}
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
	container: { flex: 1, backgroundColor: "#121212", padding: PADDING / 2 },
	heading: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 25 },
	tabs: { flexDirection: "row", marginBottom: 15 },
	activeTab: { backgroundColor: "#444", padding: 10, borderRadius: 10, marginRight: 10 },
	inactiveTab: { backgroundColor: "#222", padding: 10, borderRadius: 10 },
	tabText: { color: "#fff", fontSize: 16 },
	card: { flexDirection: "row", backgroundColor: "#1E1E1E", padding: 10, borderRadius: 10, marginBottom: 10 },
	thumbnail: { width: 90, height: 140, marginRight: 10, borderRadius: 10 },
	bookTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
	bookAuthor: { color: "#bbb", fontSize: 14, marginBottom: 5 },
	ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
	rating: { color: "#FFD700", fontSize: 14, marginLeft: 5 },
	bookDescription: { color: "#ccc", fontSize: 12, marginTop: 5, lineHeight: 18 },
});

export default LibraryScreen;
