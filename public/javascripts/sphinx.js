
$('#login').submit(function() {
  $.post("/login",
  function(data, status){
    $('#message').html(data);
  });
  
})