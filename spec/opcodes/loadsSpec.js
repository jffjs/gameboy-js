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
        spyOn(mmu, 'read8').and.returnValue(0x1A);
        ops[i.op]();
        expect(cpu.register[i.dest]).toEqual(0x1A);
        expect(cpu.register.M).toEqual(2);
        expect(cpu.register.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
        expect(cpu.pc).toEqual(0x201);
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
        expect(cpu.register[i.dest]).toEqual(cpu.register[i.src]);
        expect(cpu.register.M).toEqual(1);
        expect(cpu.register.T).toEqual(4);
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
      it("loads value from address in HL into " + i.dest, function() {
        spyOn(mmu, 'read8').and.returnValue(0x30);
        cpu.register[i.dest] = 0x33;
        cpu.register.H = 0x31;
        cpu.register.L = 0xAB;
        ops[i.op]();
        expect(cpu.register[i.dest]).toEqual(0x30);
        expect(cpu.register.M).toEqual(2);
        expect(cpu.register.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x31AB);
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
      it("loads " + i.src + " into address pointed to by HL", function() {
        spyOn(mmu, 'write8');
        if (i.src !== 'H' || i.src !== 'L') {
          cpu.register[i.src] = 0xBB;
        }
        cpu.register.H = 0x25;
        cpu.register.L = 0x7B;
        ops[i.op]();
        expect(mmu.write8).toHaveBeenCalledWith(0x257B, cpu.register[i.src]);
        expect(cpu.register.M).toEqual(2);
        expect(cpu.register.T).toEqual(8);
      });
    });
  });

  describe("LD (HL),n", function() {
    it("loads 8-bit immediate value into address pointed at by HL", function() {
      spyOn(mmu, 'read8').and.returnValue(0x88);
      spyOn(mmu, 'write8');
      cpu.register.H = 0x25;
      cpu.register.L = 0x7B;
      ops[0x36]();
      expect(mmu.read8).toHaveBeenCalledWith(0x201);
      expect(mmu.write8).toHaveBeenCalledWith(0x257B, 0x88);
    });
  });

  describe("LD (BC),A", function() {
    it("loads A into the address pointed at by BC", function() {
      spyOn(mmu, 'write8');
      cpu.register.A = 0xFA;
      cpu.register.B = 0x33;
      cpu.register.C = 0x45;
      ops[0x02]();
      expect(mmu.write8).toHaveBeenCalledWith(0x3345, cpu.register.A);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LD (DE),A", function() {
    it("loads A into the address pointed at by BC", function() {
      spyOn(mmu, 'write8');
      cpu.register.A = 0xFA;
      cpu.register.D = 0x33;
      cpu.register.E = 0x45;
      ops[0x12]();
      expect(mmu.write8).toHaveBeenCalledWith(0x3345, cpu.register.A);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LD (DE),A", function() {
    it("loads A into the address pointed at by DE", function() {
      spyOn(mmu, 'write8');
      cpu.register.A = 0xFA;
      cpu.register.D = 0x33;
      cpu.register.E = 0x45;
      ops[0x12]();
      expect(mmu.write8).toHaveBeenCalledWith(0x3345, cpu.register.A);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LD (nn),A", function() {
    it("loads value of A into address pointed at by 16-bit immediate value", function() {
      spyOn(mmu, 'read16').and.returnValue(0xA980);
      spyOn(mmu, 'write8');
      cpu.register.A = 0xBC;
      ops[0xEA]();
      expect(mmu.read16).toHaveBeenCalledWith(0x0202);
      expect(mmu.write8).toHaveBeenCalledWith(0xA980, 0xBC);
      expect(cpu.pc).toEqual(0x202);
      expect(cpu.register.M).toEqual(4);
      expect(cpu.register.T).toEqual(16);
    });
  });

  describe("LD A,(BC)", function() {
    it("loads value from address in BC into A", function() {
      spyOn(mmu, 'read8').and.returnValue(0x55);
      cpu.register.B = 0x33;
      cpu.register.C = 0x45;
      ops[0x0A]();
      expect(cpu.register.A).toEqual(0x55);
      expect(mmu.read8).toHaveBeenCalledWith(0x3345);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LD A,(DE)", function() {
    it("loads value from address in DE into A", function() {
      spyOn(mmu, 'read8').and.returnValue(0x55);
      cpu.register.D = 0x33;
      cpu.register.E = 0x45;
      ops[0x1A]();
      expect(cpu.register.A).toEqual(0x55);
      expect(mmu.read8).toHaveBeenCalledWith(0x3345);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LD A,(nn)", function() {
    it("loads value from address in 16-bit immediate value into A", function() {
      spyOn(mmu, 'read16').and.returnValue(0x5544);
      spyOn(mmu, 'read8').and.returnValue(0x23);
      ops[0xFA]();
      expect(cpu.register.A).toEqual(0x23);
      expect(cpu.pc).toEqual(0x202);
      expect(mmu.read16).toHaveBeenCalledWith(0x202);
      expect(cpu.register.M).toEqual(4);
      expect(cpu.register.T).toEqual(16);
    });
  });

  describe("LDH A,(C)", function() {
    it("loads value at address $FF00 + C into A", function() {
      spyOn(mmu, 'read8').and.returnValue(0x34);
      cpu.register.C = 0x08;
      ops[0xF2]();
      expect(mmu.read8).toHaveBeenCalledWith(0xFF08);
      expect(cpu.register.A).toEqual(0x34);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDH (C),A", function() {
    it("loads A into address $FF00 + C", function() {
      spyOn(mmu, 'write8');
      cpu.register.A = 0x44;
      cpu.register.C = 0x08;
      ops[0xE2]();
      expect(mmu.write8).toHaveBeenCalledWith(0xFF08, 0x44);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDD A,(HL)", function() {
    it("loads value at address HL into A and decrements HL", function() {
      spyOn(mmu, 'read8').and.returnValue(0x78);
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x3A]();
      expect(mmu.read8).toHaveBeenCalledWith(0x72B6);
      expect(cpu.register.A).toEqual(0x78);
      expect(cpu.register.H).toEqual(0x72);
      expect(cpu.register.L).toEqual(0xB5);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDD (HL),A", function() {
    it("loads A into address HL and decrements HL", function() {
      spyOn(mmu, 'write8');
      cpu.register.A = 0x10;
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x32]();
      expect(mmu.write8).toHaveBeenCalledWith(0x72B6, 0x10);
      expect(cpu.register.H).toEqual(0x72);
      expect(cpu.register.L).toEqual(0xB5);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDI A,(HL)", function() {
    it("loads value at address HL into A and increments HL", function() {
      spyOn(mmu, 'read8').and.returnValue(0x78);
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x2A]();
      expect(mmu.read8).toHaveBeenCalledWith(0x72B6);
      expect(cpu.register.A).toEqual(0x78);
      expect(cpu.register.H).toEqual(0x72);
      expect(cpu.register.L).toEqual(0xB7);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDI (HL),A", function() {
    it("loads A into address HL and increments HL", function() {
      spyOn(mmu, 'write8');
      cpu.register.A = 0x10;
      cpu.register.H = 0x72;
      cpu.register.L = 0xB6;
      ops[0x22]();
      expect(mmu.write8).toHaveBeenCalledWith(0x72B6, 0x10);
      expect(cpu.register.H).toEqual(0x72);
      expect(cpu.register.L).toEqual(0xB7);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDH (n),A", function() {
    it("loads A into address $FF00 + 8-bit immediate value n", function() {
      spyOn(mmu, 'write8');
      spyOn(mmu, 'read8').and.returnValue(0x06);
      cpu.register.A = 0xC7;
      ops[0xE0]();
      expect(mmu.read8).toHaveBeenCalledWith(0x201);
      expect(cpu.pc).toEqual(0x201);
      expect(mmu.write8).toHaveBeenCalledWith(0xFF06, 0xC7);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });
  });

  describe("LDH A,(n)", function() {
    it("loads value from address $FF00 + 8-bit immediate value n into A", function() {
      spyOn(mmu, 'read8').and.returnValue(0x06);
      cpu.register.A = 0xC7;
      ops[0xF0]();
      expect(mmu.read8.calls.argsFor(0)).toEqual([0x201]);
      expect(cpu.pc).toEqual(0x201);
      expect(mmu.read8.calls.argsFor(1)).toEqual([0xFF06]);
      expect(cpu.register.A).toEqual(0x06);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });
  });

  describe("LD BC,nn", function() {
    it("loads 16-bit immediate value into BC", function() {
      spyOn(mmu, 'read16').and.returnValue(0x1234);
      ops[0x01]();
      expect(mmu.read16).toHaveBeenCalledWith(0x202);
      expect(cpu.pc).toEqual(0x202);
      expect(cpu.register.B).toEqual(0x12);
      expect(cpu.register.C).toEqual(0x34);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });
  });

  describe("LD DE,nn", function() {
    it("loads 16-bit immediate value into DE", function() {
      spyOn(mmu, 'read16').and.returnValue(0x1234);
      ops[0x11]();
      expect(mmu.read16).toHaveBeenCalledWith(0x202);
      expect(cpu.pc).toEqual(0x202);
      expect(cpu.register.D).toEqual(0x12);
      expect(cpu.register.E).toEqual(0x34);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });
  });

  describe("LD HL,nn", function() {
    it("loads 16-bit immediate value into HL", function() {
      spyOn(mmu, 'read16').and.returnValue(0x1234);
      ops[0x21]();
      expect(mmu.read16).toHaveBeenCalledWith(0x202);
      expect(cpu.pc).toEqual(0x202);
      expect(cpu.register.H).toEqual(0x12);
      expect(cpu.register.L).toEqual(0x34);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });
  });

  describe("LD SP,nn", function() {
    it("loads 16-bit immediate value into stack pointer", function() {
      spyOn(mmu, 'read16').and.returnValue(0x1234);
      ops[0x31]();
      expect(mmu.read16).toHaveBeenCalledWith(0x202);
      expect(cpu.pc).toEqual(0x202);
      expect(cpu.sp).toEqual(0x1234);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });
  });

  describe("LD SP,HL", function() {
    it("puts HL into stack pointer", function() {
      cpu.register.H = 0x32;
      cpu.register.L = 0x0B;
      ops[0xF9]();
      expect(cpu.sp).toEqual(0x320B);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });
  });

  describe("LDHL SP, n", function() {
    it("puts SP + 8-bit immediate signed value into HL", function() {
      spyOn(mmu, 'read8').and.returnValue(0x0A);
      cpu.sp = 0xAB90;
      ops[0xF8]();
      expect(mmu.read8).toHaveBeenCalledWith(0x201);
      expect(cpu.pc).toEqual(0x201);
      expect(cpu.register.H).toEqual(0xAB);
      expect(cpu.register.L).toEqual(0x9A);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
    });

    it("puts SP + 8-bit immediate signed value into HL (negative n)", function() {
      spyOn(mmu, 'read8').and.returnValue(0xFE);
      cpu.sp = 0xAB90;
      ops[0xF8]();
      expect(mmu.read8).toHaveBeenCalledWith(0x201);
      expect(cpu.pc).toEqual(0x201);
      expect(cpu.register.H).toEqual(0xAB);
      expect(cpu.register.L).toEqual(0x8E);
      expect(cpu.register.M).toEqual(3);
      expect(cpu.register.T).toEqual(12);
      expect(cpu.register.F).toEqual(0x20);
    });

    it("resets Z and N flags", function() {
      spyOn(mmu, 'read8').and.returnValue(0x0A);
      cpu.sp = 0xAB90;
      cpu.register.F = 0xC0;
      ops[0xF8]();
      expect(cpu.register.F).toEqual(0x00);
    });

    it("sets C flag when overflowing 0xFFFF", function() {
      spyOn(mmu, 'read8').and.returnValue(0x7F);
      cpu.sp = 0xFFF0;
      ops[0xF8]();
      expect(cpu.register.H).toEqual(0x00);
      expect(cpu.register.L).toEqual(0x6F);
      expect(cpu.register.F).toEqual(0x10);
    });

    it("sets H flag when last 4-bits overflow 0xF", function() {
      spyOn(mmu, 'read8').and.returnValue(0x7F);
      cpu.sp = 0x2FF1;
      ops[0xF8]();
      expect(cpu.register.F).toEqual(0x20);
    });

    it("sets C flag when overflow 0x0000", function() {
      spyOn(mmu, 'read8').and.returnValue(0xF0);
      cpu.sp = 0x0001;
      ops[0xF8]();
      expect(cpu.register.H).toEqual(0xFF);
      expect(cpu.register.L).toEqual(0xF1);
      expect(cpu.register.F).toEqual(0x10);
    });

    it("sets H flag when last 4-bits overflow 0x0", function() {
      spyOn(mmu, 'read8').and.returnValue(0xFD);
      cpu.sp = 0x0011;
      ops[0xF8]();
      expect(cpu.register.F).toEqual(0x20);
    });
  });

  describe("LD (nn),SP", function() {
    it("loads stack pointer into address at 16-bit immediate value nn", function() {
      spyOn(mmu, 'read16').and.returnValue(0x7348);
      spyOn(mmu, 'write16');
      cpu.sp = 0x4321;
      ops[0x08]();
      expect(mmu.read16).toHaveBeenCalledWith(0x202);
      expect(cpu.pc).toEqual(0x202);
      expect(mmu.write16).toHaveBeenCalledWith(0x7348, 0x4321);
      expect(cpu.register.M).toEqual(5);
      expect(cpu.register.T).toEqual(20);
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
        spyOn(mmu, 'write8');
        cpu.sp = 0xFFFE;
        cpu.register[rh] = 0x5F;
        cpu.register[rl] = 0x80;
        ops[i.op]();
        expect(mmu.write8.calls.argsFor(0)).toEqual([0xFFFD, 0x5F]);
        expect(mmu.write8.calls.argsFor(1)).toEqual([0xFFFC, 0x80]);
        expect(cpu.sp).toEqual(0xFFFC);
        expect(cpu.register.M).toEqual(4);
        expect(cpu.register.T).toEqual(16);
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

    describe("POP " + i.src, function() {
      it("Pop two bytes off stack into register pair " + i.src + ". Stack pointer is incremented twice.", function() {
        spyOn(mmu, 'read8').and.returnValue(0x23);
        cpu.sp = 0xFFF0;
        ops[i.op]();
        expect(mmu.read8.calls.argsFor(0)).toEqual([0xFFF1]);
        expect(mmu.read8.calls.argsFor(1)).toEqual([0xFFF2]);
        expect(cpu.sp).toEqual(0xFFF2);
        expect(cpu.register[rh]).toEqual(0x23);
        expect(cpu.register[rl]).toEqual(0x23);
        expect(cpu.register.M).toEqual(3);
        expect(cpu.register.T).toEqual(12);
      });
    });
  });
});
