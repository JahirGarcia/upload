const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const files = [];
  res.render('index', { files });
});

app.get('/upload', (req, res) => res.render('upload'));

app.post('/upload', (req, res) => {
  res.end('done!!!');
})

module.exports = app;
