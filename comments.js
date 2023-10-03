// Create a web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const path = require('path');
const { Client } = require('pg');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'comments',
  password: 'password',
  port: 5432,
});

client.connect();

app.get('/api/comments', (req, res) => {
  client.query('SELECT * FROM comments', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result.rows);
    }
  });
});

app.post('/api/comments', (req, res) => {
  const { comment, username } = req.body;
  client.query('INSERT INTO comments (comment, username) VALUES ($1, $2)', [comment, username], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send('success');
    }
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});