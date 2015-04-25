/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var bit = require('../../lib/opcodes/bit');

describe("Bit opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = bit(cpu, mmu);
    cpu.pc = 0x200;
  });

  [
    { b: 0, r: 'A', op: 0xCB47, value: 0x41 },
    { b: 0, r: 'B', op: 0xCB40, value: 0x41 },
    { b: 0, r: 'C', op: 0xCB41, value: 0x41 },
    { b: 0, r: 'D', op: 0xCB42, value: 0x41 },
    { b: 0, r: 'E', op: 0xCB43, value: 0x41 },
    { b: 0, r: 'H', op: 0xCB44, value: 0x41 },
    { b: 0, r: 'L', op: 0xCB45, value: 0x41 },
    { b: 1, r: 'A', op: 0xCB4F, value: 0x42 },
    { b: 1, r: 'B', op: 0xCB48, value: 0x42 },
    { b: 1, r: 'C', op: 0xCB49, value: 0x42 },
    { b: 1, r: 'D', op: 0xCB4A, value: 0x42 },
    { b: 1, r: 'E', op: 0xCB4B, value: 0x42 },
    { b: 1, r: 'H', op: 0xCB4C, value: 0x42 },
    { b: 1, r: 'L', op: 0xCB4D, value: 0x42 },
    { b: 2, r: 'A', op: 0xCB57, value: 0x44 },
    { b: 2, r: 'B', op: 0xCB50, value: 0x44 },
    { b: 2, r: 'C', op: 0xCB51, value: 0x44 },
    { b: 2, r: 'D', op: 0xCB52, value: 0x44 },
    { b: 2, r: 'E', op: 0xCB53, value: 0x44 },
    { b: 2, r: 'H', op: 0xCB54, value: 0x44 },
    { b: 2, r: 'L', op: 0xCB55, value: 0x44 },
    { b: 3, r: 'A', op: 0xCB5F, value: 0x48 },
    { b: 3, r: 'B', op: 0xCB58, value: 0x48 },
    { b: 3, r: 'C', op: 0xCB59, value: 0x48 },
    { b: 3, r: 'D', op: 0xCB5A, value: 0x48 },
    { b: 3, r: 'E', op: 0xCB5B, value: 0x48 },
    { b: 3, r: 'H', op: 0xCB5C, value: 0x48 },
    { b: 3, r: 'L', op: 0xCB5D, value: 0x48 },
    { b: 4, r: 'A', op: 0xCB67, value: 0x14 },
    { b: 4, r: 'B', op: 0xCB60, value: 0x14 },
    { b: 4, r: 'C', op: 0xCB61, value: 0x14 },
    { b: 4, r: 'D', op: 0xCB62, value: 0x14 },
    { b: 4, r: 'E', op: 0xCB63, value: 0x14 },
    { b: 4, r: 'H', op: 0xCB64, value: 0x14 },
    { b: 4, r: 'L', op: 0xCB65, value: 0x14 },
    { b: 5, r: 'A', op: 0xCB6F, value: 0x28 },
    { b: 5, r: 'B', op: 0xCB68, value: 0x28 },
    { b: 5, r: 'C', op: 0xCB69, value: 0x28 },
    { b: 5, r: 'D', op: 0xCB6A, value: 0x28 },
    { b: 5, r: 'E', op: 0xCB6B, value: 0x28 },
    { b: 5, r: 'H', op: 0xCB6C, value: 0x28 },
    { b: 5, r: 'L', op: 0xCB6D, value: 0x28 },
    { b: 6, r: 'A', op: 0xCB77, value: 0x44 },
    { b: 6, r: 'B', op: 0xCB70, value: 0x44 },
    { b: 6, r: 'C', op: 0xCB71, value: 0x44 },
    { b: 6, r: 'D', op: 0xCB72, value: 0x44 },
    { b: 6, r: 'E', op: 0xCB73, value: 0x44 },
    { b: 6, r: 'H', op: 0xCB74, value: 0x44 },
    { b: 6, r: 'L', op: 0xCB75, value: 0x44 },
    { b: 7, r: 'A', op: 0xCB7F, value: 0x88 },
    { b: 7, r: 'B', op: 0xCB78, value: 0x88 },
    { b: 7, r: 'C', op: 0xCB79, value: 0x88 },
    { b: 7, r: 'D', op: 0xCB7A, value: 0x88 },
    { b: 7, r: 'E', op: 0xCB7B, value: 0x88 },
    { b: 7, r: 'H', op: 0xCB7C, value: 0x88 },
    { b: 7, r: 'L', op: 0xCB7D, value: 0x88 }
  ].forEach(function(test) {
    describe("BIT " + test.b + "," + test.r, function() {
      it("resets Z flag if bit " + test.b + " of " + test.r + " is 1", function() {
        cpu.setFlag('Z');
        cpu.register[test.r] = test.value;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(0);
      });

      it("sets Z flag if bit " + test.b + " is 0", function() {
        cpu.resetFlag('Z');
        cpu.register[test.r] = test.value >> 1;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("sets H flag", function() {
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N flag", function() {
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });
    });
  });

  [
    { b: 0, op: 0xCB46, value: 0x41 },
    { b: 1, op: 0xCB4E, value: 0x42 },
    { b: 2, op: 0xCB56, value: 0x44 },
    { b: 3, op: 0xCB5E, value: 0x48 },
    { b: 4, op: 0xCB66, value: 0x14 },
    { b: 5, op: 0xCB6E, value: 0x28 },
    { b: 6, op: 0xCB76, value: 0x44 },
    { b: 7, op: 0xCB7E, value: 0x88 }
  ].forEach(function(test) {
    describe("BIT " + test.b + ",(HL)", function() {
      beforeEach(function() {
        cpu.register.H = 0x2C;
        cpu.register.L = 0x83;
      });

      it("resets Z flag if bit " + test.b + " of value at address HL is 1", function() {
        mockMMU.expects('read8').once().withArgs(0x2C83).returns(test.value);
        cpu.setFlag('Z');
        ops[test.op]();
        mockMMU.verify();
        expect(cpu.testFlag('Z')).to.equal(0);
      });

      it("sets Z flag if bit " + test.b + " is 0", function() {
        mockMMU.expects('read8').once().withArgs(0x2C83).returns(test.value >> 1);
        cpu.resetFlag('Z');
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("sets H flag", function() {
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N flag", function() {
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
      });

      it("takes 4 machine cycles", function() {
        expect(ops[test.op]()).to.equal(4);
      });
    });
  });

  [
    { b: 0, r: 'A', op: 0xCBC7, value: 0x01 },
    { b: 0, r: 'B', op: 0xCBC0, value: 0x01 },
    { b: 0, r: 'C', op: 0xCBC1, value: 0x01 },
    { b: 0, r: 'D', op: 0xCBC2, value: 0x01 },
    { b: 0, r: 'E', op: 0xCBC3, value: 0x01 },
    { b: 0, r: 'H', op: 0xCBC4, value: 0x01 },
    { b: 0, r: 'L', op: 0xCBC5, value: 0x01 },
    { b: 1, r: 'A', op: 0xCBCF, value: 0x02 },
    { b: 1, r: 'B', op: 0xCBC8, value: 0x02 },
    { b: 1, r: 'C', op: 0xCBC9, value: 0x02 },
    { b: 1, r: 'D', op: 0xCBCA, value: 0x02 },
    { b: 1, r: 'E', op: 0xCBCB, value: 0x02 },
    { b: 1, r: 'H', op: 0xCBCC, value: 0x02 },
    { b: 1, r: 'L', op: 0xCBCD, value: 0x02 },
    { b: 2, r: 'A', op: 0xCBD7, value: 0x04 },
    { b: 2, r: 'B', op: 0xCBD0, value: 0x04 },
    { b: 2, r: 'C', op: 0xCBD1, value: 0x04 },
    { b: 2, r: 'D', op: 0xCBD2, value: 0x04 },
    { b: 2, r: 'E', op: 0xCBD3, value: 0x04 },
    { b: 2, r: 'H', op: 0xCBD4, value: 0x04 },
    { b: 2, r: 'L', op: 0xCBD5, value: 0x04 },
    { b: 3, r: 'A', op: 0xCBDF, value: 0x08 },
    { b: 3, r: 'B', op: 0xCBD8, value: 0x08 },
    { b: 3, r: 'C', op: 0xCBD9, value: 0x08 },
    { b: 3, r: 'D', op: 0xCBDA, value: 0x08 },
    { b: 3, r: 'E', op: 0xCBDB, value: 0x08 },
    { b: 3, r: 'H', op: 0xCBDC, value: 0x08 },
    { b: 3, r: 'L', op: 0xCBDD, value: 0x08 },
    { b: 4, r: 'A', op: 0xCBE7, value: 0x10 },
    { b: 4, r: 'B', op: 0xCBE0, value: 0x10 },
    { b: 4, r: 'C', op: 0xCBE1, value: 0x10 },
    { b: 4, r: 'D', op: 0xCBE2, value: 0x10 },
    { b: 4, r: 'E', op: 0xCBE3, value: 0x10 },
    { b: 4, r: 'H', op: 0xCBE4, value: 0x10 },
    { b: 4, r: 'L', op: 0xCBE5, value: 0x10 },
    { b: 5, r: 'A', op: 0xCBEF, value: 0x20 },
    { b: 5, r: 'B', op: 0xCBE8, value: 0x20 },
    { b: 5, r: 'C', op: 0xCBE9, value: 0x20 },
    { b: 5, r: 'D', op: 0xCBEA, value: 0x20 },
    { b: 5, r: 'E', op: 0xCBEB, value: 0x20 },
    { b: 5, r: 'H', op: 0xCBEC, value: 0x20 },
    { b: 5, r: 'L', op: 0xCBED, value: 0x20 },
    { b: 6, r: 'A', op: 0xCBF7, value: 0x40 },
    { b: 6, r: 'B', op: 0xCBF0, value: 0x40 },
    { b: 6, r: 'C', op: 0xCBF1, value: 0x40 },
    { b: 6, r: 'D', op: 0xCBF2, value: 0x40 },
    { b: 6, r: 'E', op: 0xCBF3, value: 0x40 },
    { b: 6, r: 'H', op: 0xCBF4, value: 0x40 },
    { b: 6, r: 'L', op: 0xCBF5, value: 0x40 },
    { b: 7, r: 'A', op: 0xCBFF, value: 0x80 },
    { b: 7, r: 'B', op: 0xCBF8, value: 0x80 },
    { b: 7, r: 'C', op: 0xCBF9, value: 0x80 },
    { b: 7, r: 'D', op: 0xCBFA, value: 0x80 },
    { b: 7, r: 'E', op: 0xCBFB, value: 0x80 },
    { b: 7, r: 'H', op: 0xCBFC, value: 0x80 },
    { b: 7, r: 'L', op: 0xCBFD, value: 0x80 }
  ].forEach(function(test) {
    describe("SET " + test.b + "," + test.r, function() {
      it("sets bit " + test.b + " of A", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(test.value);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });
    });
  });

  [
    { b: 0, op: 0xCBC6, value: 0x01 },
    { b: 1, op: 0xCBCE, value: 0x02 },
    { b: 2, op: 0xCBD6, value: 0x04 },
    { b: 3, op: 0xCBDE, value: 0x08 },
    { b: 4, op: 0xCBE6, value: 0x10 },
    { b: 5, op: 0xCBEE, value: 0x20 },
    { b: 6, op: 0xCBF6, value: 0x40 },
    { b: 7, op: 0xCBFE, value: 0x80 }
  ].forEach(function(test) {
    describe("SET " + test.b + ",(HL)", function() {
      beforeEach(function() {
        cpu.register.H = 0x2C;
        cpu.register.L = 0x83;
      });

      it("sets bit " + test.b + " of value at address HL", function() {
        mockMMU.expects('read8').once().withArgs(0x2C83).returns(0);
        mockMMU.expects('write8').once().withArgs(0x2C83, test.value);
        ops[test.op]();
        mockMMU.verify();
      });

      it("takes 4 machine cycles", function() {
        expect(ops[test.op]()).to.equal(4);
      });
    });
  });

  [
    { b: 0, r: 'A', op: 0xCB87, value: 0x01 },
    { b: 0, r: 'B', op: 0xCB80, value: 0x01 },
    { b: 0, r: 'C', op: 0xCB81, value: 0x01 },
    { b: 0, r: 'D', op: 0xCB82, value: 0x01 },
    { b: 0, r: 'E', op: 0xCB83, value: 0x01 },
    { b: 0, r: 'H', op: 0xCB84, value: 0x01 },
    { b: 0, r: 'L', op: 0xCB85, value: 0x01 },
    { b: 1, r: 'A', op: 0xCB8F, value: 0x02 },
    { b: 1, r: 'B', op: 0xCB88, value: 0x02 },
    { b: 1, r: 'C', op: 0xCB89, value: 0x02 },
    { b: 1, r: 'D', op: 0xCB8A, value: 0x02 },
    { b: 1, r: 'E', op: 0xCB8B, value: 0x02 },
    { b: 1, r: 'H', op: 0xCB8C, value: 0x02 },
    { b: 1, r: 'L', op: 0xCB8D, value: 0x02 },
    { b: 2, r: 'A', op: 0xCB97, value: 0x04 },
    { b: 2, r: 'B', op: 0xCB90, value: 0x04 },
    { b: 2, r: 'C', op: 0xCB91, value: 0x04 },
    { b: 2, r: 'D', op: 0xCB92, value: 0x04 },
    { b: 2, r: 'E', op: 0xCB93, value: 0x04 },
    { b: 2, r: 'H', op: 0xCB94, value: 0x04 },
    { b: 2, r: 'L', op: 0xCB95, value: 0x04 },
    { b: 3, r: 'A', op: 0xCB9F, value: 0x08 },
    { b: 3, r: 'B', op: 0xCB98, value: 0x08 },
    { b: 3, r: 'C', op: 0xCB99, value: 0x08 },
    { b: 3, r: 'D', op: 0xCB9A, value: 0x08 },
    { b: 3, r: 'E', op: 0xCB9B, value: 0x08 },
    { b: 3, r: 'H', op: 0xCB9C, value: 0x08 },
    { b: 3, r: 'L', op: 0xCB9D, value: 0x08 },
    { b: 4, r: 'A', op: 0xCBA7, value: 0x10 },
    { b: 4, r: 'B', op: 0xCBA0, value: 0x10 },
    { b: 4, r: 'C', op: 0xCBA1, value: 0x10 },
    { b: 4, r: 'D', op: 0xCBA2, value: 0x10 },
    { b: 4, r: 'E', op: 0xCBA3, value: 0x10 },
    { b: 4, r: 'H', op: 0xCBA4, value: 0x10 },
    { b: 4, r: 'L', op: 0xCBA5, value: 0x10 },
    { b: 5, r: 'A', op: 0xCBAF, value: 0x20 },
    { b: 5, r: 'B', op: 0xCBA8, value: 0x20 },
    { b: 5, r: 'C', op: 0xCBA9, value: 0x20 },
    { b: 5, r: 'D', op: 0xCBAA, value: 0x20 },
    { b: 5, r: 'E', op: 0xCBAB, value: 0x20 },
    { b: 5, r: 'H', op: 0xCBAC, value: 0x20 },
    { b: 5, r: 'L', op: 0xCBAD, value: 0x20 },
    { b: 6, r: 'A', op: 0xCBB7, value: 0x40 },
    { b: 6, r: 'B', op: 0xCBB0, value: 0x40 },
    { b: 6, r: 'C', op: 0xCBB1, value: 0x40 },
    { b: 6, r: 'D', op: 0xCBB2, value: 0x40 },
    { b: 6, r: 'E', op: 0xCBB3, value: 0x40 },
    { b: 6, r: 'H', op: 0xCBB4, value: 0x40 },
    { b: 6, r: 'L', op: 0xCBB5, value: 0x40 },
    { b: 7, r: 'A', op: 0xCBBF, value: 0x80 },
    { b: 7, r: 'B', op: 0xCBB8, value: 0x80 },
    { b: 7, r: 'C', op: 0xCBB9, value: 0x80 },
    { b: 7, r: 'D', op: 0xCBBA, value: 0x80 },
    { b: 7, r: 'E', op: 0xCBBB, value: 0x80 },
    { b: 7, r: 'H', op: 0xCBBC, value: 0x80 },
    { b: 7, r: 'L', op: 0xCBBD, value: 0x80 }
  ].forEach(function(test) {
    describe("RES " + test.b + "," + test.r, function() {
      it("resets bit " + test.b + " of A", function() {
        cpu.register[test.r] = test.value;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });
    });
  });

  [
    { b: 0, op: 0xCB86, value: 0x01 },
    { b: 1, op: 0xCB8E, value: 0x02 },
    { b: 2, op: 0xCB96, value: 0x04 },
    { b: 3, op: 0xCB9E, value: 0x08 },
    { b: 4, op: 0xCBA6, value: 0x10 },
    { b: 5, op: 0xCBAE, value: 0x20 },
    { b: 6, op: 0xCBB6, value: 0x40 },
    { b: 7, op: 0xCBBE, value: 0x80 }
  ].forEach(function(test) {
    describe("RES " + test.b + ",(HL)", function() {
      beforeEach(function() {
        cpu.register.H = 0x2C;
        cpu.register.L = 0x83;
      });

      it("sets bit " + test.b + " of value at address HL", function() {
        mockMMU.expects('read8').once().withArgs(0x2C83).returns(test.value);
        mockMMU.expects('write8').once().withArgs(0x2C83, 0);
        ops[test.op]();
        mockMMU.verify();
      });

      it("takes 4 machine cycles", function() {
        expect(ops[test.op]()).to.equal(4);
      });
    });
  });
});
