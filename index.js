const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const programmingLanguagesRouter = require("./src/routes/programmingLanguages.route");
const authRoutes = require("./src/routes/auth.routes");
const courtRoutes = require("./src/routes/court.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { connectDB } = require('./src/utils/mongodb.util');

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "A simple Express API with JWT authentication",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Court: {
          type: "object",
          required: ["name", "address", "phone", "numberOfCourts", "courtType", "location"],
          properties: {
            name: {
              type: "string",
              description: "Name of the court"
            },
            address: {
              type: "string",
              description: "Address of the court"
            },
            phone: {
              type: "string",
              description: "Contact phone number"
            },
            website: {
              type: "string",
              description: "Website URL"
            },
            numberOfCourts: {
              type: "integer",
              description: "Number of courts available",
              minimum: 1
            },
            courtType: {
              type: "string",
              enum: ["badminton", "pickleball"],
              description: "Type of court"
            },
            location: {
              type: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  type: "string",
                  enum: ["Point"],
                  default: "Point"
                },
                coordinates: {
                  type: "array",
                  items: {
                    type: "number"
                  },
                  description: "[longitude, latitude]"
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/programming-languages", programmingLanguagesRouter);
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

// Initialize MongoDB connection
connectDB()
    .then(() => {
        app.listen(port, "0.0.0.0", () => {
            console.log(`Example app listening at http://localhost:${port}`);
            console.log(
                `Swagger documentation available at http://localhost:${port}/api-docs`
            );
        });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });

module.exports = app;
