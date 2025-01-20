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
    servers: [
      {
        url: "http://13.246.7.13:3000/api",
        // url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http", // Use 'http' type for Bearer token
          scheme: "bearer", // Specify 'bearer' scheme
          bearerFormat: "JWT", // Optionally specify the format (JWT)
          type: "bearer",
          name: "bearer",
          in: "header",
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Use BearerAuth here
      },
    ],
  },
  apis: [path.join(__dirname, "./routes/*.js")],
};
