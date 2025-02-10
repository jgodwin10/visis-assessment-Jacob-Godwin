import React, { useState } from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screen/Home";
import LibraryScreen from "../screen/Library";
import { CustomTabBar } from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();

const ProfileScreen = () => (
	<View style={styles.screen}>
		<Text style={styles.screenText}>Profile Screen</Text>
	</View>
);

export default function App() {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: { display: "none" },
				tabBarShowLabel: false,
				// tabBarStyle: [styles.tabBarStyle, { display: keyboard ? "none" : "", backgroundColor: colors.primary }],
			}}
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ focused }) => <Ionicons name="home" size={24} color={focused ? "gold" : "gray"} />,
				}}
			/>
			<Tab.Screen
				name="Library"
				component={LibraryScreen}
				options={{
					tabBarIcon: ({ focused }) => <Ionicons name="book" size={24} color={focused ? "gold" : "gray"} />,
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ focused }) => <FontAwesome6 name="user" size={24} color={focused ? "gold" : "gray"} />,
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#1a1a1a",
	},
	screenText: {
		color: "#fff",
		fontSize: 20,
	},
});
