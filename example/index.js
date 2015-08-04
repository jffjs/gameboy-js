var Gameboy = require('../index');

var gb = new Gameboy();

// render canvas
var canvas = document.getElementById('lcd');
var ctx = canvas.getContext('2d');
ctx.putImageData(new ImageData(gb.gpu.screen, 160, 144), 0, 0);


var then = Date.now();

function emulate(a) {
  console.log("starting " + a);
  for(var i = 0; i < 60000; i++) {
    gb.emulate(function() {
      if (i % 30000 == 0) {
        console.log(i);
      }
    });
  }
  var now = Date.now();
  console.log(now - then);
  then = now;

  console.log("ending " + a);

}

requestAnimationFrame(function() { emulate(1); });
requestAnimationFrame(function() { emulate(2); });
requestAnimationFrame(function() { emulate(3); });
requestAnimationFrame(function() { emulate(4); });
