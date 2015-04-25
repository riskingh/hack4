
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {
  res.render('index', {});
});

app.get("/events", function(req, res) {
  Parse.Cloud.run("getEvents", {count: 10}, {
    success: function(result) {
      res.render("events", {events: JSON.stringify(result)});
    },
    error: function(error) {
      res.render("error", {});
    }
  });
});

app.get("/log_in", function(req, res) {
  res.render("log_in")
});

app.get("/add_event", function(req, res) {
  res.render("add_event")
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
