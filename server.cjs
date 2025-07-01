const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'database.json');

// Função para ler JSON
function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Função para salvar JSON
function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Rota: login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const data = readDB();
  const user = data.users[email];
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (user.password !== password) return res.status(401).json({ error: 'Senha incorreta' });
  res.json({ user: { id: email, name: user.name, email, points: user.points || 0 }, userData: user });
});

// Rota: register
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  const data = readDB();
  if (data.users[email]) return res.status(400).json({ error: 'Usuário já existe' });

  data.users[email] = { name, password, points: 0, routes: [], notes: [] };
  saveDB(data);
  res.json({ user: { id: email, name, email, points: 0 }, userData: data.users[email] });
});

// Rota: update points
app.post('/api/update-points', (req, res) => {
  const { email, points } = req.body;
  const data = readDB();
  if (!data.users[email]) return res.status(404).json({ error: 'Usuário não encontrado' });

  data.users[email].points = (data.users[email].points || 0) + points;
  saveDB(data);
  res.json(data.users[email]);
});

// Rota: save user data (routes, notes etc)
app.post('/api/save-user-data', (req, res) => {
  const { email, newData } = req.body;
  const data = readDB();
  if (!data.users[email]) return res.status(404).json({ error: 'Usuário não encontrado' });

  data.users[email] = { ...data.users[email], ...newData };
  saveDB(data);
  res.json(data.users[email]);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
