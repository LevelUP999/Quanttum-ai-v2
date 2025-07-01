const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const dbPath = path.resolve(__dirname, '../../database.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const user = data.users[email];
  if (!user) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Usuário não encontrado' }) };
  }

  if (user.password !== password) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Senha incorreta' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      user: { id: email, name: user.name, email, points: user.points || 0 },
      userData: user
    }),
  };
};
