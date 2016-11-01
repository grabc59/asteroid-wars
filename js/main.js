'use strict';
var $playerName;


////////////////////////////
/////// WELCOME MODAL
////////////////////////////
$(window).load(function(){
  $('#welcome-modal').modal('show');
});

// set player name
$('#name-button').click(function(event) {
  $playerName = $('#player-name').val();
  $('#welcome-modal').modal('toggle');
});
// skip player name
$('#skip-button').click(function(event) {
  $('#welcome-modal').modal('toggle');
});
