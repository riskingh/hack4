require('cloud/app.js');

// // Use Parse.Cloud.define to define as many cloud functions as you want.
// // For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

Parse.Cloud.define("getEvents", function(request, response) {
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.find({
    success: function(results) {
      response.success(results.slice(0, Math.min(results.length, request.params.count)));
    },
    error: function(error) {
      console.log("something bad just happend");
    }
  });
});