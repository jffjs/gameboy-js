function MMU() {
  this._memory = new Uint8Array(0xFFFF);
}
  
MMU.prototype.read8 = function(addr) {
  return this._memory[addr];
};

MMU.prototype.read16 = function(addr) {
  return (this._memory[addr] << 8) | this._memory[addr-1];
};

MMU.prototype.write8 = function() {
  
};

MMU.prototype.write16 = function() {
  
};

module.exports = MMU;
