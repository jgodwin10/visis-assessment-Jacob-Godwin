import React, { useState } from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screen/Home";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
	return (
		<View style={styles.tabBarContainer}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

				const Icon = options.tabBarIcon;
				const isFocused = state.index === index;

				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});

					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};

				return (
					<TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
						<View style={styles.iconContainer}>
							<Icon focused={isFocused} />
						</View>
						{/* {isFocused && <Text style={styles.label}>{label}</Text>} */}
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const VideoScreen = () => (
	<View style={styles.screen}>
		<Text style={styles.screenText}>Video Screen</Text>
	</View>
);

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
				name="Video"
				component={VideoScreen}
				options={{
					tabBarIcon: ({ focused }) => <Ionicons name="videocam" size={24} color={focused ? "gold" : "gray"} />,
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarIcon: ({ focused }) => <Ionicons name="person" size={24} color={focused ? "gold" : "gray"} />,
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	tabBarContainer: {
		flexDirection: "row",
		height: 60,
		// backgroundColor: "#000",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		position: "absolute",
		paddingHorizontal: 10,
		justifyContent: "space-around",
		alignItems: "center",
		bottom: 10,
		width: "100%",
	},
	tab: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		position: "relative",
	},
	iconContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	label: {
		position: "absolute",
		top: 40,
		backgroundColor: "transparent",
		color: "white",
		fontSize: 14,
		fontWeight: "bold",
	},
	indicator: {
		position: "absolute",
		width: 80, // Width of the indicator for each tab
		height: 40,
		borderRadius: 20,
		backgroundColor: "#1a1a1a",
		borderColor: "gold",
		borderWidth: 2,
		zIndex: -1,
		alignSelf: "center",
		top: 10,
	},
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
