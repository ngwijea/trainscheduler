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
  trainName = $("#trainName")
    .val()
    .trim();
  destination = $("#destination")
    .val()
    .trim();
  firstTrain = $("#firstTrain")
    .val()
    .trim();
  frequency = $("#frequency")
    .val()
    .trim();

  // Code to push values to the database
  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    created: firebase.database.ServerValue.TIMESTAMP
  });
});

database.ref().on(
  "child_added",
  function(childSnapshot) {
    // var firstTrain = $("#firstTrain").val().trim();
    var firstTrainTime = moment(firstTrain,"HH:mm").subtract(1, "years");
    console.log("FIRST TRAIN TIME: " + firstTrainTime)

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTrainTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var upcomingTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(upcomingTrain).format("hh:mm"));

    // full list of items to the well
    $("#add-row").append(
      "<tr><td>" +
        trainName +
        "</td><td>" +
        destination +
        "</td><td>" +
        upcomingTrain +
        "</td><td>" +
        frequency +
        "</td><td>" +
        tMinutesTillTrain +
        "</td></tr>"
    );

    // Handle the errors
  },
  function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);

// database.ref().orderByChild("created").limitToLast(1).on("child_added", function(snapshot) {
//     // Change the HTML to reflect
//     $("#name-display").text(snapshot.val().trainName);
//     $("#email-display").text(snapshot.val().destination);
//     $("#age-display").text(snapshot.val().firstTrain);
//     $("#comment-display").text(snapshot.val().created);
//   });
