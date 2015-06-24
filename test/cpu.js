/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../lib/cpu');
var MMU = require('../lib/mmu');

describe("CPU", function() {
  var cpu, read8Stub;

  beforeEach(function() {
    var mmu = new MMU();
    read8Stub = sinon.stub(mmu, 'read8');
    cpu = new CPU(mmu);
  });

  describe("new CPU", function() {
    it("sets up initial state of cpu", function() {
      expect(cpu.pc).to.equal(0);
      expect(cpu.sp).to.equal(0);
      ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'L'].forEach(function(r) {
        expect(cpu.register[r]).to.equal(0);
      });
      expect(cpu.enableInterrupts).to.be.false;
      expect(cpu.incrementPC).to.be.true;
    });

    it("loads all cpu instructions", function() {
      [0x87, 0xCB47, 0xC3, 0x3E, 0xCB37, 0x07].forEach(function(op) {
        expect(cpu.instructions[op]).to.be.a('function');
      });
    });
  });

  describe("reset", function() {
    it("resets all flags and registers to initial values", function() {
      cpu.pc = 0xABCD;
      cpu.sp = 0xFFFE;
      ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'L'].forEach(function(r) {
        cpu.register[r] = 0x35;
      });

      cpu.reset();
      expect(cpu.pc).to.equal(0);
      expect(cpu.sp).to.equal(0);
      ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'L'].forEach(function(r) {
        expect(cpu.register[r]).to.equal(0);
      });
      expect(cpu.enableInterrupts).to.be.false;
      expect(cpu.incrementPC).to.be.true;
    });
  });

  describe("execute", function() {
    beforeEach(function() {
      cpu.pc = 0x200;
    });

    it("executes the instruction pointed to by PC", function() {
      cpu.instructions[0x00] = function() { return 2; };
      read8Stub.withArgs(0x200).returns(0x00);
      cpu.execute();

      expect(cpu.pc).to.equal(0x201);
      expect(cpu.clock.M).to.equal(2);
      expect(cpu.clock.T).to.equal(8);
    });

    it("fetches next byte if instruction is 0xCB", function() {
      cpu.instructions[0xCB00] = function() { return 2; };
      read8Stub.withArgs(0x200).returns(0xCB);
      read8Stub.withArgs(0x201).returns(0x00);
      cpu.execute();

      expect(cpu.pc).to.equal(0x202);
      expect(cpu.clock.M).to.equal(2);
      expect(cpu.clock.T).to.equal(8);
    });

    it("does not increment PC if incrementPC flag is false", function() {
      cpu.instructions[0x00] = function() { cpu.incrementPC = false; return 2; };
      read8Stub.withArgs(0x200).returns(0x00);
      cpu.execute();

      expect(cpu.pc).to.equal(0x200);
      expect(cpu.clock.M).to.equal(2);
      expect(cpu.clock.T).to.equal(8);
    });

    it("sets inBIOS flag of MMU to false when program counter reaches 100h", function() {
      cpu.instructions[0x00] = function() { return 2; };
      read8Stub.withArgs(0xFF).returns(0x00);
      cpu.pc = 0xFF;
      cpu.execute();

      expect(cpu.mmu.inBIOS).to.be.false;
    });

    it("returns the time of execution as T clocks", function() {
      cpu.instructions[0x00] = function() { return 2; };
      read8Stub.withArgs(0x200).returns(0x00);

      expect(cpu.execute()).to.equal(8);
    });
  });

  describe("testFlag", function() {
    it("tests the value of given flag", function() {
      cpu.register.F = 0xF0;
      expect(cpu.testFlag('Z')).to.equal(1);
      expect(cpu.testFlag('N')).to.equal(1);
      expect(cpu.testFlag('H')).to.equal(1);
      expect(cpu.testFlag('C')).to.equal(1);

      cpu.register.F = 0x00;
      expect(cpu.testFlag('Z')).to.equal(0);
      expect(cpu.testFlag('N')).to.equal(0);
      expect(cpu.testFlag('H')).to.equal(0);
      expect(cpu.testFlag('C')).to.equal(0);
    });
  });

  describe("setFlag", function() {
    it("sets the given flag", function() {
      cpu.setFlag('Z');
      expect(cpu.register.F).to.equal(0x80);

      cpu.setFlag('N');
      expect(cpu.register.F).to.equal(0xC0);

      cpu.setFlag('H');
      expect(cpu.register.F).to.equal(0xE0);

      cpu.setFlag('C');
      expect(cpu.register.F).to.equal(0xF0);
    });
  });

  describe("resetFlag", function() {
    it("sets the given flag", function() {
      cpu.register.F = 0xF0;

      cpu.resetFlag('Z');
      expect(cpu.register.F).to.equal(0x70);

      cpu.resetFlag('N');
      expect(cpu.register.F).to.equal(0x30);

      cpu.resetFlag('H');
      expect(cpu.register.F).to.equal(0x10);

      cpu.resetFlag('C');
      expect(cpu.register.F).to.equal(0x00);
    });
  });

  describe("updateFlag", function() {
    it("updates the flag with given value (truthy = 1, falsey = 0)", function() {
      cpu.updateFlag('Z', true);
      expect(cpu.register.F).to.equal(0x80);
      cpu.updateFlag('Z', false);
      expect(cpu.register.F).to.equal(0x00);

      cpu.updateFlag('N', true);
      expect(cpu.register.F).to.equal(0x40);
      cpu.updateFlag('N', false);
      expect(cpu.register.F).to.equal(0x00);

      cpu.updateFlag('H', true);
      expect(cpu.register.F).to.equal(0x20);
      cpu.updateFlag('H', false);
      expect(cpu.register.F).to.equal(0x00);

      cpu.updateFlag('C', true);
      expect(cpu.register.F).to.equal(0x10);
      cpu.updateFlag('C', false);
      expect(cpu.register.F).to.equal(0x00);
    });
  });
});
