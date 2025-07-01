const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body);
  const dbPath = path.resolve(__dirname, '../../database.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (data.users[email]) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Usuário já existe' }) };
  }

  data.users[email] = { name, password, points: 0, routes: [], notes: [] };
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({
      user: { id: email, name, email, points: 0 },
      userData: data.users[email],
    }),
  };
};
