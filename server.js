import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/status', (req, res) => {
  res.json({ status: 'API is alive' });
});

app.get('/content', authenticationToken, (req, res) => {
  res.json({ status: 'Secret content' });
});

app.get('/login', (req, res) => {
  // Authentication User
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticationToken(req, res, next) {
  console.log('Passando por rota authenticada...');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});