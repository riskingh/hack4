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
      results = results.slice(0, Math.min(results.length, request.params.count));
      answer = [];
      var cnt = results.length;
      for (var i = 0; i < results.length; ++i) {
        results[i].get("host").fetch({
          success: function(result) {
            cnt--;
            console.log(result);
            if (cnt <= 0) {
              console.log("SUCCESS <--------------");
              console.log(results);
              console.log("---------------------->");
              response.success(results);
            }
          },
          error: function(error) {
            cnt--;
            console.log("something bad just happend");
          }
        });
      }
    },
    error: function(error) {
      console.log("something bad just happend");
    }
  });
});