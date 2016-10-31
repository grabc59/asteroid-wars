'use strict';
// $(document).ready(function() {
function queueYoda() {

    // locally available text quotes
    var staticQuotes = [
      "Fear is the path to the dark side. Fear leads to anger. Anger leads to hate. Hate leads to suffering.",
      "Feel the force!",
      "Do or do not. There is no try. Heeheehee",
    ];
    // pick one of the locally available text quotes
    var randomQuote = staticQuotes[Math.floor(Math.random() * staticQuotes.length)];



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
// });
};
