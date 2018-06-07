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

            /* check for jQuery dependency */
            if (typeof $ === "undefined") {
                next("jQuery is a required dependency");
                return;
            }            

            /* Nothing should be done for same origin images */
            if (new URL(url).origin === window.location.origin) {
                _loadImage(url, next);
                return;
            }

            /* This is required to overcome browser caching of external hosted images */
            /* related bug: https://bugs.chromium.org/p/chromium/issues/detail?id=409090 */            
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
                    next('The server that is hosting the image does not allow access to this image from your origin.');
                }
            });
        }
    };
})();
