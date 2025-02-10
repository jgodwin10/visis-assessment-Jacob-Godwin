import React, { useState } from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet } from "react-native";
import useKeyboard from "../hooks/useKeyboard";

export const CustomTabBar = ({ state, descriptors, navigation }) => {
	const keyboard = useKeyboard();

	return (
		<View style={[styles.tabBarContainer, { display: keyboard ? "none" : "" }]}>
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
		// display:
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
});
