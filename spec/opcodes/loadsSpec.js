var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var loads = require('../../lib/opcodes/loads');

describe("Load opcodes", function() {
  var cpu, mmu, ops;

  beforeEach(function() {
    cpu = new CPU();
    mmu = new MMU();
    ops = loads(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("LD n, n - 8-bit immediate loads - ", function() {
    beforeEach(function() {
      spyOn(mmu, 'read8').and.returnValue(0x1A);
    });

    [
      { dest: 'A', op: 0x3E },
      { dest: 'B', op: 0x06 },
      { dest: 'C', op: 0x0E },
      { dest: 'D', op: 0x16 },
      { dest: 'E', op: 0x1E },
      { dest: 'H', op: 0x26 },
      { dest: 'L', op: 0x2E }
    ].forEach(function(i) {
      describe("LD " + i.dest + ",n", function() {
        it("loads immediate 8-bit value into register " + i.dest, function() {
          ops[i.op]();
          expect(cpu.registers[i.dest]).toEqual(0x1A);
          expect(cpu.registers.M).toEqual(2);
          expect(cpu.registers.T).toEqual(8);
          expect(mmu.read8).toHaveBeenCalledWith(0x201);
        });
      });
    });
  });

  describe("LD r1, r2 - Load r2 into r1 - ", function() {
    [
      { dest: 'A', src: 'A', op: 0x7F },
      { dest: 'A', src: 'B', op: 0x78 },
      { dest: 'A', src: 'C', op: 0x79 },
      { dest: 'A', src: 'D', op: 0x7A },
      { dest: 'A', src: 'E', op: 0x7B },
      { dest: 'A', src: 'H', op: 0x7C },
      { dest: 'A', src: 'L', op: 0x7D },
      { dest: 'B', src: 'A', op: 0x47 },
      { dest: 'B', src: 'B', op: 0x40 },
      { dest: 'B', src: 'C', op: 0x41 },
      { dest: 'B', src: 'D', op: 0x42 },
      { dest: 'B', src: 'E', op: 0x43 },
      { dest: 'B', src: 'H', op: 0x44 },
      { dest: 'B', src: 'L', op: 0x45 },
      { dest: 'C', src: 'A', op: 0x4F },
      { dest: 'C', src: 'B', op: 0x48 },
      { dest: 'C', src: 'C', op: 0x49 },
      { dest: 'C', src: 'D', op: 0x4A },
      { dest: 'C', src: 'E', op: 0x4B },
      { dest: 'C', src: 'H', op: 0x4C },
      { dest: 'C', src: 'L', op: 0x4D },
      { dest: 'D', src: 'A', op: 0x57 },
      { dest: 'D', src: 'B', op: 0x50 },
      { dest: 'D', src: 'C', op: 0x51 },
      { dest: 'D', src: 'D', op: 0x52 },
      { dest: 'D', src: 'E', op: 0x53 },
      { dest: 'D', src: 'H', op: 0x54 },
      { dest: 'D', src: 'L', op: 0x55 },
      { dest: 'E', src: 'A', op: 0x5F },
      { dest: 'E', src: 'B', op: 0x58 },
      { dest: 'E', src: 'C', op: 0x59 },
      { dest: 'E', src: 'D', op: 0x5A },
      { dest: 'E', src: 'E', op: 0x5B },
      { dest: 'E', src: 'H', op: 0x5C },
      { dest: 'E', src: 'L', op: 0x5D },
      { dest: 'H', src: 'A', op: 0x67 },
      { dest: 'H', src: 'B', op: 0x60 },
      { dest: 'H', src: 'C', op: 0x61 },
      { dest: 'H', src: 'D', op: 0x62 },
      { dest: 'H', src: 'E', op: 0x63 },
      { dest: 'H', src: 'H', op: 0x64 },
      { dest: 'H', src: 'L', op: 0x65 },
      { dest: 'L', src: 'A', op: 0x6F },
      { dest: 'L', src: 'B', op: 0x68 },
      { dest: 'L', src: 'C', op: 0x69 },
      { dest: 'L', src: 'D', op: 0x6A },
      { dest: 'L', src: 'E', op: 0x6B },
      { dest: 'L', src: 'H', op: 0x6C },
      { dest: 'L', src: 'L', op: 0x6D }
    ].forEach(function(i) {
      describe("LD " + i.dest + "," + i.src, function() {
        it("loads " + i.src + " into " + i.dest, function() {
          cpu.registers[i.dest] = 0x33;
          cpu.registers[i.src] = 0x22;
          ops[i.op]();
          expect(cpu.registers[i.dest]).toEqual(cpu.registers[i.src]);
          expect(cpu.registers.M).toEqual(1);
          expect(cpu.registers.T).toEqual(4);
        });
      });
    });
  });

  describe("LD r,(HL)", function() {
    [
      { dest: 'A', op: 0x7E },
      { dest: 'B', op: 0x46 },
      { dest: 'C', op: 0x4E },
      { dest: 'D', op: 0x56 },
      { dest: 'E', op: 0x5E },
      { dest: 'H', op: 0x66 },
      { dest: 'L', op: 0x6E }
    ].forEach(function(i) {
      describe("LD " + i.dest + ",(HL)", function() {
        it("loads value from address in HL into " + i.dest, function() {
          spyOn(mmu, 'read8').and.returnValue(0x30);
          cpu.registers[i.dest] = 0x33;
          cpu.registers.H = 0x31;
          cpu.registers.L = 0xAB;
          ops[i.op]();
          expect(cpu.registers[i.dest]).toEqual(0x30);
          expect(cpu.registers.M).toEqual(2);
          expect(cpu.registers.T).toEqual(8);
          expect(mmu.read8).toHaveBeenCalledWith(0x31AB);
        });
      });
    });
  });
});
