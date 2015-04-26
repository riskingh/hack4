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
      // results = results.slice(0, Math.min(results.length, request.params.count));
      answer = [];
      var cnt = results.length;
      if (cnt === 0)
        response.success([]);
      for (var i = 0; i < results.length; ++i) {
        results[i].get("host").fetch({
          success: function(result) {
            cnt--;
            console.log(result);
            if (cnt <= 0) {
              var simpleResult = [], tmp;
              for (var j = 0; j < results.length; ++j) {
                tmp = {
                  "id": results[j].id,
                  "title": results[j].get("title"),
                  "desc": results[j].get("desc"),
                  "place": results[j].get("place"),
                  "date": results[j].get("date"),
                  "endDate": results[j].get("endDate"),
                  "host": results[j].get("host"),
                  "members": results[j].get("members")
                };
                console.log(tmp.id);
                simpleResult[j] = tmp;
              }
              response.success(simpleResult);
            }
          },
          error: function(error) {
            cnt--;
            console.log("something bad just happend");
            response.error("cant fetch hosts");
          }
        });
      }
    },
    error: function(error) {
      console.log("something bad just happend");
      response.error("cant get events");
    }
  });
});

Parse.Cloud.define("getEventById", function(request, response) {
  var Event = Parse.Object.extend("Event");
  var query = new Parse.Query(Event);
  query.equalTo("objectId", request.params.id);
  query.find({
    success: function(result) {
      response.success(result);
    },
    error: function(error) {
      response.error(error);
    }
  });
});