const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./features/tasks");
const userRoutes = require("./features/user");
const authRoutes = require("./features/auth");

// use set methods to improve timecomplexity from O(n) to O(1)
const allowedOrigins = new Set(
  (process.env.FRONTEND_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// test server
app.get("/health", (req, res) => {
  res.send("Server is Working ");
});

module.exports = app;
