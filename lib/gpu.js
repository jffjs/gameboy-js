module.exports = GPU;

function GPU() {
  this.vRAM = new Uint8Array(0x2000);
  this.oam  = new Uint8Array(0xA0);
  this.screen = new Uint8Array(160 * 144);
  this.tileData = new Uint8Array(384 * 16);

  this.clock = 0;
  this.line = 0;

  // control register
  this.lcdc = 0;

  // status register
  this.stat = 0;
}

GPU.prototype.getMode = function() {
  return this.status & 0x3;
};

GPU.prototype.setMode = function(mode) {
  this.status = (this.status & 0xC) | mode;
};

GPU.prototype.getLCDEnable = function() {
  return (this.lcdc & 0x80) >> 7;
};

GPU.prototype.getWindowTileMapSelect = function() {
  return (this.lcdc & 0x40) >> 6;
};

GPU.prototype.getWindowDisplayEnable = function() {
  return (this.lcdc & 0x20) >> 5;
};

GPU.prototype.getTileDataSelect = function() {
  return (this.lcdc & 0x10) >> 4;
};

GPU.prototype.getBackgroundTileMapSelect = function() {
  return (this.lcdc & 0x8) >> 3;
};

GPU.prototype.getSpriteSizeSelect = function() {
  return (this.lcdc & 0x4) >> 2;
};

GPU.prototype.getSpriteDisplayEnable = function() {
  return (this.lcdc & 0x2) >> 1;
};

GPU.prototype.getBackgroundDisplayEnable = function() {
  return this.lcdc & 0x1;
};

GPU.prototype.execute = function(t) {
  this.clock += t || 0;

  switch(this.getMode()) {
    case 0: // Hblank
      if (this.clock >= 204) {
        this.clock = 0;
        this.line++;

        if (this.line === 143) {
          this.setMode(1);
        } else {
          this.setMode(2);
        }
      }
      break;
    case 1: // Vblank
      if (this.clock >= 456) {
        this.clock = 0;
        this.line++;

        if (this.line > 153) {
          this.setMode(2);
          this.line = 0;
        }
      }
      break;
    case 2: // Scanline - Access OAM
      if (this.clock >= 80) {
        this.clock = 0;
        this.setMode(3);
      }
      break;
    case 3: // Scanline - Access VRAM
      if (this.clock >= 172) {
        this.clock = 0;
        this.mode = 0;
        this.setMode(0);

        // this.renderLine();
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

