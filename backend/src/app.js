const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./features/tasks");
const userRoutes = require("./features/user");
const authRoutes = require("./features/auth");

// creating the express app
const app = express();

// to clean and manage the frontend urls
const cleanOrigin = (origin = "") => origin.trim().replace(/\/+$/, "").toLowerCase();
const allowedOrigins = new Set((process.env.FRONTEND_URLS || "").split(",").map(cleanOrigin).filter(Boolean));

app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(cleanOrigin(origin))),
  credentials: true,
}));

// to enalble cookie data usage
app.use(cookieParser());

// to enable the reading of request body 
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// test server
app.get("/api/health", (req, res) => {
  res.send("Server is Working ");
});

module.exports = app;
