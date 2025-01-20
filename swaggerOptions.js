import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for managing users",
    },
    // host: "13.246.7.13:3000",
    servers: [
      {
        // url: "http://localhost:3000/api",
        url: "http://13.246.7.13:3000/api",
      },
    ],
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};
