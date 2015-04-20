/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var misc = require('../../lib/opcodes/misc');

describe("Misc opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = misc(cpu, mmu);
    cpu.pc = 0x200;
  });

  [
    { r: 'A', op: 0xCB37 },
    { r: 'B', op: 0xCB30 },
    { r: 'C', op: 0xCB31 },
    { r: 'D', op: 0xCB32 },
    { r: 'E', op: 0xCB33 },
    { r: 'H', op: 0xCB34 },
    { r: 'L', op: 0xCB35 }
  ].forEach(function(test) {
    describe("SWAP " + test.r, function() {
      it("swaps upper and lower nibbles of " + test.r, function() {
        cpu.register[test.r] = 0x15;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x51);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0x00;
        ops[test.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("resets N, H, and C flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        cpu.setFlag('C');
        cpu.register[test.r] = 0x15;
        ops[test.op]();
        expect(cpu.flag.N()).to.equal(0);
        expect(cpu.flag.H()).to.equal(0);
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });

  describe("SWAP (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2E;
      cpu.register.L = 0x93;
    });

    it("swaps upper and lower nibbles of value at address HL", function() {
      mockMMU.expects('read8').once().withArgs(0x2E93).returns(0x15);
      mockMMU.expects('write8').once().withArgs(0x2E93, 0x51);
      ops[0xCB36]();
      mockMMU.verify();
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB36]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0x00);
      ops[0xCB36]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N, H, and C flags", function() {
      mockMMU.expects('read8').returns(0x15);
      cpu.setFlag('N');
      cpu.setFlag('H');
      cpu.setFlag('C');
      ops[0xCB36]();
      expect(cpu.flag.N()).to.equal(0);
      expect(cpu.flag.H()).to.equal(0);
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("DAA", function() {
    // N: N flag before
    // C1: C flag before
    // H: H flag before
    // A1: value of A register before
    // A2: value of A register after
    // C2: C flag after
    // Z: Z flag after
    [
      { N: 0, C1: 0, H: 0, A1: 0x99, A2: 0x99, C2: 0, Z: 0 },
      { N: 0, C1: 0, H: 0, A1: 0x8A, A2: 0x90, C2: 0, Z: 0 },
      { N: 0, C1: 0, H: 1, A1: 0x90, A2: 0x96, C2: 0, Z: 0 },
      { N: 0, C1: 0, H: 0, A1: 0xA9, A2: 0x09, C2: 1, Z: 0 },
      { N: 0, C1: 0, H: 0, A1: 0x9A, A2: 0x00, C2: 1, Z: 1 },
      { N: 0, C1: 0, H: 1, A1: 0xA3, A2: 0x09, C2: 1, Z: 0 },
      { N: 0, C1: 1, H: 0, A1: 0x15, A2: 0x75, C2: 1, Z: 0 },
      { N: 0, C1: 1, H: 0, A1: 0x1A, A2: 0x80, C2: 1, Z: 0 },
      { N: 0, C1: 1, H: 1, A1: 0x33, A2: 0x99, C2: 1, Z: 0 },
      { N: 1, C1: 0, H: 0, A1: 0x89, A2: 0x89, C2: 0, Z: 0 },
      { N: 1, C1: 0, H: 1, A1: 0x86, A2: 0x80, C2: 0, Z: 0 },
      { N: 1, C1: 1, H: 0, A1: 0x70, A2: 0x10, C2: 1, Z: 0 },
      { N: 1, C1: 1, H: 1, A1: 0x6A, A2: 0x04, C2: 1, Z: 0 },
      { N: 0, C1: 1, H: 1, A1: 0x45, A2: 0x45, C2: 1, Z: 0 }
    ].forEach(function(test) {
      it("adjusts A register according to flags when A = " + test.A1, function() {
        test.N ? cpu.setFlag('N') : cpu.resetFlag('N');
        test.C1 ? cpu.setFlag('C') : cpu.resetFlag('C');
        test.H ? cpu.setFlag('H') : cpu.resetFlag('H');
        cpu.register.A = test.A1;
        ops[0x27]();
        expect(cpu.register.A).to.equal(test.A2);
        expect(cpu.flag.C()).to.equal(test.C2);
        expect(cpu.flag.Z()).to.equal(test.Z);
      });

      it("takes 1 machine cycle", function() {
        expect(ops[0x27]()).to.equal(1);
      });
    });
  });

  describe("CPL", function() {
    it("flips bits of A", function() {
      cpu.register.A = 0xF0;
      ops[0x2F]();
      expect(cpu.register.A).to.equal(0x0F);
    });

    it("sets N and H flags", function() {
      ops[0x2F]();
      expect(cpu.flag.N()).to.equal(1);
      expect(cpu.flag.H()).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x2F]()).to.equal(1);
    });
  });

  describe("CCF", function() {
    it("complements carry flag", function() {
      cpu.setFlag('C');
      ops[0x3F]();
      expect(cpu.flag.C()).to.equal(0);
      ops[0x3F]();
      expect(cpu.flag.C()).to.equal(1);
    });

    it("resets N and H flags", function() {
      ops[0x3F]();
      expect(cpu.flag.N()).to.equal(0);
      expect(cpu.flag.H()).to.equal(0);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x3F]()).to.equal(1);
    });
  });

  describe("SCF", function() {
    it("sets carry flag", function() {
      ops[0x37]();
      expect(cpu.flag.C()).to.equal(1);
    });

    it("resets N and H flags", function() {
      ops[0x37]();
      expect(cpu.flag.N()).to.equal(0);
      expect(cpu.flag.H()).to.equal(0);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x37]()).to.equal(1);
    });
  });
});
