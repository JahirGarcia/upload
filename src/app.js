const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

const upload = multer({
  dest: path.resolve(__dirname, 'uploads')
});

const handleUploadError = upload => (req, res, next) => {
  upload(req, res, err => {
    if(err instanceof multer.MulterError)
      res.sendStatus(400);
    else if(err)
      res.sendStatus(500);
    else
      next();
  });
}

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  const files = [];
  res.render('index', { files });
});

app.get('/upload', (req, res) => res.render('upload'));

app.post('/upload', handleUploadError(upload.single('file')), (req, res) => {
  console.log(req.file)
  res.redirect('/');
});

module.exports = app;
