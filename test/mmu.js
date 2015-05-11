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
      mockGPU.expects('read').once().withArgs(0x50).returns(0x34);
      expect(mmu.read8(0x8050)).to.equal(0x34);
      mockGPU.verify();
    });
  });

  describe.skip("read16", function() {
    it("reads two-bytes at address, most significant byte is in address specified", function() {
      mmu._memory[0x200] = 0xFF;
      mmu._memory[0x201] = 0x89;
      expect(mmu.read16(0x201)).to.equal(0x89FF);
    });
  });
});
