/* TrainTime
 Written by: Steve Harold
 12/23/2017 */

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDrFn4qrt5Xzq88i40-FjTKZf2fdw4q4ZQ",
  authDomain: "traintime-fee64.firebaseapp.com",
  databaseURL: "https://traintime-fee64.firebaseio.com",
  projectId: "traintime-fee64",
  storageBucket: "traintime-fee64.appspot.com",
  messagingSenderId: "807450965529"
};
firebase.initializeApp(config);
database = firebase.database();
// On-click event listener for #add-train button
$('#add-train').on("click", function() {
  event.preventDefault();
  // take user input
  var trainName = $("#name-input").val().trim();
  var location = $("#location-input").val().trim();
  var firstTrain = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");
  var frequency = $("#minute-input").val().trim();
  // to create local temporary object to hold train data
  var newTrain = {
      trainName: trainName,
      location: location,
      firstTrain: firstTrain,
      frequency: frequency
  };
  // uploads train data to the database
  database.ref().push(newTrain);
  // clears all the text-boxes
  $("#name-input").val("");
  $("#location-input").val("");
  $("#time-input").val("");
  $("#minute-input").val("");
});

//  Event listner for adding a row to the html when the user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  // first Train 
  var firstTime = moment(childSnapshot.val().firstTrain, "HH:mm");
  // CUrrent time
  var currentTime = moment().format("HH:mm");
  console.log("CURRENT TIME: " + currentTime);
  // variable to hold difference between currentTime and fisrt train
  var timeDiff = moment().diff(moment(firstTime), "minutes"); 
  // variable to hold remainder 
  var timeRemainder = timeDiff % childSnapshot.val().frequency;
  // variable to hold minutes until next train
  var minutesLeft = childSnapshot.val().frequency - timeRemainder;
  // variable to hold next train arrival time
  var nextTrain = moment().add(minutesLeft, "minutes").format("hh:mm A");
  // append rows to table
  $("#tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().location + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + nextTrain + "</td><td>" + minutesLeft + "</td></tr>");
});
