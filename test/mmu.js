/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var MMU = require('../lib/mmu');

describe("MMU", function() {
  var mmu;

  beforeEach(function() {
    mmu = new MMU();
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

  describe.skip("read8", function() {
    it("returns byte at address", function() {
      mmu._memory[0x200] = 0xFF;
      expect(mmu.read8(0x200)).to.equal(0xFF);
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
