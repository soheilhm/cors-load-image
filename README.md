# cors-load-image

Load Images dynamically to browser as a source that are hosted on external servers.
This approach is very useful for loading images into a canvas element. (tainted canvas issue)

---
### Notes
##### dependecies: 
1. jQuery AJAX 
2. polyfill.io for URL() constructor

_All code is written in ES5, no need for Babel for transpilation_

---
### Usage
Download the repo and paste it in the same folder as the rest of your project.
```html
<!doctype html>
<html>

<head>
    <title>CORS LOAD IMAGE</title>
    <!-- URL() constructor polyfill for IE11 -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
    <!-- jQuery Ajax -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <!-- corsLoad source -->
    <script src="./corsLoad.js"></script>
</head>

<body>
    <canvas id="myCanvas" width="673" height="431" style="margin: 0 auto; display: block;"></canvas>
    <script>
        'use strict';

        var draw = function draw() {
            var ctx = document.getElementById('myCanvas').getContext('2d');
            var url = 'https://media.gettyimages.com/photos/young-boy-standing-on-a-rocky-outcrop-picture-id841868308';

            CorsLoadImageModule.load(url, function (err, image) {
                if (err) {
                    alert(err);
                    return;
                }

                ctx.drawImage(image, 0, 0);
                ctx.font = "30px Arial";
                ctx.fillText("Image Loaded Into Canvas", 10, 50);
            });
        };
        window.onload = draw; 
    </script>
</body>

</html>
```
---
### demo
Open example.html to see the method in action.

   

              
