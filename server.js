const express = require("express");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const routes = require("./routes/router");
const app = express();
const cors = require('cors');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 3001;

// Middleware
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(express.json());

app.use(cors());

// Define middleware here
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// app.use(express.static(path.join(__dirname,'public'))); 

// Connect to the Mongo DB
mongoose.connect(
      "mongodb+srv://amjed:chipman-track-app@chipmantracker.yg93a.mongodb.net/techs?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.log(err);
  });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});

// Add routes, both API and view
app.use(routes);
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
// app.get('*', (req, res)=> {
//   const index = path.join(__dirname, "./client/build/index.html" );
//   res.sendFile(index);
// });
// app.get('/', function (req, res) {
//   res.render('index', {});
// });

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});