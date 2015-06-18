/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var MMU = require('../lib/mmu');
var GPU = require('../lib/gpu');

describe("MMU", function() {
  var mmu, mockGPU;

  beforeEach(function() {
    var gpu = new GPU();
    mockGPU = sinon.mock(gpu);
    mmu = new MMU(gpu);
  });

  describe("new MMU", function() {
    it("has 256 byte bios", function() {
      expect(mmu.bios.length).to.equal(256);
    });

    it("has 32 kb of addressable cart ROM", function() {
      expect(mmu.ROM.length).to.equal(32768);
    });

    it("has 8 kb of addressable external RAM", function() {
      expect(mmu.eRAM.length).to.equal(8192);
    });

    it("has 8 kb of internal RAM", function() {
      expect(mmu.iRAM.length).to.equal(8192);
    });

    it("has 128 bytes of zero-page RAM", function() {
      expect(mmu.zRAM.length).to.equal(128);
    });
  });

  describe("read8", function() {
    it("reads from BIOS when address is less than 100h and inBIOS flag is true", function() {
      mmu.bios[0x50] = 0xAB;
      expect(mmu.read8(0x50)).to.equal(0xAB);
    });

    it("reads from ROM bank 0 when address is less than 100h and inBIOS flag is false", function() {
      mmu.ROM[0x50] = 0xAB;
      mmu.inBIOS = false;
      expect(mmu.read8(0x50)).to.equal(0xAB);
    });

    it("reads from from ROM bank 0 when address is less than 4000h", function() {
      mmu.ROM[0x500] = 0xAB;
      expect(mmu.read8(0x500)).to.equal(0xAB);
    });

    it("reads from switchable ROM bank when address is between 4000h and 8000h", function() {
      mmu.ROM[0x4500] = 0x12;
      expect(mmu.read8(0x4500)).to.equal(0x12);
    });

    it("reads from VRAM when address is between 8000h and A000h", function() {
      mockGPU.expects('read').once().withArgs(0x8050).returns(0x34);
      expect(mmu.read8(0x8050)).to.equal(0x34);
      mockGPU.verify();
    });

    it("reads from switchable RAM bank when address is between A000h and C000h", function() {
      mmu.eRAM[0x1100] = 0x34;
      expect(mmu.read8(0xB100)).to.equal(0x34);
    });

    it("reads from internal RAM when address is between C000h and E000h", function() {
      mmu.iRAM[0x1100] = 0x34;
      expect(mmu.read8(0xD100)).to.equal(0x34);
    });

    it("reads from echo of internal RAM when address between E000h and FE00h", function() {
      mmu.iRAM[0x100] = 0x34;
      mmu.iRAM[0x1D00] = 0xAB;
      expect(mmu.read8(0xFD00)).to.equal(0xAB);
      expect(mmu.read8(0xE100)).to.equal(0x34);
    });

    it("reads from sprite attribute memory when address between FE00h and FEA0h", function() {
      mockGPU.expects('read').once().withArgs(0xFE90).returns(0xAB);
      expect(mmu.read8(0xFE90)).to.equal(0xAB);
    });

    it("reads from gpu registers when address between FF40h and FF4Bh", function() {
      mockGPU.expects('read').once().withArgs(0xFF45).returns(0xAB);
      expect(mmu.read8(0xFF45)).to.equal(0xAB);
    });

    it("reads from zero-page memory when address greater or equal to FF80h", function() {
      mmu.zRAM[0x40] = 0x12;
      expect(mmu.read8(0xFFC0)).to.equal(0x12);
    });
  });

  describe("read16", function() {
    it("reads two-bytes at address", function() {
      mmu.ROM[0x200] = 0xFF;
      mmu.ROM[0x201] = 0x89;
      expect(mmu.read16(0x200)).to.equal(0x89FF);
    });
  });

  describe("write8", function() {
    it("cannot write to ROM", function() {
      mmu.ROM[0x200] = 0xFF;
      mmu.write8(0x200, 0x11);
      expect(mmu.ROM[0x200]).to.equal(0xFF);
    });

    it("writes to VRAM when address is between 8000h and A000h", function() {
      mockGPU.expects('write').once().withArgs(0x8050, 0x34);
      mmu.write8(0x8050, 0x34);
      mockGPU.verify();
    });

    it("writes to switchable RAM bank when address is between A000h and C000h", function() {
      mmu.write8(0xA200, 0xAB);
      expect(mmu.eRAM[0x200]).to.equal(0xAB);
    });

    it("writes to internal RAM when address is between C000h and E000h", function() {
      mmu.write8(0xD100, 0x34);
      expect(mmu.iRAM[0x1100]).to.equal(0x34);
    });

    it("writes to echo of internal RAM when address between E000h and FE00h", function() {
      mmu.write8(0xFD00, 0xAB);
      mmu.write8(0xE100, 0x34);
      expect(mmu.iRAM[0x100]).to.equal(0x34);
      expect(mmu.iRAM[0x1D00]).to.equal(0xAB);
    });

    it("writes to sprite attribute memory when address between FE00h and FEA0h", function() {
      mockGPU.expects('write').once().withArgs(0xFE90, 0xAB);
      mmu.write8(0xFE90, 0xAB);
      mockGPU.verify();
    });

    it("writes to gpu registers when address between FF40h and FF4Bh", function() {
      mockGPU.expects('write').once().withArgs(0xFF45, 0xAB);
      mmu.write8(0xFF45, 0xAB);
      mockGPU.verify();
    });

    it("writes to zero-page memory when address greater or equal to FF80h", function() {
      mmu.write8(0xFFC0, 0x12);
      expect(mmu.zRAM[0x40]).to.equal(0x12);
    });
  });

  describe("write16", function() {
    it("writes two-bytes at address", function() {
      mmu.write16(0xA200, 0x89FF);
      expect(mmu.eRAM[0x200]).to.equal(0xFF);
      expect(mmu.eRAM[0x201]).to.equal(0x89);
    });
  });
});
