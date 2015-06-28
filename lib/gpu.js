module.exports = GPU;

var util = require('./util');

function GPU() {
  this.oam  = new Uint8Array(0xA0);
  this.tileData = new Uint8Array(384 * 16);
  this.tileMap = [new Uint8Array(32 * 32), new Uint8Array(32 * 32)];
  this.screen = new Uint8ClampedArray(160 * 144 * 4);

  this.clock = 0;
  this.lcdc  = 0; // FF40h
  this.stat  = 0; // FF41h
  this.scy   = 0; // FF42h
  this.scx   = 0; // FF43h
  this.ly    = 0; // FF44h
  this.lyc   = 0; // FF45h
  this.bgp   = 0; // FF47h
  this.obp0  = 0; // FF48h
  this.obp1  = 0; // FF49h
  this.wy    = 0; // FF4Ah
  this.wx    = 0; // FF4Bh
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

GPU.prototype.execute = function(t, renderFn) {
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
          renderFn(this.screen);
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

        this.renderScan();
      }
      break;
  }
};

function renderTile(tile, tileX, tileY, x, y) {
  for (var bit = tileX; bit < 8; bit++) {
    // A window may originate to the left of the screen
    if (x + bit < 0) {
      continue;
    }

    var b1 = (tile[tileY * 2] >> (7 -bit)) & 0x1;
    var b2 = ( tile[tileY * 2 + 1] >> (7 - bit)) & 0x1;
    // OR the bits to get the color value for pixel
    var b  = b1 | b2 << 1;
    b = (this.bgp >> (b * 2)) & 0x3;
    var pixelIndex = (x * 4 + y * 160 * 4) + (bit * 4);
    var color = 255 - (b * 85);
    this.screen[pixelIndex++] = color;
    this.screen[pixelIndex++] = color;
    this.screen[pixelIndex++] = color;
    this.screen[pixelIndex] = 255;
  }
}

function renderBackground() {
  var ly = this.ly;
  var lx = 0;
  while (lx < 160) {
    var tx = (lx + this.scx & 255),
        ty = (ly + this.scy & 255);
    var tileIndex = this.tileMap[this.getBgTileMapSelect()][util.mapPixelToTileMapAddress(tx, ty)];
    var tileAddr = util.mapTileToAddress(tileIndex, this.getTileDataSelect());
    var tile = this.tileData.subarray(tileAddr, tileAddr + 16);
    var tileOffsetX = tx & 7;
    var tileOffsetY = ty & 7;
    renderTile.call(this, tile, tileOffsetX, tileOffsetY, lx, ly);
    lx += 8 - tileOffsetX;
  }
}

function renderWindow() {
  if (this.ly < this.wy || this.wy > 143) {
    return;
  }
  var wx = this.wx - 7;
  var ly = this.ly;
  var lx = wx;
  while (lx < 160) {
    var tx = lx - wx,
        ty = ly - this.wy;
    var tileIndex = this.tileMap[this.getWindowTileMapSelect()][util.mapPixelToTileMapAddress(tx, ty)];
    var tileAddr = util.mapTileToAddress(tileIndex, this.getTileDataSelect());
    var tile = this.tileData.subarray(tileAddr, tileAddr + 16);
    var tileOffsetX = tx & 7;
    var tileOffsetY = ty & 7;
    renderTile.call(this, tile, tileOffsetX, tileOffsetY, lx, ly);
    lx += 8 - tileOffsetX;
  }
}

GPU.prototype.renderScan = function() {
  if (this.getBgDisplayEnable()) {
    renderBackground.call(this);
  }

  if (this.getWindowDisplayEnable()) {
    renderWindow.call(this);
  }
};

GPU.prototype.debugScreen = function(lines) {
  lines = lines || 144;
  var line, screen = '';
  for (var y = 0; y < lines; y++) {
    line = '';
    for (var x = 0; x < 160; x++) {
      var p = Math.abs((this.screen[x * 4 + y * 160 * 4] / 85) - 3);
      line += p;
    }
    screen += line + '\n';
  }
  return screen;
};

GPU.prototype.read = function(addr) {
  switch (addr & 0xF000) {
    case 0x8000:
    case 0x9000:
      if (addr < 0x9800) {
        return this.tileData[addr & 0x17FF];
      } else {
        if (addr < 0x9C00) {
          return this.tileMap[0][addr & 0x3FF];
        } else {
          return this.tileMap[1][addr & 0x3FF];
        }
      }
    case 0xF000:
      switch (addr & 0x0F00) {
        case 0xE00:
          if (addr < 0xFEA0) {
            return this.oam[addr & 0x9F];
          } else {
            return 0;
          }
        case 0xF00:
          switch (addr & 0x00FF) {
            case 0x40:
              return this.lcdc;
            case 0x41:
              return this.stat;
            case 0x42:
              return this.scy;
            case 0x43:
              return this.scx;
            case 0x44:
              return this.ly;
            case 0x45:
              return this.lyc;
            case 0x46:
              // Write only - OAM DMA transfer
              return 0;
            case 0x47:
              return this.bgp;
            case 0x48:
              return this.obp0;
            case 0x49:
              return this.obp1;
            case 0x4A:
              return this.wy;
            case 0x4B:
              return this.wx;
            default:
              return 0;
          }
        default:
          return 0;
      }
    default:
      return 0;
  }
};

GPU.prototype.write = function(addr, val) {
  switch (addr & 0xF000) {
    case 0x8000:
    case 0x9000:
      if (addr < 0x9800) {
        this.tileData[addr & 0x17FF] = val;
      } else {
        if (addr < 0x9C00) {
          this.tileMap[0][addr & 0x3FF] = val;
        } else {
          this.tileMap[1][addr & 0x3FF] = val;
        }
      }
      break;
    case 0xF000:
      switch (addr & 0x0F00) {
        case 0xE00:
          if (addr < 0xFEA0) {
            this.oam[addr & 0x9F] = val;
          }
          break;
        case 0xF00:
          switch (addr & 0x00FF) {
            case 0x40:
              this.lcdc = val;
              break;
            case 0x41:
              this.stat = val;
              break;
            case 0x42:
              this.scy = val;
              break;
            case 0x43:
              this.scx = val;
              break;
            case 0x44:
              this.ly = val;
              break;
            case 0x45:
              this.lyc = val;
              break;
            case 0x46:
              // TODO: - OAM DMA transfer
              break;
            case 0x47:
              this.bgp = val;
              break;
            case 0x48:
              this.obp0 = val;
              break;
            case 0x49:
              this.obp1 = val;
              break;
            case 0x4A:
              this.wy = val;
              break;
            case 0x4B:
              this.wx = val;
              break;
          }
      }
  }
};
