'use strict';

// locally available text quotes
var staticQuotes = [
  "Fear is the path to the dark side.",
  "Feel the force!",
  "Do or do not. There is no try. Heeheehee",
];

// pick one of the locally available text quotes
function getRandomQuote() {
  var randomQuote = $playerName + ", " + staticQuotes[Math.floor(Math.random() * staticQuotes.length)];
  pullYodaAudio(randomQuote)
};


function pullYodaAudio(randomQuote) {
    // Request an audio file of the random text quote
    jQuery.getJSON(
        "http://vaas.acapela-group.com/Services/UrlMaker?jsoncallback=?", {
            prot_vers: 2,
            cl_login: "EVAL_VAAS",
            cl_app: "EVAL_9746108",
            cl_pwd: "gzgmj4x9",
            req_voice: "willlittlecreature22k",
            req_text: randomQuote,
            //to produce ogg vorbis files, for MP3 you can remove this param.
            req_snd_type: "OGG"
        },
        function(data) {
            // Create the audio player, autoplay the sound downloaded
            $("#demo_voices_player").html("<audio src='" + data.snd_url + "' controls='controls' autoplay='autoplay' style='display: none'/>");
        }
    );
};
