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
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xC3]()).to.equal(3);
    });
  });

  describe("JP NZ,nn", function() {
    it("jumps to 16-bit immediate value nn if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xC2]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xC2]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xC2]()).to.equal(3);
    });
  });

  describe("JP Z,nn", function() {
    it("jumps to 16-bit immediate value nn if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xCA]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xCA]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xCA]()).to.equal(3);
    });
  });
  
  describe("JP NC,nn", function() {
    it("jumps to 16-bit immediate value nn if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xD2]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xD2]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xD2]()).to.equal(3);
    });
  });

  describe("JP C,nn", function() {
    it("jumps to 16-bit immediate value nn if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xDA]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xDA]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xDA]()).to.equal(3);
    });
  });
});
