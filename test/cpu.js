/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../lib/cpu');
var MMU = require('../lib/mmu');

describe("CPU", function() {
  var cpu;

  beforeEach(function() {
    cpu = new CPU();
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
