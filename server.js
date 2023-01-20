require('dotenv').config();
const multer = require('multer');
const connectDB = require('./config/db');
const express = require('express');
const bcrypt = require('bcrypt');
const File = require('./models/File');
const app = express();

const upload = multer({ dest: 'uploads' });

connectDB();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if ((req.body.password != null && req.body.password) !== '') {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = new File(fileData);
  await file.save();
  console.log(file);
  res.send(fileData.originalName);
});

app.listen(process.env.PORT);
