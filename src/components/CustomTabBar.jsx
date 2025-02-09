import React, { useState } from "react";
import { View, Text, Animated, TouchableOpacity, StyleSheet } from "react-native";

export const CustomTabBar = ({ state, descriptors, navigation }) => {
	const [indicatorPosition] = useState(new Animated.Value(0));

	const indicatorTranslate = indicatorPosition.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 120], // Adjust based on tab width
	});

	// Animate indicator position on tab change
	React.useEffect(() => {
		Animated.timing(indicatorPosition, {
			toValue: state.index,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [state.index]);

	return (
		<View style={styles.tabBarContainer}>
			<Animated.View
				style={[
					styles.indicator,
					{
						transform: [{ translateX: indicatorTranslate }],
					},
				]}
			/>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

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
						<Text style={[styles.tabText, isFocused && styles.activeTabText]}>{label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	tabBarContainer: {
		flexDirection: "row",
		backgroundColor: "#2a2a2a",
		borderRadius: 20,
		marginHorizontal: 20,
		marginBottom: 20,
		position: "relative",
		height: 50,
	},
	tab: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	tabText: {
		color: "#aaa",
		fontSize: 16,
		fontWeight: "500",
	},
	activeTabText: {
		color: "#fff",
	},
	indicator: {
		position: "absolute",
		width: 120, // Tab width
		height: "100%",
		backgroundColor: "#444",
		borderRadius: 20,
		zIndex: -1,
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
