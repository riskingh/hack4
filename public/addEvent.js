$(document).ready(function () {
  parseParametersAndAddEvent = function() {
    var description = $("#description").val();
    var place = $("#place").val();
    var date = $("#date").val();
    console.log(description);
    console.log(place);
    console.log(date);
    addEvent(description, date, place);
  }

  addEvent = function(description, date, place) {
    var CEvent = Parse.Object.extend("Event");
    var user = Parse.User.current();
    if (user) {
      var currentEvent = new CEvent();
      currentEvent.set("date", date);
      currentEvent.set("host", user);
      currentEvent.set("place", place);
      currentEvent.set("description", description);
      currentEvent.save();
    }
    else {
      alert("Log in first");
    }
  }
});