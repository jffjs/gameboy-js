module.exports = MMU;

function MMU(gpu) {
  this.gpu = gpu;
  this.inBIOS = true;
  this.bios = new Uint8Array(0x100);
  this.ROM  = new Uint8Array(0x8000);
  this.eRAM = new Uint8Array(0x2000);
  this.iRAM = new Uint8Array(0x2000);
  this.zRAM = new Uint8Array(0x80);

  this._memory = new Uint8Array(0xFFFF);
}

MMU.prototype.read8 = function(addr) {
  switch(addr & 0xF000) {
    case 0x0000:
      if (addr < 0x0100 && this.inBIOS) {
        return this.bios[addr];
      } else {
        return this.ROM[addr];
      }
    case 0x1000:
    case 0x2000:
    case 0x3000:
      return this.ROM[addr];
    case 0x4000:
    case 0x5000:
    case 0x6000:
    case 0x7000:
      return this.ROM[addr];
    case 0x8000:
    case 0x9000:
      return this.gpu.read(addr & 0x1FFF);
    default:
      return 0;
  }
};

MMU.prototype.read16 = function(addr) {
};

MMU.prototype.write8 = function() {

};

MMU.prototype.write16 = function() {

};

