import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import useFetch from "../../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";

const OCRScannerScreen = () => {
	const navigation = useNavigation();
	const [hasPermission, setHasPermission] = useState(null);
	const [imageUri, setImageUri] = useState(null);
	const [text, setText] = useState("");
	const { fetchBooks, books, success, loading, error, reset } = useFetch();

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

	if (error) {
		Alert.alert("Error fetching books", "There was an error finding the Book you scanned, re-scan again", [{ text: "OK", onPress: reset }], { cancelable: false });
	}

	if (success) {
		navigation.navigate("BooksScreen", { books: books });
		reset();
	}

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

	//fetch book data from google books aoi
	// const fetchBooks = async (query) => {
	// 	try {
	// 		setLoading(true);
	// 		const response = await axios.get(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(query)}`);

	// 		await saveText(query);

	// 		const booksData =
	// 			response.data.items?.map((item) => ({
	// 				id: item.id,
	// 				title: item.volumeInfo.title || "Unknown Title",
	// 				authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
	// 				description: item.volumeInfo.description || "No description available.",
	// 				thumbnail: item.volumeInfo.imageLinks?.thumbnail.replace("http", "https") || item.volumeInfo.imageLinks?.smallThumbnail.replace("http", "https") || null,
	// 				rating: item.volumeInfo.averageRating || Math.random() * 2 + 7, // Fake rating if missing
	// 			})) || [];

	// 		// Navigate to BooksScreen and pass data
	//
	// 	} catch (error) {
	// 		Alert.alert("Error fetching books", "There was an error finding the Book you scanned, re-scan again");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

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
					{loading ? <ActivityIndicator size={"small"} /> : <Text>{imageUri ? "Scan Again" : "Capture & Recognize"}</Text>}
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default OCRScannerScreen;
