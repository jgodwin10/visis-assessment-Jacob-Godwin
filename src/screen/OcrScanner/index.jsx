import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const OCRScannerScreen = ({ navigation }) => {
	const [hasPermission, setHasPermission] = useState(null);
	const [imageUri, setImageUri] = useState(null);
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);
	const cameraRef = useRef(null);

	// checks for camera permissions
	React.useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	//refetch book when a new text is scanned
	React.useEffect(() => {
		if (text.trim()) {
			fetchBooks(text || "web");
		}
	}, [text]);

	//Save text after it's being scanned
	const saveText = async (inputText) => {
		try {
			await AsyncStorage.setItem("savedText", inputText);
			console.log("saved");
		} catch (error) {
			console.error("Error saving text:", error);
		}
	};

	//scan text using react native ml kit
	const captureAndRecognizeText = async () => {
		if (!imageUri) {
			if (cameraRef.current) {
				const photo = await cameraRef.current.takePictureAsync();
				setImageUri(photo.uri);

				try {
					const result = await TextRecognition.recognize(photo.uri);

					//save the scanned text
					setText(result?.text);
				} catch (error) {
					console.error("Text Recognition Error:", error);
				}
			}
		} else {
			//reset everything (image and text)
			setImageUri(null);
			setText("");
		}
	};

	// fetch book data from google books api
	const fetchBooks = async (query) => {
		try {
			setLoading(true);
			const response = await axios.get(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(query)}`);

			await saveText(query);

			const booksData =
				response.data.items?.map((item) => ({
					id: item.id,
					title: item.volumeInfo.title || "Unknown Title",
					authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
					description: item.volumeInfo.description || "No description available.",
					thumbnail: item.volumeInfo.imageLinks?.thumbnail.replace("http", "https") || item.volumeInfo.imageLinks?.smallThumbnail.replace("http", "https") || null,
					rating: item.volumeInfo.averageRating || Math.random() * 2 + 7, // Fake rating if missing
				})) || [];

			// Navigate to BooksScreen and pass data

			if (booksData.length > 0) {
				navigation.navigate("BooksScreen", { books: booksData });
			} else {
				throw new Error("There was an error finding the Book you scanned, re-scan again");
			}
		} catch (error) {
			Alert.alert("Error fetching books", "There was an error finding the Book you scanned, re-scan again");
		} finally {
			setLoading(false);
		}
	};

	if (hasPermission === null) return <Text>Requesting Camera Permission...</Text>;
	if (hasPermission === false) return <Text>No Access to Camera</Text>;

	return (
		<View style={{ flex: 1 }}>
			{imageUri ? (
				<>
					<Image source={{ uri: imageUri }} style={{ width: "100%", height: "100%", flex: 1 }} />
					{/* <Text>{text || "No text detected"}</Text> */}
				</>
			) : (
				<CameraView style={{ flex: 1, width: "100%", height: "100%" }} ref={cameraRef} />
			)}
			<View style={{ position: "absolute", bottom: 70, width: "100%", left: 0, justifyContent: "center", alignItems: "center", height: 20 }}>
				<TouchableOpacity
					style={{ backgroundColor: "gold", height: 40, justifyContent: "center", alignItems: "center", paddingHorizontal: 15, borderRadius: 20, elevation: 20 }}
					onPress={captureAndRecognizeText}
				>
					{loading ? <ActivityIndicator size={"small"} /> : <Text>{imageUri ? "Scan Again" : "Capture & Recognize"}</Text>}
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default OCRScannerScreen;
