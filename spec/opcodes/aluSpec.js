/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var alu = require('../../lib/opcodes/alu');

describe("ALU opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = alu(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("ADD A,A", function() {
    it("adds A to A", function() {
      cpu.register.A = 0x45;
      ops[0x87]();
      expect(cpu.register.A).to.equal(0x8A);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x0;
      ops[0x87]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0x2;
      ops[0x87]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag is carry from bit 3", function() {
      cpu.register.A = 0xE;
      ops[0x87]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if carry from bit 7", function() {
      cpu.register.A = 0x9F;
      ops[0x87]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  [
    { r: 'B', op: 0x80 },
    { r: 'C', op: 0x81 },
    { r: 'D', op: 0x82 },
    { r: 'E', op: 0x83 },
    { r: 'H', op: 0x84 },
    { r: 'L', op: 0x85 }
  ].forEach(function(i) {
    describe("ADD A," + i.r, function() {
      it("adds " + i.r + " to A", function() {
        cpu.register[i.r] = 0x13;
        cpu.register.A = 0x45;
        ops[i.op]();
        expect(cpu.register.A).to.equal(0x58);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[i.r] = 0x0;
        cpu.register.A = 0x0;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("resets N flag", function() {
        cpu.register[i.r] = 0x1;
        cpu.register.A = 0x2;
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(0);
      });

      it("sets H flag is carry from bit 3", function() {
        cpu.register[i.r] = 0xF;
        cpu.register.A = 0x1;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(1);
      });

      it("sets C flag if carry from bit 7", function() {
        cpu.register[i.r] = 0xFF;
        cpu.register.A = 0x1;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(1);
      });
    });
  });

  describe("ADD A,(HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
    });

    it("adds value in address HL to A", function() {
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x3B);
      cpu.register.A = 0x08;
      ops[0x86]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x43);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0xFF;
      ops[0x86]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0x86]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag is carry from bit 3", function() {
      mockMMU.expects('read8').returns(0x0F);
      cpu.register.A = 0x1;
      ops[0x86]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if carry from bit 7", function() {
      mockMMU.expects('read8').returns(0xFF);
      cpu.register.A = 0x1;
      ops[0x86]();
      expect((cpu.register.F & 0x10) >> 4).to.equal(1);
    });
  });

  describe("ADD A,n", function() {
    it("adds 8-bit immediate value to A", function() {
      mockMMU.expects('read8').withArgs(0x201).returns(0x3B);
      cpu.register.A = 0x08;
      ops[0xC6]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.A).to.equal(0x43);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0xFF;
      ops[0xC6]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0xC6]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag is carry from bit 3", function() {
      mockMMU.expects('read8').returns(0x0F);
      cpu.register.A = 0x1;
      ops[0xC6]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if carry from bit 7", function() {
      mockMMU.expects('read8').returns(0xFF);
      cpu.register.A = 0x1;
      ops[0xC6]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  describe("ADC A,A", function() {
    it("adds A + Carry flag to A", function() {
      cpu.setFlag('C');
      cpu.register.A = 0x45;
      ops[0x8F]();
      expect(cpu.register.A).to.equal(0x8B);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.resetFlag('C');
      cpu.register.A = 0x0;
      ops[0x8F]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0x2;
      ops[0x8F]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag is carry from bit 3", function() {
      cpu.register.A = 0xE;
      ops[0x8F]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if carry from bit 7", function() {
      cpu.register.A = 0x9F;
      ops[0x8F]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  [
    { r: 'B', op: 0x88 },
    { r: 'C', op: 0x89 },
    { r: 'D', op: 0x8A },
    { r: 'E', op: 0x8B },
    { r: 'H', op: 0x8C },
    { r: 'L', op: 0x8D }
  ].forEach(function(i) {
    describe("ADC A," + i.r, function() {
      beforeEach(function() {
        cpu.setFlag('C');
      });

      it("adds " + i.r + " + Carry flag to A", function() {
        cpu.register[i.r] = 0x13;
        cpu.register.A = 0x45;
        ops[i.op]();
        expect(cpu.register.A).to.equal(0x59);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[i.r] = 0xFF;
        cpu.register.A = 0x0;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("resets N flag", function() {
        cpu.register[i.r] = 0x1;
        cpu.register.A = 0x2;
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(0);
      });

      it("sets H flag is carry from bit 3", function() {
        cpu.register[i.r] = 0xF;
        cpu.register.A = 0x0;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(1);
      });

      it("sets C flag if carry from bit 7", function() {
        cpu.register[i.r] = 0xFF;
        cpu.register.A = 0x0;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(1);
      });
    });
  });

  describe("ADC A,(HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
      cpu.setFlag('C');
    });

    it("adds value in address HL + Carry flag to A", function() {
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x3B);
      cpu.register.A = 0x08;
      ops[0x8E]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x44);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0x00);
      cpu.register.A = 0xFF;
      ops[0x8E]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0x8E]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag is carry from bit 3", function() {
      mockMMU.expects('read8').returns(0x0F);
      cpu.register.A = 0x0;
      ops[0x8E]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if carry from bit 7", function() {
      mockMMU.expects('read8').returns(0xFF);
      cpu.register.A = 0x1;
      ops[0x8E]();
      expect((cpu.register.F & 0x10) >> 4).to.equal(1);
    });
  });

  describe("ADC A,n", function() {
    beforeEach(function() {
      cpu.setFlag('C');
    });

    it("adds 8-bit immediate value + Carry flag to A", function() {
      mockMMU.expects('read8').withArgs(0x201).returns(0x3B);
      cpu.register.A = 0x08;
      ops[0xCE]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.A).to.equal(0x44);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0);
      cpu.register.A = 0xFF;
      ops[0xCE]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0xCE]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag is carry from bit 3", function() {
      mockMMU.expects('read8').returns(0x0F);
      cpu.register.A = 0x0;
      ops[0xCE]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if carry from bit 7", function() {
      mockMMU.expects('read8').returns(0xFF);
      cpu.register.A = 0x0;
      ops[0xCE]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  describe("SUB A,A", function() {
    it("subtracts A from A", function() {
      cpu.register.A = 0x78;
      ops[0x97]();
      expect(cpu.register.A).to.equal(0);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x78;
      ops[0x97]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      cpu.register.A = 0x78;
      ops[0x97]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("sets H flag if borrow from bit 4", function() {
      cpu.register.A = 0x78;
      ops[0x97]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("sets C flag if borrow", function() {
      cpu.register.A = 0x10;
      ops[0x97]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  [
    { r: 'B', op: 0x90 },
    { r: 'C', op: 0x91 },
    { r: 'D', op: 0x92 },
    { r: 'E', op: 0x93 },
    { r: 'H', op: 0x94 },
    { r: 'L', op: 0x95 }
  ].forEach(function(i) {
    describe("SUB A," + i.r, function() {
      it("subtracts A from A", function() {
        cpu.register.A = 0x78;
        cpu.register[i.r] = 0x43;
        ops[i.op]();
        expect(cpu.register.A).to.equal(0x35);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register.A = 0x78;
        cpu.register[i.r] = 0x78;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("sets N flag", function() {
        cpu.register.A = 0x78;
        cpu.register[i.r] = 0x43;
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(1);
      });

      it("sets H flag if borrow from bit 4", function() {
        cpu.register.A = 0x82;
        cpu.register[i.r] = 0x73;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(1);

        cpu.register.A = 0x73;
        cpu.register[i.r] = 0x42;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(0);
      });

      it("sets C flag if borrow", function() {
        cpu.register.A = 0x10;
        cpu.register[i.r] = 0x11;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(1);

        cpu.register.A = 0x11;
        cpu.register[i.r] = 0x10;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });

  describe("SUB A,(HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
    });

    it("adds value in address HL to A", function() {
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x08);
      cpu.register.A = 0x39;
      ops[0x96]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x31);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x01;
      ops[0x96]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0x96]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("sets H flag if borrow from bit 4", function() {
      mockMMU.expects('read8').twice().returns(0x08);
      cpu.register.A = 0x15;
      ops[0x96]();
      expect(cpu.flag.H()).to.equal(1);

      cpu.register.A = 0x19;
      ops[0x96]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("sets C flag if carry from bit 7", function() {
      mockMMU.expects('read8').twice().returns(0x08);
      cpu.register.A = 0x05;
      ops[0x96]();
      expect(cpu.flag.C()).to.equal(1);

      cpu.register.A = 0x09;
      ops[0x96]();
      expect(cpu.flag.H()).to.equal(0);
    });
  });

  describe("SUB A,n", function() {
    it("subtracts 8-bit immediate value from A", function() {
      mockMMU.expects('read8').withArgs(0x201).returns(0x08);
      cpu.register.A = 0x18;
      ops[0xD6]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.A).to.equal(0x10);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0xFF);
      cpu.register.A = 0xFF;
      ops[0xD6]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0xD6]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("sets H flag if borrow from bit 4", function() {
      mockMMU.expects('read8').returns(0x23);
      cpu.register.A = 0x31;
      ops[0xD6]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if borrow", function() {
      mockMMU.expects('read8').returns(0xFF);
      cpu.register.A = 0x01;
      ops[0xD6]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  describe("SBC A,A", function() {
    it("subtracts A + Carry flag from A", function() {
      cpu.setFlag('C');
      cpu.register.A = 0x78;
      ops[0x9F]();
      expect(cpu.register.A).to.equal(0xFF);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.resetFlag('C');
      cpu.register.A = 0x78;
      ops[0x9F]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      cpu.register.A = 0x78;
      ops[0x9F]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("sets H flag if borrow from bit 4", function() {
      cpu.setFlag('C');
      cpu.register.A = 0x78;
      ops[0x9F]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if borrow", function() {
      cpu.setFlag('C');
      cpu.register.A = 0x10;
      ops[0x9F]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  [
    { r: 'B', op: 0x98 },
    { r: 'C', op: 0x99 },
    { r: 'D', op: 0x9A },
    { r: 'E', op: 0x9B },
    { r: 'H', op: 0x9C },
    { r: 'L', op: 0x9D }
  ].forEach(function(i) {
    describe("SBC A," + i.r, function() {
      beforeEach(function() {
        cpu.setFlag('C');
      });

      it("subtracts A + Carry Flag from A", function() {
        cpu.register.A = 0x78;
        cpu.register[i.r] = 0x43;
        ops[i.op]();
        expect(cpu.register.A).to.equal(0x34);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register.A = 0x79;
        cpu.register[i.r] = 0x78;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("sets N flag", function() {
        cpu.register.A = 0x78;
        cpu.register[i.r] = 0x43;
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(1);
      });

      it("sets H flag if borrow from bit 4", function() {
        cpu.register.A = 0x82;
        cpu.register[i.r] = 0x72;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(1);

        cpu.register.A = 0x73;
        cpu.register[i.r] = 0x42;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(0);
      });

      it("sets C flag if borrow", function() {
        cpu.register.A = 0x11;
        cpu.register[i.r] = 0x11;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(1);

        cpu.register.A = 0x12;
        cpu.register[i.r] = 0x10;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });

  describe("SBC A,(HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
      cpu.setFlag('C');
    });

    it("adds value in address HL + Carry flag to A", function() {
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x08);
      cpu.register.A = 0x39;
      ops[0x9E]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x30);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x02;
      ops[0x9E]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0x9E]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("sets H flag if borrow from bit 4", function() {
      mockMMU.expects('read8').twice().returns(0x05);
      cpu.register.A = 0x15;
      ops[0x9E]();
      expect(cpu.flag.H()).to.equal(1);

      cpu.register.A = 0x19;
      ops[0x9E]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("sets C flag if carry from bit 7", function() {
      mockMMU.expects('read8').twice().returns(0x05);
      cpu.register.A = 0x05;
      ops[0x9E]();
      expect(cpu.flag.C()).to.equal(1);

      cpu.register.A = 0x09;
      ops[0x9E]();
      expect(cpu.flag.H()).to.equal(0);
    });
  });

  describe("SBC A,n", function() {
    beforeEach(function() {
      cpu.setFlag('C');
    });

    it("subtracts 8-bit immediate value + Carry flag from A", function() {
      mockMMU.expects('read8').withArgs(0x201).returns(0x08);
      cpu.register.A = 0x18;
      ops[0xDE]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.A).to.equal(0x0F);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0xFE);
      cpu.register.A = 0xFF;
      ops[0xDE]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      mockMMU.expects('read8').returns(0x01);
      cpu.register.A = 0x2;
      ops[0xDE]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("sets H flag if borrow from bit 4", function() {
      mockMMU.expects('read8').returns(0x21);
      cpu.register.A = 0x31;
      ops[0xDE]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("sets C flag if borrow", function() {
      mockMMU.expects('read8').returns(0xF0);
      cpu.register.A = 0x01;
      ops[0xDE]();
      expect(cpu.flag.C()).to.equal(1);
    });
  });

  describe("AND A", function() {
    it("logically ANDs A with A", function() {
      cpu.register.A = 0xF2;
      ops[0xA7]();
      expect(cpu.register.A).to.equal(0xF2);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x00;
      ops[0xA7]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0xF2;
      ops[0xA7]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag", function() {
      cpu.register.A = 0xF2;
      ops[0xA7]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("resets C flag", function() {
      cpu.register.A = 0xF2;
      ops[0xA7]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  [
    { r: 'B', op: 0xA0 },
    { r: 'C', op: 0xA1 },
    { r: 'D', op: 0xA2 },
    { r: 'E', op: 0xA3 },
    { r: 'H', op: 0xA4 },
    { r: 'L', op: 0xA5 }
  ].forEach(function(i) {
    describe("AND " + i.r, function() {
      it("logically ANDs A with A", function() {
        cpu.register.A = 0xF2;
        cpu.register[i.r] = 0x34;
        ops[i.op]();
        expect(cpu.register.A).to.equal(0x30);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register.A = 0x00;
        cpu.register[i.r] = 0x34;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("resets N flag", function() {
        cpu.register.A = 0xF2;
        cpu.register[i.r] = 0x34;
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(0);
      });

      it("sets H flag", function() {
        cpu.register.A = 0xF2;
        cpu.register[i.r] = 0x34;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(1);
      });

      it("resets C flag", function() {
        cpu.register.A = 0xF2;
        cpu.register[i.r] = 0x34;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });

  describe("AND (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x34);
    });

    it("logically ANDs A with value at address HL", function() {
      cpu.register.A = 0xF2;
      ops[0xA6]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x30);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x00;
      ops[0xA6]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0xF2;
      ops[0xA6]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag", function() {
      cpu.register.A = 0xF2;
      ops[0xA6]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("resets C flag", function() {
      cpu.register.A = 0xF2;
      ops[0xA6]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("AND n", function() {
    beforeEach(function() {
      mockMMU.expects('read8').withArgs(0x201).returns(0x34);
    });

    it("logically ANDs A with 8-bit immediate value n", function() {
      cpu.register.A = 0xF2;
      ops[0xE6]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.A).to.equal(0x30);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x00;
      ops[0xE6]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0xF2;
      ops[0xE6]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("sets H flag", function() {
      cpu.register.A = 0xF2;
      ops[0xE6]();
      expect(cpu.flag.H()).to.equal(1);
    });

    it("resets C flag", function() {
      cpu.register.A = 0xF2;
      ops[0xE6]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("OR A", function() {
    it("logically ORs A with A", function() {
      cpu.register.A = 0xF2;
      ops[0xB7]();
      expect(cpu.register.A).to.equal(0xF2);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0xB7]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0xF2;
      ops[0xB7]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("resets H flag", function() {
      cpu.register.A = 0xF2;
      ops[0xB7]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      cpu.register.A = 0xF2;
      ops[0xB7]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  [
    { r: 'B', op: 0xB0 },
    { r: 'C', op: 0xB1 },
    { r: 'D', op: 0xB2 },
    { r: 'E', op: 0xB3 },
    { r: 'H', op: 0xB4 },
    { r: 'L', op: 0xB5 }
  ].forEach(function(i) {
    beforeEach(function() {
      cpu.register.A = 0xF2;
      cpu.register[i.r] = 0x3F;
    });

    describe("OR " + i.r, function() {
      it("logically ORs A with " + i.r, function() {
        ops[i.op]();
        expect(cpu.register.A).to.equal(0xFF);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register.A = 0x00;
        cpu.register[i.r] = 0x00;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("resets N flag", function() {
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(0);
      });

      it("resets H flag", function() {
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(0);
      });

      it("resets C flag", function() {
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });

  describe("OR (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
      cpu.register.A = 0xF2;
    });

    it("logically ORs A with value in address HL", function() {
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x3F);
      ops[0xB6]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0xFF);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0);
      cpu.register.A = 0;
      ops[0xB6]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      mockMMU.expects('read8').returns(0);
      ops[0xB6]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("resets H flag", function() {
      mockMMU.expects('read8').returns(0);
      ops[0xB6]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      mockMMU.expects('read8').returns(0);
      ops[0xB6]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("OR n", function() {
    beforeEach(function() {
      cpu.register.A = 0xF2;
    });

    it("logically ORs A with 8-bit immediate value", function() {
      mockMMU.expects('read8').withArgs(0x201).returns(0x3F);
      ops[0xF6]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0xFF);
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      mockMMU.expects('read8').returns(0);
      cpu.register.A = 0;
      ops[0xF6]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      mockMMU.expects('read8').returns(0);
      ops[0xF6]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("resets H flag", function() {
      mockMMU.expects('read8').returns(0);
      ops[0xF6]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      mockMMU.expects('read8').returns(0);
      ops[0xF6]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("XOR A", function() {
    beforeEach(function() {
      cpu.register.A = 0xF2;
    });

    it("logically XORs A with A", function() {
      ops[0xAF]();
      expect(cpu.register.A).to.equal(0x0);
      expect(cpu.register.M).to.equal(1);
      expect(cpu.register.T).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      ops[0xAF]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      ops[0xAF]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("resets H flag", function() {
      ops[0xAF]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      ops[0xAF]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  [
    { r: 'B', op: 0xA8 },
    { r: 'C', op: 0xA9 },
    { r: 'D', op: 0xAA },
    { r: 'E', op: 0xAB },
    { r: 'H', op: 0xAC },
    { r: 'L', op: 0xAD }
  ].forEach(function(i) {
    beforeEach(function() {
      cpu.register.A = 0xF2;
      cpu.register[i.r] = 0x3F;
    });

    describe("XOR " + i.r, function() {
      it("logically XORs A with " + i.r, function() {
        ops[i.op]();
        expect(cpu.register.A).to.equal(0xCD);
        expect(cpu.register.M).to.equal(1);
        expect(cpu.register.T).to.equal(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register.A = 0x00;
        cpu.register[i.r] = 0x00;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);
      });

      it("resets N flag", function() {
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(0);
      });

      it("resets H flag", function() {
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(0);
      });

      it("resets C flag", function() {
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });

  describe("XOR (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
      cpu.register.A = 0xF2;
      mockMMU.expects('read8').withArgs(0xC4B2).returns(0x3F);
    });

    it("logically XORs A with value in address HL", function() {
      ops[0xAE]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0xCD);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x3F;
      ops[0xAE]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      ops[0xAE]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("resets H flag", function() {
      ops[0xAE]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      ops[0xAE]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("OR n", function() {
    beforeEach(function() {
      cpu.register.A = 0xF2;
      mockMMU.expects('read8').withArgs(0x201).returns(0x3F);
    });

    it("logically ORs A with 8-bit immediate value", function() {
      ops[0xEE]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0xCD);
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.M).to.equal(2);
      expect(cpu.register.T).to.equal(8);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x3F;
      ops[0xEE]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("resets N flag", function() {
      ops[0xEE]();
      expect(cpu.flag.N()).to.equal(0);
    });

    it("resets H flag", function() {
      ops[0xEE]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      ops[0xEE]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  describe("CP A", function() {
    it("sets Z flag", function() {
      cpu.register.A = 0x3F;
      ops[0xBF]();
      expect(cpu.flag.Z()).to.equal(1);
    });

    it("sets N flag", function() {
      cpu.register.A = 0x3F;
      ops[0xBF]();
      expect(cpu.flag.N()).to.equal(1);
    });

    it("resets H flag", function() {
      cpu.register.A = 0x3F;
      ops[0xBF]();
      expect(cpu.flag.H()).to.equal(0);
    });

    it("resets C flag", function() {
      cpu.register.A = 0x3F;
      ops[0xBF]();
      expect(cpu.flag.C()).to.equal(0);
    });
  });

  [
    { r: 'B', op: 0xB8 },
    { r: 'C', op: 0xB9 },
    { r: 'D', op: 0xBA },
    { r: 'E', op: 0xBB },
    { r: 'H', op: 0xBC },
    { r: 'L', op: 0xBD }
  ].forEach(function(i) {
    describe("CP " + i.r, function() {
      it("sets Z flag if A = " + i.r, function() {
        cpu.register.A = 0x35;
        cpu.register[i.r] = 0x35;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(1);

        cpu.register.A = 0x42;
        ops[i.op]();
        expect(cpu.flag.Z()).to.equal(0);
      });

      it("sets N flag", function() {
        cpu.register.A = 0x35;
        cpu.register[i.r] = 0x35;
        ops[i.op]();
        expect(cpu.flag.N()).to.equal(1);
      });

      it("sets H flag if borrow from bit 4", function() {
        cpu.register.A = 0x43;
        cpu.register[i.r] = 0x35;
        ops[i.op]();
        expect(cpu.flag.H()).to.equal(1);
      });

      it("sets C flag if A < " + i.r, function() {
        cpu.register.A = 0x13;
        cpu.register[i.r] = 0x35;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(1);

        cpu.register.A = 0x43;
        ops[i.op]();
        expect(cpu.flag.C()).to.equal(0);
      });
    });
  });
});
