'use strict';

// locally available text quotes
var encouragementQuotes = [
  "Fear is the path to the dark side.",
  "Do or do not. There is no try.",
  "Ohhh. Great warrior. Wars not make one great.",
  "Named must your fear be before banish it you can",
  "A Jedi uses the Force for knowledge and defense, never for attack.",
  "Adventure. Excitement. A Jedi craves not these things.",
  "Use your feelings.",
];

var failureQuotes = [
  "Control, control, you must learn control!",
  "Much to learn you still have",
  "If no mistake have you made, yet losing you are, a different game you should play",
  "Always a bigger fish there is",
];

var successQuotes = [
  "Feel the force!",
  "Strong with you the force is!",
];

// pick one of the locally available text quotes
function getRandomQuote(quoteArray) {
  // var randomQuote = $playerName + ", " + staticQuotes[Math.floor(Math.random() * staticQuotes.length)];
  var randomQuote = $playerName + ", " + quoteArray[Math.floor(Math.random() * quoteArray.length)];
  pullYodaAudio(randomQuote);
};



// function getRandomQuote() {
//   var randomQuote = $playerName + ", " + staticQuotes[Math.floor(Math.random() * staticQuotes.length)];
//   pullYodaAudio(randomQuote)
// };



function pullYodaAudio(quote) {
    // Request an audio file of the random text quote
    jQuery.getJSON(
        "//vaas.acapela-group.com/Services/UrlMaker?jsoncallback=?", {
            prot_vers: 2,
            cl_login: "EVAL_VAAS",
            cl_app: "EVAL_9746108",
            cl_pwd: "gzgmj4x9",
            req_voice: "willlittlecreature22k",
            req_text: quote,
            //to produce ogg vorbis files, for MP3 you can remove this param.
            req_snd_type: "OGG"
        },
        function(data) {
            // Create the audio player, autoplay the sound downloaded
            $("#demo_voices_player").html("<audio src='" + data.snd_url + "' controls='controls' autoplay='autoplay' style='display: none'/>");
        }
    );
};
