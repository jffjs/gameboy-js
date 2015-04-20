/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var bitwise = require('../../lib/opcodes/bitwise');

describe.only("Bitwise opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = bitwise(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("RLCA", function() {
    it("rotates A left, copying bit 7 into carry flag and to bit 0", function() {
      cpu.register.A = 0xB4;
      ops[0x07]();
      expect(cpu.register.A).to.equal(0x69);
      expect(cpu.flag.C()).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x07]()).to.equal(1);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0x07]();
      expect(cpu.checkFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0x07]();
      expect(cpu.checkFlag('N')).to.equal(0);
      expect(cpu.checkFlag('H')).to.equal(0);
    });
  });

  describe("RLA", function() {
    it("roates A left through carry flag", function() {
      cpu.register.A = 0xB4;
      cpu.setFlag('C');
      ops[0x17]();
      expect(cpu.register.A).to.equal(0x69);
      expect(cpu.checkFlag('C')).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x17]()).to.equal(1);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0x17]();
      expect(cpu.checkFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0x17]();
      expect(cpu.checkFlag('N')).to.equal(0);
      expect(cpu.checkFlag('H')).to.equal(0);
    });
  });
});
