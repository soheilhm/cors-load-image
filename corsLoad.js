"use strict";

/**
 * Revealing Module pattern to prevent polluting global namespace
 * @module CorsLoadImageModule
 */
var CorsLoadImageModule = (function() {
    var _loadImage = function(url, callback) {
        var img = new Image();
        img.onload = function() {
            callback(null, img);
        };
        img.crossOrigin = "";
        img.src = url;
    };

    return {
        load: function(url, next) {
            /* To prevent people using this method in Node */
            if (typeof window === "undefined") {
                next("code must run inside a browser.");
                return;
            }

            /* Nothing should be done for same origin images */
            if (new URL(url).origin === window.location.origin) {
                _loadImage(url, next);
                return;
            }

            var cacheBustedUrl = url + "?v=" + Date.now();

            $.ajax({
                type: "GET",
                url: cacheBustedUrl,
                beforeSend: function(xhr) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined");
                },
                success: function(result, textStatus, jqXHR) {
                    if (result.length < 1) {
                        next("Image is unavailable");
                        return;
                    }

                    var binary = "";
                    var responseText = jqXHR.responseText;
                    var responseTextLen = responseText.length;

                    for (var i = 0; i < responseTextLen; i++) {
                        binary += String.fromCharCode(
                            responseText.charCodeAt(i) & 255
                        );
                    }

                    _loadImage("data:image/png;base64," + btoa(binary), next);
                },
                error: function() {
                    var error =
                        "The server that is hosting the image does not allow access to this image from your origin.\n";
                    error +=
                        "Make sure Access-Control-Allow-Origin header exists and supports your current origin\n";
                    error +=
                        "A- If you are loading images from S3, make sure you created a CORS policy for your S3 bucket.\n";
                    error +=
                        "B- If you are loading images from your own server, make sure the CORS header is set.";
                    next(error);
                }
            });
        }
    };
})();
