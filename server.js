const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/login', (req, res) => {
  const redirect = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`;
  res.redirect(redirect);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Erro no login');

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', qs.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      scope: 'identify email'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const user = userRes.data;

    await axios.post(WEBHOOK_URL, {
      embeds: [{
        title: "🟢 Novo login no NexSites",
        color: 0x7289da,
        fields: [
          { name: "Usuário", value: `${user.username}#${user.discriminator}` },
          { name: "ID", value: user.id },
          { name: "Email", value: user.email || "Não fornecido" }
        ],
        thumbnail: {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        },
        timestamp: new Date().toISOString()
      }]
    });

    res.send(`<h1>Olá, ${user.username}!</h1><p>Login realizado com sucesso.</p>`);
  } catch (err) {
    console.error(err);
    res.send('Erro durante autenticação.');
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));