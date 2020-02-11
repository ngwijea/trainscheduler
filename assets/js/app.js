var config = {
  apiKey: "AIzaSyA81a9YgfWj5d9HxXVXy3n333NkIBHVnFE",
  authDomain: "train-scheduler-2020.firebaseapp.com",
  databaseURL: "https://train-scheduler-2020.firebaseio.com",
  projectId: "train-scheduler-2020",
  storageBucket: "train-scheduler-2020.appspot.com",
  messagingSenderId: "876249999112",
  appId: "1:876249999112:web:27039b5b7d36c0441ceebd"
};
// Initialize Firebase
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = 0;

$("#add-train").on("click", function(event) {
  event.preventDefault();

  // Grab values from text-boxes
  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrain").val().trim();
  frequency = $("#frequency").val().trim();

  // Code to push values to the database
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    created: firebase.database.ServerValue.TIMESTAMP
  });
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added",function(childSnapshot) {
    var nextArr;
    var minAway;
    var firstTrainTime = moment(childSnapshot.val().firstTrain,"hh:mm").subtract(1, "years");
    var calDiff = moment().diff(moment(firstTrainTime), "minutes");
    var calRemain = calDiff % childSnapshot.val().frequency;
    var minClose = childSnapshot.val().frequency - calRemain;

    var upcomingTrain = moment().add(minClose, "minutes");
    upcomingTrain = moment(upcomingTrain).format("hh:mm");

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrain);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().created);

    // full list of items to the well
    $("#add-row").append(
      "<tr><td>" +
        childSnapshot.val().trainName +
        "</td><td>" +
        childSnapshot.val().destination +
        "</td><td>" +
        childSnapshot.val().frequency +
        "</td><td>" +
        upcomingTrain +
        "</td><td>" +
        minClose +
        "</td></tr>"
    );

    // Handle the errors
  },
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);

database.ref().orderByChild("created").limitToLast(1).on("child_added", function(snapshot) {
    // Change the HTML to reflect
    $("#name-display").text(snapshot.val().trainName);
    $("#email-display").text(snapshot.val().destination);
    $("#age-display").text(snapshot.val().firstTrain);
    $("#comment-display").text(snapshot.val().created);
  });
