// ℹ️ Load environment variables
require("dotenv").config();

// ℹ️ Connect to MongoDB
require("./db");

// Core modules
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // 👈 Deve vir depois da criação do app
app.use(express.json()); // Necessário para JSON requests

// Custom config (logger, parsers, etc.)
require("./config")(app);

// Routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/orders", orderRoutes);

// Error handling (deve vir depois das rotas)
require("./error-handling")(app);

// Export app for use in server.js
module.exports = app;
