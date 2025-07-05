const app = require("./app");

// ℹ️ Sets the PORT from .env or defaults to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
