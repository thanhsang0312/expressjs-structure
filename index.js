const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const programmingLanguagesRouter = require('./src/routes/programmingLanguages.route');
const authRoutes = require('./src/routes/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "your_user",
  password: "your_password",
  database: "your_database"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!!!")
});

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple Express API with JWT authentication',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/controllers/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/programming-languages', programmingLanguagesRouter);
app.use('/api/auth', authRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
