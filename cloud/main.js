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
        results[i].get("host").fetch({                          //- FETCH BEGIN
          success: function(result) {
            cnt--;
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
                simpleResult[j] = tmp;
              }
              response.success(simpleResult);
            }
          },
          error: function(error) {
            cnt--;
            response.error("cant fetch hosts");
          }
        });                                                   //- FETCH END
      }
    },
    error: function(error) {
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
      result = result[0];
      console.log("$$$$$$ result $$$");
      console.log(result);
      result.get("host").fetch({
        success: function(res) {
          ans = {
            "id": result.id,
            "title": result.get("title"),
            "desc": result.get("desc"),
            "place": result.get("place"),
            "date": result.get("date"),
            "endDate": result.get("endDate"),
            "host": result.get("host"),
            "members": result.relation("members")
          };
          response.success(ans);
        },
        error: function(error) {
          console.log("WTF¿¿¿¿");
          response.error("cant fetch host");
        }
      });
    },
    error: function(error) {
      response.error(error);
    }
  });
});

Parse.Cloud.define("subscribe", function(request, response) {
  var eventId = request.params.event;
  var studentId = request.params.student;

  var Event = Parse.Object.extend("Event");
  var qevent = new Parse.Query(Event);
  qevent.equalTo("objectId", eventId);
  qevent.find({
    success: function(event) {
      var Student = Parse.Object.extend("Student");
      var qstudent = new Parse.Query(Student);
      qstudent.equalTo("vkId", studentId);
      qstudent.find({
        success: function(student) {
          event = event[0];
          student = student[0];
          event.relation("members").add(student);
          event.save(null, {
            success: function(event) {
              response.success({});
            },
            error: function(event, error) {
              console.log(error);
            }
          });
        },
        error: function(error) {
          console.log("ERROR")
          response.error("eee");
        }
      });
    },
    error: function(error) {
      console.log("err2")
      response.error("error");
    }
  });
});

Parse.Cloud.define("unsubscribe", function(request, response) {
  var eventId = request.params.event;
  var studentId = request.params.student;

  var Event = Parse.Object.extend("Event");
  var qevent = new Parse.Query(Event);
  qevent.equalTo("objectId", eventId);
  qevent.find({
    success: function(event) {
      var Student = Parse.Object.extend("Student");
      var qstudent = new Parse.Query(Student);
      qstudent.equalTo("vkId", studentId);
      qstudent.find({
        success: function(student) {
          event = event[0];
          student = student[0];
          event.relation("members").remove(student);
          event.save(null, {
            success: function(event) {
              response.success({});
            },
            error: function(event, error) {
              console.log(error);
            }
          });
        },
        error: function(error) {
          console.log("ERROR")
          response.error("eee");
        }
      });
    },
    error: function(error) {
      console.log("err2")
      response.error("error");
    }
  });
});