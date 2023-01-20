const express = require('express');
const multer = require('multer');

const app = express();

const upload = multer({ dest: 'uploads' });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('ok');
});

app.listen(3000);
