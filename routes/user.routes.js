const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const { isAdmin } = require('../middleware/admin.middleware.js');
const { isAuthenticated } = require("../middleware/jwt.middleware.js");


// GET /users - Lista todos os usuários (apenas para admins)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Não retorna senhas
    res.json(users);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

module.exports = router;