const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// Caminho para o banco simulado
const DB_PATH = path.join(__dirname, "netlify", "database.json");

// Endpoints (copie seu código atual do login.js, register.js etc.)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const user = data.users[email];

  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  if (user.password !== password) return res.status(401).json({ error: "Senha incorreta" });

  res.json({ message: "Login bem-sucedido" });
});

// Repita isso para /api/register, /api/save-user-data etc.

// Servir o front-end (build Vite)
app.use(express.static(path.join(__dirname, "dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
