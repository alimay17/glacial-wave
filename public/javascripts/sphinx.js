

function editShift() {
  console.log("This is editSchedule");
    $.get("/changeShift",
    function(data, status){
      console.log(data);
    $('#display').html(data);
  });
}

function removeShift(shiftID) {
console.log("It works cause here is the shift_id " + shiftID);
$.post("/removeShift",
  {shiftID: shiftID},
  function(){
    console.log("It works");
    location.reload(true);
  })
}