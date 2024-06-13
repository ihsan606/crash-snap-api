const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./api/auth/auth.route');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});



app.use('/api/auth', authRoutes);



app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})