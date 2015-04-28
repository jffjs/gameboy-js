function MMU() {
  this.bios = new Uint8Array(0x100);
  this.ROM  = new Uint8Array(0x8000);
  this.eRAM = new Uint8Array(0x2000);
  this.iRAM = new Uint8Array(0x2000);
  this.zRAM = new Uint8Array(0x80);
  
  this._memory = new Uint8Array(0xFFFF);
}
  
MMU.prototype.read8 = function(addr) {
};

MMU.prototype.read16 = function(addr) {
};

MMU.prototype.write8 = function() {
  
};

MMU.prototype.write16 = function() {
  
};

module.exports = MMU;
