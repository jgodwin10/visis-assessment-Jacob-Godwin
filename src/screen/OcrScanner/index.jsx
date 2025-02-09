import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { CameraView, Camera } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import axios from "axios";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const OCRScannerScreen = ({ navigation }) => {
	const [hasPermission, setHasPermission] = useState(null);
	const [imageUri, setImageUri] = useState(null);
	const [text, setText] = useState("");
	const [books, setBooks] = useState([]);
	const cameraRef = useRef(null);

	React.useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	React.useEffect(() => {
		console.log(text);
		fetchBooks(text || "web");
	}, [text]);

	const captureAndRecognizeText = async () => {
		if (!imageUri) {
			if (cameraRef.current) {
				const photo = await cameraRef.current.takePictureAsync();
				setImageUri(photo.uri);

				try {
					const result = await TextRecognition.recognize(photo.uri);

					console.log(result.text);
					setText(result?.text);
				} catch (error) {
					console.error("Text Recognition Error:", error);
				}
			}
		} else {
			setImageUri(null);
		}
	};

	const fetchBooks = async (query) => {
		try {
			console.log("hello");
			const response = await axios.get(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(query)}`);
			console.log(response.data.items[0].volumeInfo.imageLinks);
			setBooks(response.data.items || []);

			const booksData =
				response.data.items?.map((item) => ({
					id: item.id,
					title: item.volumeInfo.title || "Unknown Title",
					authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
					description: item.volumeInfo.description || "No description available.",
					thumbnail: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail || null,
					rating: item.volumeInfo.averageRating || Math.random() * 2 + 7, // Fake rating if missing
				})) || [];

			// Navigate to BooksScreen and pass data
			navigation.navigate("BooksScreen", { books: booksData });

			// setText("");
		} catch (error) {
			console.error("Error fetching books:", error.response?.data || error.message);
		}
	};

	if (hasPermission === null) return <Text>Requesting Camera Permission...</Text>;
	if (hasPermission === false) return <Text>No Access to Camera</Text>;

	return (
		<View style={{ flex: 1 }}>
			{imageUri ? (
				<>
					<Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%" }} />
					{/* <Text>{text || "No text detected"}</Text> */}
				</>
			) : (
				<CameraView style={{ flex: 1 }} ref={cameraRef} />
			)}
			<View style={{ position: "absolute", bottom: 70, width: "100%", left: 0, justifyContent: "center", alignItems: "center", height: 20 }}>
				<TouchableOpacity
					style={{ backgroundColor: "gold", height: 40, justifyContent: "center", alignItems: "center", paddingHorizontal: 15, borderRadius: 20, elevation: 20 }}
					onPress={captureAndRecognizeText}
				>
					<Text>{imageUri ? "Scan Again" : "Capture & Recognize"}</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default OCRScannerScreen;
