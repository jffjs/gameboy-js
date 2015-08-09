module.exports = Gameboy;

var CPU = require('./lib/cpu'),
    MMU = require('./lib/mmu'),
    GPU = require('./lib/gpu');

function Gameboy() {
  this.gpu = new GPU();
  this.mmu = new MMU(this.gpu);
  this.cpu = new CPU(this.mmu);
}

Gameboy.prototype.emulate = function(renderFn) {
  var tClocks = this.cpu.execute();
  this.gpu.execute(tClocks, renderFn);
};

Gameboy.prototype.load = function(rom) {
  this.mmu.load(rom);
};
