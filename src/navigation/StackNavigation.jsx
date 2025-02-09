import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/Home";
import { useColorScheme } from "react-native";
import TabNavigation from "./TabNavigation";
import OCRScannerScreen from "../screen/OcrScanner";
import { StatusBar } from "expo-status-bar";
import BooksScreen from "../screen/Books";

const Stack = createStackNavigator();

const StackNavigation = () => {
	const colorScheme = useColorScheme();

	return (
		<>
			<StatusBar />
			<Stack.Navigator
				// initialRouteName="Tabs"
				screenOptions={{
					headerShown: false,
					cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
				}}
			>
				<Stack.Screen name="Tabs" component={TabNavigation} />
				<Stack.Screen name="OcrScanner" component={OCRScannerScreen} />
				<Stack.Screen name="BooksScreen" component={BooksScreen} />
				{/* <Stack.Screen name="Tabs" component={TabNavigator} /> */}
			</Stack.Navigator>
		</>
	);
};

export default StackNavigation;
