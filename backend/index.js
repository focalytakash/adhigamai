require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const moment = require("moment");
const flash = require("connect-flash");
const session = require("cookie-session");
const expSanitizer = require("express-sanitizer");
const path = require("path");
const http = require("http");
const fileupload = require("express-fileupload");
const tunnel = require("tunnel-ssh");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8081;
const env = process.env.NODE_ENV || "development";

const sess = {
	name: "session",
	keys: [process.env.SESSION_SECRET || "adhigamai-dev-secret"],
	maxAge: 24 * 60 * 60 * 1000,
};

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "15mb" }));
app.use(expSanitizer());
app.use(cookieParser());
app.use(session(sess));
app.use(flash());
app.use(
	fileupload({
		limits: { fileSize: 15 * 1024 * 1024 },
		abortOnLimit: true,
	})
);
app.use(express.static(path.resolve(__dirname, "public")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

if (env !== "production") {
	app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
	res.json({
		status: true,
		message: "OK",
		time: moment().toISOString(),
		requestId: uuidv4(),
	});
});

app.use((req, res) => {
	res.status(404).json({ status: false, message: "Page not found!" });
});

async function start() {
	try {
		await connectDB();
	} catch (err) {
		console.error("MongoDB connection failed:", err.message);
		console.error(
			"Server will start without DB. Set MONGO_URI in .env and ensure MongoDB is running."
		);
	}

	server.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
}

start();

// Kept available for routes/helpers that need them later
module.exports = { app, server, mongoose, moment, axios, tunnel, uuidv4 };
