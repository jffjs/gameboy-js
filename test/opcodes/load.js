/*global require, describe, it, beforeEach */

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var loads = require('../../lib/opcodes/load');

describe("Load opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = loads(cpu, mmu);
    cpu.pc = 0x200;
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
        mockMMU.expects('read8').once().withArgs(0x201).returns(0x1A);
        ops[i.op]();
        mockMMU.verify();
        expect(cpu.register[i.dest]).to.equal(0x1A);
        expect(cpu.pc).to.equal(0x201);
      });

      it("takes 2 machine cycles", function() {
        mockMMU.expects('read8').once().withArgs(0x201).returns(0x1A);
        expect(ops[i.op]()).to.equal(2);
      });
    });
  });

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
        cpu.register[i.dest] = 0x33;
        cpu.register[i.src] = 0x22;
        ops[i.op]();
        expect(cpu.register[i.dest]).to.equal(cpu.register[i.src]);
      });

      it("takes 1 machine cycles", function() {
        cpu.register[i.dest] = 0x33;
        cpu.register[i.src] = 0x22;
        expect(ops[i.op]()).to.equal(1);
      });
    });
  });

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
      beforeEach(function() {
        mockMMU.expects('read8').once().withArgs(0x31AB).returns(0x30);
        cpu.register[i.dest] = 0x33;
        cpu.register.H = 0x31;
        cpu.register.L = 0xAB;
      });

      it("loads value from address in HL into " + i.dest, function() {
        ops[i.op]();
        expect(cpu.register[i.dest]).to.equal(0x30);
        mockMMU.verify();
      });

      it("takes 2 machine cycles", function() {
        expect(ops[i.op]()).to.equal(2);
      });
    });
  });

  [
    { src: 'A', op: 0x77 },
    { src: 'B', op: 0x70 },
    { src: 'C', op: 0x71 },
    { src: 'D', op: 0x72 },
    { src: 'E', op: 0x73 },
    { src: 'H', op: 0x74 },
    { src: 'L', op: 0x75 }
  ].forEach(function(i) {
    describe("LD (HL)," + i.src, function() {
      beforeEach(function() {
        if (i.src !== 'H' || i.src !== 'L') {
          cpu.register[i.src] = 0xBB;
        }
        cpu.register.H = 0x25;
        cpu.register.L = 0x7B;
      });

      it("loads " + i.src + " into address pointed to by HL", function() {
        mockMMU.expects('write8').once().withArgs(0x257B, cpu.register[i.src]);
        ops[i.op]();
        mockMMU.verify();
      });

      it("takes 2 machine cycles", function() {
        expect(ops[i.op]()).to.equal(2);
      });
    });
  });

  describe("LD (HL),n", function() {
    beforeEach(function() {
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x88);
      mockMMU.expects('write8').once().withArgs(0x257B, 0x88);
      cpu.register.H = 0x25;
      cpu.register.L = 0x7B;
    });

    it("loads 8-bit immediate value into address pointed at by HL", function() {
      ops[0x36]();
      mockMMU.verify();
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0x36]()).to.equal(3);
    });
  });

  describe("LD (BC),A", function() {
    beforeEach(function() {
      cpu.register.A = 0xFA;
      cpu.register.B = 0x33;
      cpu.register.C = 0x45;
    });

    it("loads A into the address pointed at by BC", function() {
      mockMMU.expects('write8').once().withArgs(0x3345, cpu.register.A);
      ops[0x02]();
      mockMMU.verify();
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x02]()).to.equal(2);
    });
  });

  describe("LD (DE),A", function() {
    beforeEach(function() {
      cpu.register.A = 0xFA;
      cpu.register.D = 0x33;
      cpu.register.E = 0x45;
    });

    it("loads A into the address pointed at by DE", function() {
      mockMMU.expects('write8').once().withArgs(0x3345, cpu.register.A);
      ops[0x12]();
      mockMMU.verify();
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x12]()).to.equal(2);
    });
  });

  describe("LD (nn),A", function() {
    beforeEach(function() {
      mockMMU.expects('read16').once().withArgs(0x0202).returns(0xA980);
      cpu.register.A = 0xBC;
    });

    it("loads value of A into address pointed at by 16-bit immediate value", function() {
      mockMMU.expects('write8').once().withArgs(0xA980, 0xBC);
      ops[0xEA]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x202);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xEA]()).to.equal(4);
    });
  });

  describe("LD A,(BC)", function() {
    beforeEach(function() {
      mockMMU.expects('read8').once().withArgs(0x3345).returns(0x55);
      cpu.register.B = 0x33;
      cpu.register.C = 0x45;
    });

    it("loads value from address in BC into A", function() {
      ops[0x0A]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x55);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x0A]()).to.equal(2);
    });
  });

  describe("LD A,(DE)", function() {
    beforeEach(function() {
      mockMMU.expects('read8').once().withArgs(0x3345).returns(0x55);
      cpu.register.D = 0x33;
      cpu.register.E = 0x45;
    });

    it("loads value from address in DE into A", function() {
      ops[0x1A]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x55);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x1A]()).to.equal(2);
    });
  });

  describe("LD A,(nn)", function() {
    beforeEach(function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x5544);
      mockMMU.expects('read8').once().returns(0x23);
    });

    it("loads value from address in 16-bit immediate value into A", function() {
      ops[0xFA]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x23);
      expect(cpu.pc).to.equal(0x202);
    });

    it("takes 4 machine cycles", function() {
      expect(ops[0xFA]()).to.equal(4);
    });
  });

  describe("LDH A,(C)", function() {
    beforeEach(function() {
      mockMMU.expects('read8').once().withArgs(0xFF08).returns(0x34);
      cpu.register.C = 0x08;
    });

    it("loads value at address $FF00 + C into A", function() {
      ops[0xF2]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x34);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xF2]()).to.equal(2);
    });
  });

  describe("LDH (C),A", function() {
    it("loads A into address $FF00 + C", function() {
      mockMMU.expects('write8').once().withArgs(0xFF08, 0x44);
      cpu.register.A = 0x44;
      cpu.register.C = 0x08;
      ops[0xE2]();
      mockMMU.verify();
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xE2]()).to.equal(2);
    });
  });

  describe("LDD A,(HL)", function() {
    it("loads value at address HL into A and decrements HL", function() {
      mockMMU.expects('read8').once().withArgs(0x72B6).returns(0x78);
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x3A]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x78);
      expect(cpu.register.H).to.equal(0x72);
      expect(cpu.register.L).to.equal(0xB5);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x3A]()).to.equal(2);
    });
  });

  describe("LDD (HL),A", function() {
    it("loads A into address HL and decrements HL", function() {
      mockMMU.expects('write8').once().withArgs(0x72B6, 0x10);
      cpu.register.A = 0x10;
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x32]();
      mockMMU.verify();
      expect(cpu.register.H).to.equal(0x72);
      expect(cpu.register.L).to.equal(0xB5);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x32]()).to.equal(2);
    });
  });

  describe("LDI A,(HL)", function() {
    it("loads value at address HL into A and increments HL", function() {
      mockMMU.expects('read8').once().withArgs(0x72B6).returns(0x78);
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x2A]();
      mockMMU.verify();
      expect(cpu.register.A).to.equal(0x78);
      expect(cpu.register.H).to.equal(0x72);
      expect(cpu.register.L).to.equal(0xB7);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x2A]()).to.equal(2);
    });
  });

  describe("LDI (HL),A", function() {
    it("loads A into address HL and increments HL", function() {
      mockMMU.expects('write8').once().withArgs(0x72B6, 0x10);
      cpu.register.A = 0x10;
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x22]();
      mockMMU.verify();
      expect(cpu.register.H).to.equal(0x72);
      expect(cpu.register.L).to.equal(0xB7);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x22]()).to.equal(2);
    });
  });

  describe("LDH (n),A", function() {
    it("loads A into address $FF00 + 8-bit immediate value n", function() {
      mockMMU.expects('write8').once().withArgs(0xFF06, 0xC7);
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x06);
      cpu.register.A = 0xC7;
      ops[0xE0]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xE0]()).to.equal(3);
    });
  });

  describe("LDH A,(n)", function() {
    it("loads value from address $FF00 + 8-bit immediate value n into A", function() {
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x06);//.onCall(0).withArgs(0xFF06).onCall(1);
      mockMMU.expects('read8').once().withArgs(0xFF06).returns(0x06);
      cpu.register.A = 0xC7;
      ops[0xF0]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.A).to.equal(0x06);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xF0]()).to.equal(3);
    });
  });

  describe("LD BC,nn", function() {
    it("loads 16-bit immediate value into BC", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x1234);
      ops[0x01]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.register.B).to.equal(0x12);
      expect(cpu.register.C).to.equal(0x34);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0x01]()).to.equal(3);
    });
  });

  describe("LD DE,nn", function() {
    it("loads 16-bit immediate value into DE", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x1234);
      ops[0x11]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.register.D).to.equal(0x12);
      expect(cpu.register.E).to.equal(0x34);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0x11]()).to.equal(3);
    });
  });

  describe("LD HL,nn", function() {
    it("loads 16-bit immediate value into HL", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x1234);
      ops[0x21]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.register.H).to.equal(0x12);
      expect(cpu.register.L).to.equal(0x34);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0x21]()).to.equal(3);
    });
  });

  describe("LD SP,nn", function() {
    it("loads 16-bit immediate value into stack pointer", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x1234);
      ops[0x31]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.sp).to.equal(0x1234);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0x31]()).to.equal(3);
    });
  });

  describe("LD SP,HL", function() {
    it("puts HL into stack pointer", function() {
      cpu.register.H = 0x32;
      cpu.register.L = 0x0B;
      ops[0xF9]();
      expect(cpu.sp).to.equal(0x320B);
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xF9]()).to.equal(2);
    });
  });

  describe("LDHL SP, n", function() {
    it("puts SP + 8-bit immediate signed value into HL", function() {
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      cpu.sp = 0xAB90;
      ops[0xF8]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.H).to.equal(0xAB);
      expect(cpu.register.L).to.equal(0x9A);
    });

    it("puts SP + 8-bit immediate signed value into HL (negative n)", function() {
      mockMMU.expects('read8').once().withArgs(0x201).returns(0xFE);
      cpu.sp = 0xAB90;
      ops[0xF8]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.register.H).to.equal(0xAB);
      expect(cpu.register.L).to.equal(0x8E);
      expect(cpu.register.F).to.equal(0x20);
    });

    it("resets Z and N flags", function() {
      mockMMU.expects('read8').returns(0x0A);
      cpu.sp = 0xAB90;
      cpu.register.F = 0xC0;
      ops[0xF8]();
      expect(cpu.register.F).to.equal(0x00);
    });

    it("sets C flag when overflowing 0xFFFF", function() {
      mockMMU.expects('read8').returns(0x7F);
      cpu.sp = 0xFFF0;
      ops[0xF8]();
      expect(cpu.register.H).to.equal(0x00);
      expect(cpu.register.L).to.equal(0x6F);
      expect(cpu.register.F).to.equal(0x10);
    });

    it("sets H flag when last 4-bits overflow 0xF", function() {
      mockMMU.expects('read8').returns(0x7F);
      cpu.sp = 0x2FF1;
      ops[0xF8]();
      expect(cpu.register.F).to.equal(0x20);
    });

    it("sets C flag when overflow 0x0000", function() {
      mockMMU.expects('read8').returns(0xF0);
      cpu.sp = 0x0001;
      ops[0xF8]();
      expect(cpu.register.H).to.equal(0xFF);
      expect(cpu.register.L).to.equal(0xF1);
      expect(cpu.register.F).to.equal(0x10);
    });

    it("sets H flag when last 4-bits overflow 0x0", function() {
      mockMMU.expects('read8').returns(0xFD);
      cpu.sp = 0x0011;
      ops[0xF8]();
      expect(cpu.register.F).to.equal(0x20);
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xF8]()).to.equal(3);
    });
  });

  describe("LD (nn),SP", function() {
    it("loads stack pointer into address at 16-bit immediate value nn", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x7348);
      mockMMU.expects('write16').once().withArgs(0x7348, 0x4321);
      cpu.sp = 0x4321;
      ops[0x08]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x202);
    });

    it("takes 5 machine cycles", function() {
      expect(ops[0x08]()).to.equal(5);
    });
  });

  [
    { src: 'AF', op: 0xF5 },
    { src: 'BC', op: 0xC5 },
    { src: 'DE', op: 0xD5 },
    { src: 'HL', op: 0xE5 }
  ].forEach(function(i) {
    var spl = i.src.split(''),
        rh = spl[0], rl = spl[1];

    describe("PUSH " + i.src, function() {
      it("Pushes " + i.src + " onto stack. Stack pointer is decremented twice.", function() {
        mockMMU.expects('write8').once().withArgs(0xFFFD, 0x5F);
        mockMMU.expects('write8').once().withArgs(0xFFFC, 0x80);
        cpu.sp = 0xFFFE;
        cpu.register[rh] = 0x5F;
        cpu.register[rl] = 0x80;
        ops[i.op]();
        mockMMU.verify();
        expect(cpu.sp).to.equal(0xFFFC);
      });

      it("takes 4 machine cycles", function() {
        expect(ops[i.op]()).to.equal(4);
      });
    });
  });

  [
    { dest: 'AF', op: 0xF1 },
    { dest: 'BC', op: 0xC1 },
    { dest: 'DE', op: 0xD1 },
    { dest: 'HL', op: 0xE1 }
  ].forEach(function(i) {
    var spl = i.dest.split(''),
        rh = spl[0], rl = spl[1];

    describe("POP " + i.dest, function() {
      it("Pop two bytes off stack into register pair " + i.dest + ". Stack pointer is incremented twice.", function() {
        mockMMU.expects('read8').once().withArgs(0xFFF1).returns(0xAB);
        mockMMU.expects('read8').once().withArgs(0xFFF2).returns(0xC2);
        cpu.sp = 0xFFF0;
        ops[i.op]();
        mockMMU.verify();
        expect(cpu.sp).to.equal(0xFFF2);
        expect(cpu.register[rh]).to.equal(0xAB);
        expect(cpu.register[rl]).to.equal(0xC2);
      });

      it("takes 3 machine cycles", function() {
        expect(ops[i.op]()).to.equal(3);
      });
    });
  });
});
