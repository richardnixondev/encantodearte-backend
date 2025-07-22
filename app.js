// ℹ️ Load environment variables
require("dotenv").config();



// ℹ️ Connect to MongoDB
require("./db");

// Core modules
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Custom config (logger, parsers, etc.)
require("./config")(app);

// Routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

app.use("/users", require("./routes/userRoutes"));

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/orders", orderRoutes);

//local files for images
const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Error handling (deve vir depois das rotas)
require("./error-handling")(app);

// Export app for use in server.js
module.exports = app;
