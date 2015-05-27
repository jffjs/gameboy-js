module.exports = GPU;

var util = require('./util');

function GPU() {
  this.vRAM = new Uint8Array(0x2000);
  this.oam  = new Uint8Array(0xA0);
  this.screen = new Uint8Array(160 * 144);
  this.tileData = new Uint8Array(384 * 16);
  this.tileMap = [new Uint8Array(32 * 32), new Uint8Array(32 * 32)];
  this.screen = new Uint8ClampedArray(160 * 144 * 4);

  this.clock = 0;
  this.scy   = 0; // FF42h
  this.scx   = 0; // FF43h
  this.ly    = 0; // FF44h
  this.lyc   = 0; // FF45h
  this.bgp   = 0; // FF47h
  this.objp0 = 0; // FF48h
  this.objp1 = 0; // FF49h
  this.wy    = 0; // FF4Ah
  this.wx    = 0; // FF4Bh

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

function renderTile(tile, line, x, y) {
  for (var bit = 0; bit < 8; bit++) {
    // A window may originate to the left of the screen
    if (x + bit < 0) {
      continue;
    }

    var b1 = (tile[line] >> (7 -bit)) & 0x1;
    var b2 = ( tile[line + 1] >> (7 - bit)) & 0x1;
    // OR the bits to get the color value for pixel
    var b  = b1 | b2 << 1;
    b = (this.bgp >> (b * 2)) & 0x3;
    var pixelIndex = (x + y * 160) + (bit * 4);
    var color = 255 - (b * 85);
    this.screen[pixelIndex++] = color;
    this.screen[pixelIndex++] = color;
    this.screen[pixelIndex++] = color;
    this.screen[pixelIndex] = 255;
  }
}

function renderBackground(y) {
  var px = 0;
  while (px < 160) {
    var x = (this.scx + px) & 0xFF;
    var tileOffsetX = x % 8;
    var tileOffsetY = (y % 8) * 2;
    var tileIndex = this.tileMap[this.getBgTileMapSelect()][util.mapPixelToTileMapAddress(x, y)];
    var tileAddr = util.mapTileToAddress(tileIndex, this.getTileDataSelect());
    var tile = this.tileData.subarray(tileAddr, tileAddr + 16);
    renderTile.call(this, tile, tileOffsetY, px, y);
    px += 8 - tileOffsetX;
  }
}

// TODO: test that this works
function renderWindow(y) {
  var px = this.wx;
  while (px < 160) {
    var x = px;
    var tileOffsetX = x % 8;
    var tileOffsetY = (y % 8) * 2;
    var tileIndex = this.tileMap[this.getWindowTileMapSelect()][util.mapPixelToTileMapAddress(x, y)];
    var tileAddr = util.mapTileToAddress(tileIndex, this.getTileDataSelect());
    var tile = this.tileData.subarray(tileAddr, tileAddr + 16);
    renderTile.call(this, tile, tileOffsetY, px - 7, y);
    px += 8 - tileOffsetX;
  }
}

// only handles background for now
GPU.prototype.renderScan = function() {
  var y = (this.scy + this.ly) & 0xFF;

  if (this.getBgDisplayEnable()) {
    renderBackground.call(this, y);
  }

  if (this.getWindowDisplayEnable()) {
    // renderWindow.call(this, y);
  }
};

GPU.prototype.read8 = function(addr) {

};

GPU.prototype.readVRAM = function(addr) {
};

GPU.prototype.writeVRAM = function(addr, val) {
};

GPU.prototype.readOAM = function(addr) {
};

GPU.prototype.writeOAM = function(addr, val) {
};

