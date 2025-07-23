const path = require("path");
const express = require("express");
const app = require("./app");

// ℹ️ Sets the PORT from .env or defaults to 5005
const PORT = process.env.PORT || 5005;

// Serve static files from React/Vite build folder in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
