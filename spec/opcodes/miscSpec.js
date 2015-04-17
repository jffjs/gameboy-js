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

  describe("SWAP A", function() {
    it("swaps upper and lower nibbles of A", function() {
      cpu.register.A = 0x15;
      ops[0xCB37]();
      expect(cpu.register.A).to.equal(0x51);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x00;
      ops[0xCB37]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N, H, and C flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      cpu.setFlag('C');
      cpu.register.A = 0x15;
      ops[0xCB37]();
      expect(cpu.flag.N()).to.equal(0);
      expect(cpu.flag.H()).to.equal(0);
      expect(cpu.flag.C()).to.equal(0);
    });
  });
});
