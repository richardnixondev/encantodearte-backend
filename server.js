const express = require("express");
const path = require("path");
const cors = require("cors");

const app = require("./app");


// Configura CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// Lista de domínios permitidos
const allowedOrigins = [
  "https://encantodearte.com.br",
  "https://encantodearte-frontend.onrender.com"
];


// Servir o front-end buildado do React (assumindo client/dist)
app.use(express.static(path.join(__dirname, "client", "dist")));

// Rota fallback para SPA (React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Define porta
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
