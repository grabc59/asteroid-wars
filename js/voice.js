'use strict';
$(document).ready(function() {
    // Request
    jQuery.getJSON(
        "http://vaas.acapela-group.com/Services/UrlMaker?jsoncallback=?", {
            prot_vers: 2,
            cl_login: "EVAL_VAAS",
            cl_app: "EVAL_9746108",
            cl_pwd: "gzgmj4x9",
            req_voice: "ryan22k",
            req_text: "Hello world, how's it going ?",
            //to produce ogg vorbis files, for MP3 you can remove this param.
            req_snd_type: "OGG"
        },
        function(data) {
            // Data exploitation
            $("#demo_voices_player").html("<audio src='" + data.snd_url + "' controls='controls' autoplay='autoplay' style='display: none'/>");
        }
    );
});
