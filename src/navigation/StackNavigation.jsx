import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screen/Home";
import { useColorScheme } from "react-native";
import TabNavigation from "./TabNavigation";

const Stack = createStackNavigator();

const StackNavigation = () => {
	const colorScheme = useColorScheme();

	return (
		<Stack.Navigator
			// initialRouteName="Tabs"
			screenOptions={{
				headerShown: false,
				cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid,
			}}
		>
			<Stack.Screen name="Tabs" component={TabNavigation} />
			{/* <Stack.Screen name="Auth" component={AuthNavigator} />
				<Stack.Screen name="Tabs" component={TabNavigator} /> */}
		</Stack.Navigator>
	);
};

export default StackNavigation;
