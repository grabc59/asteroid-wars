'use strict';
var $playerName = "padahwun";



$(window).load(function(){
  $('#welcome-modal').modal('show');
  $('#highPlayer').text(localStorage.user);
  $('#highTime').text(localStorage.time);
  $('#highScore').text(localStorage.score);
});

////////////////////////////
/////// WELCOME MODAL
////////////////////////////
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

$('#submit-score-button').click(function(event) {
  if (localStorage.score === undefined) {
    addScore();
  } else if ($('#player-score-field').val() > JSON.parse(localStorage.score)) {
    addScore();
  }
})

function addScore() {
  localStorage.user = $playerName;
  localStorage.time = $('#player-time-field').val();
  localStorage.score = $('#player-score-field').val();
  $('#highPlayer').text(localStorage.user);
  $('#highTime').text(localStorage.time);
  $('#highScore').text(localStorage.score);
}

// function displayScore() {
//   $('#highPlayer') =  localStorage.user;
//
// }
