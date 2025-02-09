import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./src/screen/Home";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigation from "./src/navigation/StackNavigation";

export default function App() {
	const [loaded] = useFonts({
		SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
		Regular: require("./assets/fonts/Lexend-Regular.ttf"),
		Light: require("./assets/fonts/Lexend-Light.ttf"),
		Bold: require("./assets/fonts/Lexend-Bold.ttf"),
		ExtraBold: require("./assets/fonts/Lexend-ExtraBold.ttf"),
		Medium: require("./assets/fonts/Lexend-Medium.ttf"),
		SemiBold: require("./assets/fonts/Lexend-SemiBold.ttf"),
		Mont: require("./assets/fonts/Montserrat-Medium.ttf"),
		MontBold: require("./assets/fonts/Montserrat-Bold.ttf"),
		MontLight: require("./assets/fonts/Montserrat-LightItalic.ttf"),
	});

	if (!loaded) {
		return null;
	}

	return (
		<NavigationContainer>
			<StackNavigation />
		</NavigationContainer>
	);
}

