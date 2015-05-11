module.exports = GPU;

function GPU() {
  this.vRAM = new Uint8Array(0x2000);
}

GPU.prototype.read = function(addr) {
};
