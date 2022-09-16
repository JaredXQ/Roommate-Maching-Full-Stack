// Get the packages we need
var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  secrets = require("./config/secrets"),
  bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

// Create our Express application
const app = express();

const oneDay = 1000 * 60 * 60 * 24

// parsing the incoming data
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(cookieParser());
app.use(cors());

app.use(
  session({
    secret: secrets.sessionSecret,
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: oneDay },
  })
);

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

// Connect to a MongoDB --> Uncomment this once you have a connection string!!
//mongoose.connect(secrets.mongo_connection,  { useNewUrlParser: true });
mongoose.connect(secrets.mongo_connection, {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true,
});

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Use routes as a module (see index.js)
require("./routes")(app, router);

// Start the server
app.listen(port);
console.log("Server running on port " + port);
