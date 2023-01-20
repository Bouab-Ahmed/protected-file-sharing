require('dotenv').config();
const multer = require('multer');
const bcrypt = require('bcrypt');
const File = require('./models/File');
const connectDB = require('./config/db');

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

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
  res.render('index', { filelink: `${req.headers.origin}/file/${file.id}` });
});

app.route('/file/:id').get(handlePassword).post(handlePassword);

async function handlePassword(req, res) {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render('password');
      return;
    }
  }

  if (
    file.password != null &&
    !(await bcrypt.compare(req.body.password, file.password))
  ) {
    res.render('password', { error: 'Incorrect password' });
    return;
  }

  file.downloadCount++;
  await file.save();

  res.download(file.path, file.originalName);
}

app.listen(process.env.PORT);
