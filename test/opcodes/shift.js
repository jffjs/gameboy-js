/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var shifts = require('../../lib/opcodes/shift');

describe("Shift opcodes", function() {
  var cpu, read8Stub, write8Spy, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    read8Stub = sinon.stub(mmu, 'read8');
    write8Spy = sinon.spy(mmu, 'write8');
    ops = shifts(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("RLCA", function() {
    it("rotates A left, copying bit 7 into carry flag and to bit 0", function() {
      cpu.register.A = 0xB4;
      ops[0x07]();
      expect(cpu.register.A).to.equal(0x69);
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x07]()).to.equal(1);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0x07]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0x07]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  describe("RLA", function() {
    it("roates A left through carry flag", function() {
      cpu.register.A = 0xB4;
      cpu.setFlag('C');
      ops[0x17]();
      expect(cpu.register.A).to.equal(0x69);
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x17]()).to.equal(1);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0x17]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0x17]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  describe("RRCA", function() {
    it("rotates A right, copying bit 0 into carry flag and to bit 7", function() {
      cpu.register.A = 0x11;
      ops[0x0F]();
      expect(cpu.register.A).to.equal(0x88);
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x0F]()).to.equal(1);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0x0F]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0x0F]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  describe("RRA", function() {
    it("roates A right through carry flag", function() {
      cpu.register.A = 0x11;
      ops[0x1F]();
      expect(cpu.register.A).to.equal(0x08);
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0x1F]()).to.equal(1);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0;
      ops[0x1F]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0x1F]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB07 },
    { r: 'B', op: 0xCB00 },
    { r: 'C', op: 0xCB01 },
    { r: 'D', op: 0xCB02 },
    { r: 'E', op: 0xCB03 },
    { r: 'H', op: 0xCB04 },
    { r: 'L', op: 0xCB05 }
  ].forEach(function(test) {
    describe("RLC " + test.r, function() {
      it("rotates " + test.r + " left, copying bit 7 into carry flag and to bit 0", function() {
        cpu.register[test.r] = 0xB4;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x69);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("RLC (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("rotates the value in address HL left, copying bit 7 into carry flag and to bit 0", function() {
      read8Stub.withArgs(0x2C83).returns(0xB4);
      ops[0xCB06]();
      expect(write8Spy.calledWith(0x2C83, 0x69)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB06]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.withArgs(0x2C83).returns(0);
      ops[0xCB06]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB06]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB17 },
    { r: 'B', op: 0xCB10 },
    { r: 'C', op: 0xCB11 },
    { r: 'D', op: 0xCB12 },
    { r: 'E', op: 0xCB13 },
    { r: 'H', op: 0xCB14 },
    { r: 'L', op: 0xCB15 }
  ].forEach(function(test) {
    describe("RL " + test.r, function() {
      it("rotates " + test.r + " left through carry flag", function() {
        cpu.register[test.r] = 0xB4;
        cpu.setFlag('C');
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x69);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("RL (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("rotates the value in address HL left through carry flag", function() {
      read8Stub.withArgs(0x2C83).returns(0xB4);
      cpu.setFlag('C');
      ops[0xCB16]();
      expect(write8Spy.calledWith(0x2C83, 0x69)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB16]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.withArgs(0x2C83).returns(0);
      ops[0xCB16]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB16]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB0F },
    { r: 'B', op: 0xCB08 },
    { r: 'C', op: 0xCB09 },
    { r: 'D', op: 0xCB0A },
    { r: 'E', op: 0xCB0B },
    { r: 'H', op: 0xCB0C },
    { r: 'L', op: 0xCB0D }
  ].forEach(function(test) {
    describe("RRC " + test.r, function() {
      it("rotates " + test.r + "right, copying bit 0 into carry flag and to bit 7", function() {
        cpu.register[test.r] = 0x11;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x88);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("RRC (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("rotates the value in address HL left, copying bit 7 into carry flag and to bit 0", function() {
      read8Stub.withArgs(0x2C83).returns(0x11);
      ops[0xCB0E]();
      expect(write8Spy.calledWith(0x2C83, 0x88)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB0E]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.withArgs(0x2C83).returns(0);
      ops[0xCB0E]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB0E]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB1F },
    { r: 'B', op: 0xCB18 },
    { r: 'C', op: 0xCB19 },
    { r: 'D', op: 0xCB1A },
    { r: 'E', op: 0xCB1B },
    { r: 'H', op: 0xCB1C },
    { r: 'L', op: 0xCB1D }
  ].forEach(function(test) {
    describe("RR " + test.r, function() {
      it("roates " + test.r + " right through carry flag", function() {
        cpu.register[test.r] = 0x11;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x08);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 1 machine cycle", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("RR (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("rotates the value in address HL left, copying bit 7 into carry flag and to bit 0", function() {
      read8Stub.withArgs(0x2C83).returns(0x11);
      ops[0xCB1E]();
      expect(write8Spy.calledWith(0x2C83, 0x08)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB1E]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.withArgs(0x2C83).returns(0);
      ops[0xCB1E]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB1E]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB27 },
    { r: 'B', op: 0xCB20 },
    { r: 'C', op: 0xCB21 },
    { r: 'D', op: 0xCB22 },
    { r: 'E', op: 0xCB23 },
    { r: 'H', op: 0xCB24 },
    { r: 'L', op: 0xCB25 }
  ].forEach(function(test) {
    describe("SLA " + test.r, function() {
      it("shifts " + test.r + " left into carry flag", function() {
        cpu.register[test.r] = 0x88;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x10);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("SLA (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("shifts value at address HL left into carry flag", function() {
      read8Stub.withArgs(0x2C83).returns(0x88);
      ops[0xCB26]();
      expect(write8Spy.calledWith(0x2C83, 0x10)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB26]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.returns(0);
      ops[0xCB26]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB26]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB2F },
    { r: 'B', op: 0xCB28 },
    { r: 'C', op: 0xCB29 },
    { r: 'D', op: 0xCB2A },
    { r: 'E', op: 0xCB2B },
    { r: 'H', op: 0xCB2C },
    { r: 'L', op: 0xCB2D }
  ].forEach(function(test) {
    describe("SRA " + test.r, function() {
      it("shifts " + test.r + " right into carry flag, preserving most significant bit", function() {
        cpu.register[test.r] = 0x91;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0xC8);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("SRA (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("shifts value at address HL right into carry flag, preserving most significant bit", function() {
      read8Stub.withArgs(0x2C83).returns(0x91);
      ops[0xCB2E]();
      expect(write8Spy.calledWith(0x2C83, 0xC8)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB2E]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.returns(0);
      ops[0xCB2E]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB2E]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });

  [
    { r: 'A', op: 0xCB3F },
    { r: 'B', op: 0xCB38 },
    { r: 'C', op: 0xCB39 },
    { r: 'D', op: 0xCB3A },
    { r: 'E', op: 0xCB3B },
    { r: 'H', op: 0xCB3C },
    { r: 'L', op: 0xCB3D }
  ].forEach(function(test) {
    describe("SRL " + test.r, function() {
      it("shifts " + test.r + " right into carry flag", function() {
        cpu.register[test.r] = 0x91;
        ops[test.op]();
        expect(cpu.register[test.r]).to.equal(0x48);
        expect(cpu.testFlag('C')).to.equal(1);
      });

      it("takes 2 machine cycles", function() {
        expect(ops[test.op]()).to.equal(2);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[test.r] = 0;
        ops[test.op]();
        expect(cpu.testFlag('Z')).to.equal(1);
      });

      it("resets N and H flags", function() {
        cpu.setFlag('N');
        cpu.setFlag('H');
        ops[test.op]();
        expect(cpu.testFlag('N')).to.equal(0);
        expect(cpu.testFlag('H')).to.equal(0);
      });
    });
  });

  describe("SRL (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x2C;
      cpu.register.L = 0x83;
    });

    it("shifts value at address HL right into carry flag", function() {
      read8Stub.withArgs(0x2C83).returns(0x91);
      ops[0xCB3E]();
      expect(write8Spy.calledWith(0x2C83, 0x48)).to.be.true;
      expect(cpu.testFlag('C')).to.equal(1);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xCB3E]()).to.equal(4);
    });

    it("sets Z flag if result is zero", function() {
      read8Stub.returns(0);
      ops[0xCB3E]();
      expect(cpu.testFlag('Z')).to.equal(1);
    });

    it("resets N and H flags", function() {
      cpu.setFlag('N');
      cpu.setFlag('H');
      ops[0xCB3E]();
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
    });
  });
});
