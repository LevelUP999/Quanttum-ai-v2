const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  const { email, points } = JSON.parse(event.body);
  const dbPath = path.resolve(__dirname, '../../database.json');
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  if (!data.users[email]) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Usuário não encontrado' }) };
  }

  data.users[email].points += points;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify(data.users[email]),
  };
};
