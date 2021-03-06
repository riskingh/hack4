
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
  res.redirect("/events");
});

app.get('/vk', function(req, res) {
  res.render('vk', {});
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
  res.render("log_in", {});
});

app.get("/add_event", function(req, res) {
  res.render("add_event", {});
});

app.get("/event", function(req, res) {
  // Parse.Cloud.run("getEventById", {id: req.query.id}, {
  //   success: function(result) {
  //     res.render("event", {event: JSON.stringify(result)});
  //   },
  //   error: function(error) {
  //     res.render(error, {});
  //   }
  // });
  res.render("event", {id: req.query.id});
});

app.get("/error", function(req, res) {
  res.render("error", {});
});

app.get("/event/subscribe", function(req, res) {
  Parse.Cloud.run("subscribe", {event: req.query.event, student: req.query.id}, {
    success: function(result) {
      res.redirect("/event?id=" + req.query.event);
    },
    error: function(error) {
      res.render("error", {});
    }
  });
});

app.get("/event/unsubscribe", function(req, res) {
  Parse.Cloud.run("unsubscribe", {event: req.query.event, student: req.query.id}, {
    success: function(result) {
      res.redirect("/event?id=" + req.query.event);
    },
    error: function(error) {
      res.render("error", {});
    }
  });
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
