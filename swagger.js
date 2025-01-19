import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "User API",
    description: "API for user management",
  },
  host: "13.246.7.13:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/authRoute.js", "./routes/locationRoute.js", "./routes/notificationRoute.js", "./routes/ratingRoute.js", "./routes/syncRoutes.js", "./routes/tripRoute.js", "./routes/userRoute.js"];

swaggerAutogen()(outputFile, endpointsFiles).then(() => {
  console.log("Swagger documentation generated");
});
