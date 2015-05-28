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

  describe("getBgTileMapSelect", function() {
    it("returns Background Tile Map Select bit from LCD Control register", function() {
      gpu.lcdc = 0xF8;
      expect(gpu.getBgTileMapSelect()).to.equal(1);
      gpu.lcdc = 0x22;
      expect(gpu.getBgTileMapSelect()).to.equal(0);
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

  describe("getBgDisplayEnable", function() {
    it("returns Background Display Enable bit from LCD Control register", function() {
      gpu.lcdc = 0xF1;
      expect(gpu.getBgDisplayEnable()).to.equal(1);
      gpu.lcdc = 0x22;
      expect(gpu.getBgDisplayEnable()).to.equal(0);
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
        gpu.ly = 10;
        gpu.clock = 200;
      });

      it("resets clock at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.clock).to.equal(0);
      });

      it("increments line number at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.ly).to.equal(11);
      });

      it("switches to mode 2 at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.getMode()).to.equal(2);
      });

      it("switches to mode 1 after 143 lines", function () {
        gpu.ly = 142;
        gpu.execute(4);
        expect(gpu.getMode()).to.equal(1);
      });
    });

    describe("mode 1", function() {
      beforeEach(function() {
        gpu.setMode(1);
        gpu.ly = 144;
        gpu.clock = 453;
      });

      it("resets clock at 456 ticks", function() {
        gpu.execute(4);
        expect(gpu.clock).to.equal(0);
      });

      it("increments line number at 456 ticks", function() {
        gpu.execute(4);
        expect(gpu.ly).to.equal(145);
      });

      it("switches to mode 2 at 456 ticks after 10 lines", function() {
        gpu.ly = 153;
        gpu.execute(4);
        expect(gpu.getMode()).to.equal(2);
      });

      it("resets line count at 456 ticks after 10 lines", function() {
        gpu.ly = 153;
        gpu.execute(4);
        expect(gpu.ly).to.equal(0);
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

  describe("renderScan", function() {
    beforeEach(function() {
      gpu.ly = 0;
      gpu.scx = 80;
      gpu.scy = 0;
      gpu.wx = 7;
      gpu.wy = 3;
      gpu.lcdc = 0x31; // Window enable, tile data = 1, bg enable
      gpu.bgp = 0xE4; // 3-2-1-0

      for(var i = 0; i < 10; i++) {
        gpu.tileMap[0][10 + i] = 10;
        gpu.tileMap[0][i] = 11;
      }
      gpu.tileMap[0][1] = 1;

      for(i = 0; i < 16; i+=2) {
        // Tile 1
        gpu.tileData[16 + i] = 0xFF;
        gpu.tileData[16+i+1] = 0xF0;

        // Tile 10 is all color = 1;
        gpu.tileData[160+i] = 0xFF;
        gpu.tileData[160+i+1] = 0x0;

        // Tile 11 is all color = 2;
        gpu.tileData[176+i] = 0x0;
        gpu.tileData[176+i+1] = 0xFF;
      }
    });

    it.only("renders line ly to screen as array of RGBA values", function() {
      for(var i =0; i < 8; i++) {
        gpu.ly = i;
        gpu.renderScan();
      }
      // console.log(gpu.screen.subarray(0,100));
      console.log(gpu.debugScreen(10));

      // expect(gpu.screen[0]).to.equal(170); // R
      // expect(gpu.screen[1]).to.equal(170); // G
      // expect(gpu.screen[2]).to.equal(170); // B
      // expect(gpu.screen[3]).to.equal(255); // A
      // expect(gpu.screen[4]).to.equal(170); // R
      // expect(gpu.screen[5]).to.equal(170); // G
      // expect(gpu.screen[6]).to.equal(170); // B
      // expect(gpu.screen[7]).to.equal(255); // A
    });

    it("renders window over background", function() {
    });
  });
});
