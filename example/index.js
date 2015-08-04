var Gameboy = require('../index');

var gb = new Gameboy();

// render canvas
var canvas = document.getElementById('lcd');
var ctx = canvas.getContext('2d');
ctx.putImageData(new ImageData(gb.gpu.screen, 160, 144), 0, 0);
