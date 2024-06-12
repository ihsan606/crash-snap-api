const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./api/auth/auth.route');
const predictRoutes = require('./api/predict/predict.route');

const { loadObjectDetectionModel, loadRegressionModel } = require("./utils/loadModel");
const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

(async () => {
  try {
    const objectDetectionModel = await loadObjectDetectionModel();
    const regressionModel = await loadRegressionModel();

    app.use((req, res, next) => {
      req.models = {
        objectDetectionModel,
        regressionModel
      };
      next();
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/predict', predictRoutes);

    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to load models:', error);
  }
})();