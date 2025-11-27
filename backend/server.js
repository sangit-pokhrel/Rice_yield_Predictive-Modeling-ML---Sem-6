// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes"); 
const cropRoutes = require("./src/routes/cropRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

// middleware
app.use(cors());
app.use(express.json({ limit: "1mb" })); 

app.use(express.urlencoded({ extended: true }));



// routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);

// static (uploads or default avatar)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/crop", cropRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
