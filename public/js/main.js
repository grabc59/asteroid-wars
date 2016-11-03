'use strict';
var $playerName = "padahwun";


////////////////////////////
/////// WELCOME MODAL
////////////////////////////
$(window).load(function(){
  $('#welcome-modal').modal('show');
});

// set player name
$('#name-button').click(function(event) {
  if ($('#player-name').val() !== "") {
    $playerName = $('#player-name').val();
  }
  $('#welcome-modal').modal('toggle');
});
// skip player name
$('#skip-button').click(function(event) {
  $('#welcome-modal').modal('toggle');
});


////////////////////////////
/////// GAMEOVER MODAL
////////////////////////////
function gameOver (score, time) {
  $('#gameover-modal').modal('show');
  $('#player-name-field').val($playerName);
  $('#player-time-field').val(time);
  $('#player-score-field').val(score);
}

$('#score-button').click(function(event) {

})
