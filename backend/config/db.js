const mongoose = require("mongoose");

async function connectDB() {
	const uri = process.env.MONGO_URI;
	if (!uri) {
		throw new Error("MONGO_URI is not set in .env");
	}

	await mongoose.connect(uri, {
		serverSelectionTimeoutMS: 5000,
	});
	console.log("Connected to MongoDB");
}

module.exports = connectDB;
