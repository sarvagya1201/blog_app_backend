const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database is connected successfully!");
    } catch (err) {
        console.log(err);
    }
};

// Initialize Express app
const app = express();

// Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));


// Static files
app.use("/images", express.static(path.join(__dirname, "/images")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images");
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img);
    }
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Image has been uploaded successfully!");
});

// Start server
app.listen(process.env.PORT, () => {
    connectDB();
    console.log("App is running on port " + process.env.PORT);
});
