/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var GPU = require('../lib/gpu');

describe("GPU", function() {
  var gpu;

  beforeEach(function() {
    gpu = new GPU();
  });

  describe("mode", function() {
    describe("get", function() {
      it("returns mode from status register", function() {
        gpu.status = 0xF3;
        expect(gpu.getMode()).to.equal(3);
        gpu.status = 0xF2;
        expect(gpu.getMode()).to.equal(2);
        gpu.status = 0xF1;
        expect(gpu.getMode()).to.equal(1);
        gpu.status = 0xF0;
        expect(gpu.getMode()).to.equal(0);
      });
    });

    describe("set", function() {
      it("sets mode in status register", function() {
        gpu.setMode(3);
        expect(gpu.status).to.equal(0x3);
        gpu.setMode(2);
        expect(gpu.status).to.equal(0x2);
        gpu.setMode(1);
        expect(gpu.status).to.equal(0x1);
        gpu.setMode(0);
        expect(gpu.status).to.equal(0x0);
      });
    });
  });

  describe("getLCDEnable", function() {
    it("returns LCD enable flag from LCD Control register", function() {
      gpu.lcdc = 0x8F;
      expect(gpu.getLCDEnable()).to.equal(1);
      gpu.lcdc = 0x7F;
      expect(gpu.getLCDEnable()).to.equal(0);
    });
  });

  describe("getWindowTileMapSelect", function() {
    it("returns Window Tile Map Select from LCD Control register", function() {
      gpu.lcdc = 0x4F;
      expect(gpu.getWindowTileMapSelect()).to.equal(1);
      gpu.lcdc = 0x2F;
      expect(gpu.getWindowTileMapSelect()).to.equal(0);
    });
  });

  describe("getWindowDisplayEnable", function() {
    it("returns Window Display Enable bit from LCD Control register", function() {
      gpu.lcdc = 0x2F;
      expect(gpu.getWindowDisplayEnable()).to.equal(1);
      gpu.lcdc = 0x1F;
      expect(gpu.getWindowDisplayEnable()).to.equal(0);
    });
  });

  describe("getTileDataSelect", function() {
    it("returns Tile Data Select bit from LCD Control register", function() {
      gpu.lcdc = 0x1F;
      expect(gpu.getTileDataSelect()).to.equal(1);
      gpu.lcdc = 0x2F;
      expect(gpu.getTileDataSelect()).to.equal(0);
    });
  });

  describe("getBackgroundTileMapSelect", function() {
    it("returns Background Tile Map Select bit from LCD Control register", function() {
      gpu.lcdc = 0xF8;
      expect(gpu.getBackgroundTileMapSelect()).to.equal(1);
      gpu.lcdc = 0x22;
      expect(gpu.getBackgroundTileMapSelect()).to.equal(0);
    });
  });

  describe("getObjSizeSelect", function() {
    it("returns Obj Size Select bit from LCD Control register", function() {
      gpu.lcdc = 0xF4;
      expect(gpu.getObjSizeSelect()).to.equal(1);
      gpu.lcdc = 0x22;
      expect(gpu.getObjSizeSelect()).to.equal(0);
    });
  });

  describe("getObjDisplayEnable", function() {
    it("returns Obj Display Enable bit from LCD Control register", function() {
      gpu.lcdc = 0xF2;
      expect(gpu.getObjDisplayEnable()).to.equal(1);
      gpu.lcdc = 0x24;
      expect(gpu.getObjDisplayEnable()).to.equal(0);
    });
  });

  describe("getBackgroundDisplayEnable", function() {
    it("returns Background Display Enable bit from LCD Control register", function() {
      gpu.lcdc = 0xF1;
      expect(gpu.getBackgroundDisplayEnable()).to.equal(1);
      gpu.lcdc = 0x22;
      expect(gpu.getBackgroundDisplayEnable()).to.equal(0);
    });
  });

  describe("getTile", function() {
    beforeEach(function() {
      for (var i = 0; i < 384 * 16; i++) {
        gpu.tileData[i] = i+1;
      }
    });

    describe("tile data select = 1", function() {
      it("returns specified tile (tile number 0 to 256)", function() {
        gpu.lcdc = 0x10;
        var tile = gpu.getTile(0);
        expect(tile.length).to.equal(16);
        expect(tile[0]).to.equal(gpu.tileData[0]);
        expect(tile[1]).to.equal(gpu.tileData[1]);
        expect(tile[2]).to.equal(gpu.tileData[2]);
        expect(tile[15]).to.equal(gpu.tileData[15]);

        tile = gpu.getTile(45);
        expect(tile[0]).to.equal(gpu.tileData[720]);
        expect(tile[1]).to.equal(gpu.tileData[721]);
        expect(tile[15]).to.equal(gpu.tileData[735]);
      });
    });

    describe("tile data select = 0", function() {
      it("returns specified tile (tile number -128 to 127)", function() {
        var tile = gpu.getTile(-128);
        expect(tile.length).to.equal(16);
        expect(tile[0]).to.equal(gpu.tileData[2048]);
        expect(tile[1]).to.equal(gpu.tileData[2049]);
        expect(tile[2]).to.equal(gpu.tileData[2050]);
        expect(tile[15]).to.equal(gpu.tileData[2063]);

        tile = gpu.getTile(50);
        console.log(tile[0]);
        console.log(gpu.tileData[5696]);
        expect(tile[0]).to.equal(gpu.tileData[4896]);
        expect(tile[1]).to.equal(gpu.tileData[4897]);
        expect(tile[15]).to.equal(gpu.tileData[4911]);
      });
    });

    describe("tile data sets overlap", function() {
      it("returns the same tile between 128 to 255 (1) and -128 to -1 (0)", function() {
        gpu.lcdc = 0;
        var a0 = gpu.getTile(-128);
        var b0 = gpu.getTile(-56);
        var c0 = gpu.getTile(-1);
        gpu.lcdc = 0x10;
        var a1 = gpu.getTile(128);
        var b1 = gpu.getTile(200);
        var c1 = gpu.getTile(255);
        expect(a0).to.eql(a1);
        expect(b0).to.eql(b1);
        expect(c0).to.eql(c1);
      });
    });
  });

  describe("execute", function() {
    it("increments clock by t", function() {
      gpu.clock = 2;
      gpu.execute(8);
      expect(gpu.clock).to.equal(10);
    });

    describe("mode 0", function() {
      beforeEach(function() {
        gpu.setMode(0);
        gpu.line = 10;
        gpu.clock = 200;
      });

      it("resets clock at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.clock).to.equal(0);
      });

      it("increments line number at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.line).to.equal(11);
      });

      it("switches to mode 2 at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.getMode()).to.equal(2);
      });

      it("switches to mode 1 after 143 lines", function () {
        gpu.line = 142;
        gpu.execute(4);
        expect(gpu.getMode()).to.equal(1);
      });
    });

    describe("mode 1", function() {
      beforeEach(function() {
        gpu.setMode(1);
        gpu.line = 144;
        gpu.clock = 453;
      });

      it("resets clock at 456 ticks", function() {
        gpu.execute(4);
        expect(gpu.clock).to.equal(0);
      });

      it("increments line number at 456 ticks", function() {
        gpu.execute(4);
        expect(gpu.line).to.equal(145);
      });

      it("switches to mode 2 at 456 ticks after 10 lines", function() {
        gpu.line = 153;
        gpu.execute(4);
        expect(gpu.getMode()).to.equal(2);
      });

      it("resets line count at 456 ticks after 10 lines", function() {
        gpu.line = 153;
        gpu.execute(4);
        expect(gpu.line).to.equal(0);
      });
    });

    describe("mode 2", function() {
      beforeEach(function() {
        gpu.clock = 79;
        gpu.setMode(2);
        gpu.execute(2);
      });

      it("resets clock at 80 ticks", function() {
        expect(gpu.clock).to.equal(0);
      });

      it("switches to mode 3 at 80 ticks", function() {
        expect(gpu.getMode()).to.equal(3);
      });
    });

    describe("mode 3", function() {
      beforeEach(function() {
        gpu.clock = 170;
        gpu.setMode(3);
        gpu.execute(2);
      });

      it("resets clock at 172 ticks", function() {
        expect(gpu.clock).to.equal(0);
      });

      it("switches to mode 0 at 172 ticks", function() {
        expect(gpu.getMode()).to.equal(0);
      });
    });
  });
});
