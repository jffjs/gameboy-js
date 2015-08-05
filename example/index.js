var Gameboy = require('../index');

var gb = new Gameboy();

// render canvas
var canvas = document.getElementById('lcd');
var ctx = canvas.getContext('2d');
var render = function(screen) {
  ctx.putImageData(new ImageData(screen, 160, 144), 0, 0);
};

function emulate() {
  for(var i = 0; i < 60000; i++) {
    gb.emulate(render);
  }
  requestAnimationFrame(emulate);
}

requestAnimationFrame(emulate);
