import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

const useFetch = () => {
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const data = ["web development", "react js", "software development", "javascript", "medicine", "children", "things fall apart", "geology", "eye defect"];

	const getRandomNumber = () => Math.floor(Math.random() * 10);

	// console.log(); // Example output: 3

	//Save text after it's being scanned
	const saveText = async (inputText) => {
		try {
			await AsyncStorage.setItem("savedText", inputText);
			console.log("saved");
		} catch (error) {
			console.error("Error saving text:", error);
		}
	};

	const fetchBooks = async (query) => {
		try {
			setLoading(true);
			const response = await axios.get(`${GOOGLE_BOOKS_API_URL}${encodeURIComponent(query || data[getRandomNumber()])}`);

			if (query) await saveText(query);

			const booksData =
				response.data.items?.map((item) => ({
					id: item.id,
					title: item.volumeInfo.title || "Unknown Title",
					authors: item.volumeInfo.authors?.join(", ") || "Unknown Author",
					description: item.volumeInfo.description || "No description available.",
					thumbnail: item.volumeInfo.imageLinks?.thumbnail.replace("http", "https") || item.volumeInfo.imageLinks?.smallThumbnail.replace("http", "https") || null,
					rating: item.volumeInfo.averageRating || Math.random() * 2 + 7, // Fake rating if missing
				})) || [];

			console.log(booksData);
			setSuccess(true);
			setBooks(booksData);
		} catch (error) {
			setError(true);
			console.error("Error fetching books:", error.response?.data || error.message);
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setError(false);
		setSuccess(false);
	};
	// const resetSuccess = () => ;

	return { fetchBooks, books, error, reset, loading, success };
};

export default useFetch;
