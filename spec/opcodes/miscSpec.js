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
        expect(cpu.register.M).to.equal(2);
        expect(cpu.register.T).to.equal(8);
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
      expect(cpu.register.M).to.equal(4);
      expect(cpu.register.T).to.equal(16);
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
});
