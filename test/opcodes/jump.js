/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var jump = require('../../lib/opcodes/jump');

describe("Jump opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = jump(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("JP nn", function() {
    it("jumps to 16-bit immediate value nn", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xC3]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
    });

    it("does not increment program counter", function() {
      ops[0xC3]();
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xC3]()).to.equal(3);
    });
  });
});
