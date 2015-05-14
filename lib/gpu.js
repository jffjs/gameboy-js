module.exports = GPU;

function GPU() {
  this.vRAM = new Uint8Array(0x2000);
  this.oam  = new Uint8Array(0xA0);
  this.mode = 0;
  this.clock = 0;
  this.line = 0;
}

GPU.prototype.execute = function(t) {
  this.clock += t || 0;

  switch(this.mode) {
    case 0: // Hblank
      if (this.clock >= 204) {
        this.clock = 0;
        this.mode = 2;
        this.line++;
      }
      break;
    case 1: // Vblank
      if (this.clock >= 456) {
        this.clock = 0;
        this.line++;

        if (this.line >= 153) {
          this.mode = 2;
          this.line = 0;
        }
      }
      break;
    case 2: // Scanline - Access OAM
      if (this.clock >= 80) {
        this.clock = 0;
        this.mode = 3;
      }
      break;
    case 3: // Scanline - Access VRAM
      if (this.clock >= 172) {
        this.clock = 0;
        this.mode = 0;
      }
      break;
  }
};

GPU.prototype.readVRAM = function(addr) {
};

GPU.prototype.writeVRAM = function(addr, val) {
};

GPU.prototype.readOAM = function(addr) {
};

GPU.prototype.writeOAM = function(addr, val) {
};

