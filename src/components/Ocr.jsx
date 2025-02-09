import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";

const OCRScanner = () => {
	const [hasPermission, setHasPermission] = useState(null);
	const [imageUri, setImageUri] = useState(null);
	const [text, setText] = useState("");
	const cameraRef = useRef(null);

	React.useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	const captureAndRecognizeText = async () => {
		if (cameraRef.current) {
			const photo = await cameraRef.current.takePictureAsync();
			setImageUri(photo.uri);

			try {
				const result = await TextRecognition.recognize(photo.uri);
				setText(result.text);
			} catch (error) {
				console.error("Text Recognition Error:", error);
			}
		}
	};

	if (hasPermission === null) return <Text>Requesting Camera Permission...</Text>;
	if (hasPermission === false) return <Text>No Access to Camera</Text>;

	return (
		<View style={{ flex: 1 }}>
			{imageUri ? (
				<>
					<Image source={{ uri: imageUri }} style={{ width: 300, height: 400 }} />
					<Text>{text || "No text detected"}</Text>
					<TouchableOpacity onPress={() => setImageUri(null)}>
						<Text>Scan Again</Text>
					</TouchableOpacity>
				</>
			) : (
				<Camera style={{ flex: 1 }} ref={cameraRef} />
			)}
			<TouchableOpacity onPress={captureAndRecognizeText}>
				<Text>Capture & Recognize</Text>
			</TouchableOpacity>
		</View>
	);
};

export default OCRScanner;
