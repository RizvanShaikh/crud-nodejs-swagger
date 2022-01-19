// ==================== Load Internal Modules =========================================
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const path = require("path");
const debug = require("debug")("server:server");
const http = require("http");
const CONFIG = require("./config/config"); // Load the configuartion
const app = express(),
      bodyParser = require("body-parser");
      fs = require('fs');
      
const { ValidationError } = require("express-validation");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
// ==================== Load Internal Modules =========================================

/* for the file upload */
var fileupload = require('express-fileupload');
app.use(fileupload());

/* DATABASE Connection */
const db_url = `${CONFIG.db_dialect}://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
console.log('db_url', db_url);

mongoose.connect(db_url, { useUnifiedTopology: true, useNewUrlParser: true }).catch((err) => {
  console.log("MongoDB database connection failed");
});
mongoose.connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// Specify the public static path
app.use(express.static('public'));

// Give request limit upto 50mb
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

/* 
CORS
remember: put CORS before the route file
 */
app.use(cors());

app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));

/* imported route */
const routes = require("./routes");
app.use("/api", routes);

// error handler
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    let error = err;
    try {
      if (err.details.body) {
        const body = err.details.body[0];
        error = {
          [body.path[0]]: body.message,
        };
      } else if (err.details.query) {
        const query = err.details.query[0];
        error = {
          [query.path[0]]: query.message,
        };
      } else if (err.details.params) {
        const params = err.details.params[0];
        error = {
          [params.path[0]]: params.message,
        };
      }
    } catch {
      // console.log("ValidationError", err.details);
    }
    return res.status(err.statusCode).json(error);
  } else {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
});


// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Get port from environment and store in Express.
const port = normalizePort(CONFIG.port || "3000");
app.set("port", port);

// Create HTTP server.
const server = http.createServer(app);
// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log("Server listenning on port:", addr.port);
}

// to see swager UI
// http://localhost:3001/api-docs/
