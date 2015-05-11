module.exports = GPU;

function GPU() {
  this.vRAM = new Uint8Array(0x2000);
  this.oam  = new Uint8Array(0xA0);
}

GPU.prototype.readVRAM = function(addr) {
};

GPU.prototype.writeVRAM = function(addr, val) {
};

GPU.prototype.readOAM = function(addr) {
};

GPU.prototype.writeOAM = function(addr, val) {
};

