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
    it("initializes memory with all 0", function() {
      expect(mmu._memory[0]).to.equal(0);
      expect(mmu._memory[0xFFFE]).to.equal(0);
      expect(mmu._memory[0xAAAA]).to.equal(0);
      expect(mmu._memory[0x700]).to.equal(0);
    });
  });

  describe("read8", function() {
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
