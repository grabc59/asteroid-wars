'use strict';
var $playerName = "Padawon";



$(window).load(function(){
  console.log(localStorage.user);
  if (localStorage.user != "") {
    $('#player-name').val(localStorage.user);
    console.log(localStorage.user);
  }
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
    game.state.start(states.game);
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
  } else if ($('#player-score-field').val() == JSON.parse(localStorage.score) && $('#player-time-field').val() < JSON.parse(localStorage.time)) {
    addScore();
  }
});
$('#play-again-button').click(function(event) {
  location.reload();
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
