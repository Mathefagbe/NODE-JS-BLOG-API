const express = require("express");
// import dotenv from 'dotenv'
require("dotenv").config();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { authRoute, blogRouter } = require("./routes");
const { errorHandler, notFound } = require("./middlewares");

// import dotenv from 'dotenv'
// dotenv.config();

//init app
const app = express();

//third party middleware
// app.use(express.json({ limit: "500mb" }));
app.use((req, res, next) => {
  if (req.method === "GET") return next();
  express.json({ limit: "500mb" })(req, res, next);
});
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("common")); //dev,common,combined
app.use(cookieParser());

//routers
app.use("/api/v1/auth/", authRoute);
app.use("/api/v1/blog/", blogRouter);

//not found route middleware
app.use(notFound);

//error handling middleware has to be under the router NB last middleware
app.use(errorHandler);

module.exports = app;
