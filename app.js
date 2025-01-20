import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile } from "fs/promises";

// Add this before your app initialization
const swaggerDocument = JSON.parse(await readFile(new URL("./swagger-output.json", import.meta.url)));

import userRoute from "./routes/userRoute.js";
import tripRoute from "./routes/tripRoute.js";
import locationRoute from "./routes/locationRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import authRoute from "./routes/authRoute.js";
import syncRoute from "./routes/syncRoutes.js";
import ratingRoute from "./routes/ratingRoute.js";

import { connectDB } from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./swaggerOptions.js";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

connectDB();

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/trips", tripRoute);
app.use("/api/location", locationRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/sync", syncRoute);
app.use("/api/ratings", ratingRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
