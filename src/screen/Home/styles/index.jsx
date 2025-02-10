import { StatusBar } from "react-native";
import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const SPACING = 10;
const ITEM_WIDTH = width * 0.65;
const ITEM_HEIGHT = height / 2;

const PADDING = StatusBar.currentHeight;

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		paddingTop: PADDING / 2,
	},
	heading: {
		color: "white",
		fontSize: 20,
		fontFamily: "Bold",
		marginLeft: 20,
		marginBottom: 10,
	},
	headSub: {
		color: "white",
		fontSize: 14,
		fontFamily: "Light",
		marginLeft: 20,
		marginBottom: 10,
	},
	itemContainer: {
		width: ITEM_WIDTH + SPACING,
		alignItems: "center",
		// justifyContent: "center",
	},
	card: {
		width: ITEM_WIDTH,
		height: ITEM_HEIGHT,
		backgroundColor: "#1C1C1E",
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	image: {
		width: "100%",
		height: "80%",
		borderRadius: 10,
		// paddingTop: 20,
	},
	title: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 5,
		textAlign: "center",
	},
	ratingContainer: {
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: "gold",
		paddingVertical: 3,
		paddingHorizontal: 8,
		borderRadius: 5,
		// marginBottom: 20,
	},
	rating: {
		fontSize: 12,
		fontWeight: "bold",
		color: "black",
	},
	top: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginRight: 25,
		marginBottom: 10,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1E1E1E", // Search Bar Background Color
		borderRadius: 15,
		paddingHorizontal: 20,
		paddingVertical: 14,
		marginHorizontal: 20,
		marginBottom: 10,
		marginTop: 10,
	},
	icon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		color: "white",
		fontSize: 16,
	},
	featureContainer: {
		marginHorizontal: 20,
		marginTop: 20,
		marginBottom: 40,
	},
	featureText: {
		color: "white",
		fontFamily: "Bold",
		fontSize: 24,
	},
});
