module.exports = GPU;

var util = require('./util');

function GPU() {
  this.vRAM = new Uint8Array(0x2000);
  this.oam  = new Uint8Array(0xA0);
  this.screen = new Uint8Array(160 * 144);
  this.tileData = new Uint8Array(384 * 16);
  this.tileMap = [new Uint8Array(32 * 32), new Uint8Array(32 * 32)];
  this.screenData = new Uint8ClampedArray(160 * 144 * 4);

  this.clock = 0;
  this.ly = 0;
  this.lyc = 0;
  this.sx = 0; // FF42h
  this.sy = 0; // FF43h

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

GPU.prototype.getBgTileMapSelect = function() {
  return (this.lcdc & 0x8) >> 3;
};

GPU.prototype.getObjSizeSelect = function() {
  return (this.lcdc & 0x4) >> 2;
};

GPU.prototype.getObjDisplayEnable = function() {
  return (this.lcdc & 0x2) >> 1;
};

GPU.prototype.getBgDisplayEnable = function() {
  return this.lcdc & 0x1;
};

GPU.prototype.execute = function(t) {
  this.clock += t || 0;

  switch(this.getMode()) {
    case 0: // Hblank
      if (this.clock >= 204) {
        this.clock = 0;
        this.ly++;

        if (this.ly === 143) {
          this.setMode(1);
        } else {
          this.setMode(2);
        }
      }
      break;
    case 1: // Vblank
      if (this.clock >= 456) {
        this.clock = 0;
        this.ly++;

        if (this.ly > 153) {
          this.setMode(2);
          this.ly = 0;
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

GPU.prototype.renderLine = function() {
  var line = (this.sy + this.ly) & 0xFF;
  for (var x = 0; x < 160; x++) {
    var col = this.sx + x;
    var tileIndex = util.mapPixelToTile(col, line);
    var tileAddress = util.mapTileToAddress(tileIndex, this.getBgTileMapSelect());
    var tile = this.tileData.subarray(tileAddress, tileAddress + 16);
    var tileY = line % 8;

    for (var b = 0; b < 8; b++) {
      var p1 = tile[tileY] >> b;
      var p2 = tile[tileY + 1] >> b;
      var p  = p1 | p2 << 1;
    }
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

