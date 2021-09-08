const multer = require('multer');
const express = require('express');
const { resolve } = require('path');
const { createHash } = require('crypto');
const { constants: { R_OK, W_OK }} = require('fs');
const { access, readFile, writeFile } = require('fs/promises');

const app = express();

const uploadPath = resolve(__dirname, 'uploads');
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const originalNameHash = createHash('md5');
      originalNameHash.update(file.originalname);
      const hashedOriginalName = originalNameHash.digest('hex');

      const filenameHash = createHash('md5');
      filenameHash.update(`${hashedOriginalName}@${file.filename}`);
      const hashedFilename = filenameHash.digest('hex');

      cb(null, hashedFilename);
    }
  })
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

app.set('views', resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  const path = resolve(__dirname, 'db.json');
  try {
    await access(path, R_OK | W_OK);
    const data = await readFile(path);
    const files = JSON.parse(data);
    // const realFilenames = files.map(file => {

    // });
    res.render('index', { files });
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/upload', (req, res) => res.render('upload'));

app.post('/upload', handleUploadError(upload.single('file')), async (req, res) => {
  const path = resolve(__dirname, 'db.json');
  try {
    await access(path, R_OK | W_OK);
    const data = await readFile(path);
    const files = JSON.parse(data);

    const { filename, mimetype } = req.file;
    files.push({
      name: filename, 
      type: mimetype 
    });

    await writeFile(path, JSON.stringify(files));
    res.redirect('/');
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get('/download/:file', (req, res) => {
  res.sendFile(resolve(uploadPath, req.params.file));
});

module.exports = app;
