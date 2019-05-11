const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const { connectMongo } = require("./config/db");

const app = express();

//Helmet helps to secure Express apps by setting various HTTP headers.
app.use(
  helmet({
    dnsPrefetchControl: { allow: "true" }
  })
);

//Connect to MongoDB
connectMongo().catch(err => console.log(err));

//Morgan logger
if (app.get("env") === "development") {
  app.use(morgan("dev")); //logging only in development phase
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To prevent CORS errors. this should be before routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // * gives  access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    //we check req.method(which gives access to the http method used:get,post etc) to OPTIONS. browser always sends options request along with post or put.
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next(); // this is included if we dont immediately return the output from the above if statement, so that other routes can take over
});

//Routes which should handle requests
app.use("/endpoints/users", require("./routes/endpoints/users"));
// app.use('/orders',ordersRoutes);
// app.get('/', (req,res) => {
//   res.render('index', {title: 'Shout/translate'})

app.get("/", (req, res) => res.send("APii"));
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
