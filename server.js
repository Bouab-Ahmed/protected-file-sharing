require('dotenv').config();
const multer = require('multer');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

const upload = multer({ dest: 'uploads' });

mongoose.connect(process.env.MONGO_URL);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('ok');
});

app.listen(process.env.PORT);
