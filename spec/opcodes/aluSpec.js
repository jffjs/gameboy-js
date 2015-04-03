var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var alu = require('../../lib/opcodes/alu');

describe("ALU opcodes", function() {
  var cpu, mmu, ops;

  beforeEach(function() {
    cpu = new CPU();
    mmu = new MMU();
    ops = alu(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("ADD A,A", function() {
    it("adds A to A", function() {
      cpu.register.A = 0x45;
      ops[0x87]();
      expect(cpu.register.A).toEqual(0x8A);
      expect(cpu.register.M).toEqual(1);
      expect(cpu.register.T).toEqual(4);
    });

    it("sets Z flag if result is zero", function() {
      cpu.register.A = 0x0;
      ops[0x87]();
      expect((cpu.register.F & 0x80) >> 7).toEqual(1);
    });

    it("resets N flag", function() {
      cpu.register.A = 0x2;
      ops[0x87]();
      expect((cpu.register.F & 0x40) >> 6).toEqual(0);
    });
    
    it("sets H flag is carry from bit 3", function() {
      cpu.register.A = 0xE;
      ops[0x87]();
      expect((cpu.register.F & 0x20) >> 5).toEqual(1);
    });

    it("sets C flag if carry from bit 7", function() {
      cpu.register.A = 0x9F;
      ops[0x87]();
      expect((cpu.register.F & 0x10) >> 4).toEqual(1);
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
        expect(cpu.register.A).toEqual(0x58);
        expect(cpu.register.M).toEqual(1);
        expect(cpu.register.T).toEqual(4);
      });

      it("sets Z flag if result is zero", function() {
        cpu.register[i.r] = 0x0;
        cpu.register.A = 0x0;
        ops[i.op]();
        expect(cpu.flag.Z()).toEqual(1);
      });

      it("resets N flag", function() {
        cpu.register[i.r] = 0x1;
        cpu.register.A = 0x2;
        ops[i.op]();
        expect(cpu.flag.N()).toEqual(0);
      });
      
      it("sets H flag is carry from bit 3", function() {
        cpu.register[i.r] = 0xF;
        cpu.register.A = 0x1;
        ops[i.op]();
        expect(cpu.flag.H()).toEqual(1);
      });

      it("sets C flag if carry from bit 7", function() {
        cpu.register[i.r] = 0xFF;
        cpu.register.A = 0x1;
        ops[i.op]();
        expect(cpu.flag.C()).toEqual(1);
      });
    });
  });

  describe("ADD A,(HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0xC4;
      cpu.register.L = 0xB2;
    });

    it("adds value in address HL to A", function() {
      spyOn(mmu, 'read8').and.returnValue(0x3B);
      cpu.register.A = 0x08;
      ops[0x86]();
      expect(mmu.read8).toHaveBeenCalledWith(0xC4B2);
      expect(cpu.register.A).toEqual(0x43);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });

    it("sets Z flag if result is zero", function() {
      spyOn(mmu, 'read8').and.returnValue(0x01);
      cpu.register.A = 0xFF;
      ops[0x86]();
      expect(cpu.flag.Z()).toEqual(1);
    });

    it("resets N flag", function() {
      spyOn(mmu, 'read8').and.returnValue(0x01);
      cpu.register.A = 0x2;
      ops[0x86]();
      expect(cpu.flag.N()).toEqual(0);
    });
    
    it("sets H flag is carry from bit 3", function() {
      spyOn(mmu, 'read8').and.returnValue(0x0F);
      cpu.register.A = 0x1;
      ops[0x86]();
      expect(cpu.flag.H()).toEqual(1);
    });

    it("sets C flag if carry from bit 7", function() {
      spyOn(mmu, 'read8').and.returnValue(0xFF);
      cpu.register.A = 0x1;
      ops[0x86]();
      expect((cpu.register.F & 0x10) >> 4).toEqual(1);
    });
  });

  describe("ADD A,n", function() {
    it("adds 8-bit immediate value to A", function() {
      spyOn(mmu, 'read8').and.returnValue(0x3B);
      cpu.register.A = 0x08;
      ops[0xC6]();
      expect(mmu.read8).toHaveBeenCalledWith(0x201);
      expect(cpu.pc).toEqual(0x201);
      expect(cpu.register.A).toEqual(0x43);
      expect(cpu.register.M).toEqual(2);
      expect(cpu.register.T).toEqual(8);
    });

    it("sets Z flag if result is zero", function() {
      spyOn(mmu, 'read8').and.returnValue(0x01);
      cpu.register.A = 0xFF;
      ops[0xC6]();
      expect(cpu.flag.Z()).toEqual(1);
    });

    it("resets N flag", function() {
      spyOn(mmu, 'read8').and.returnValue(0x01);
      cpu.register.A = 0x2;
      ops[0xC6]();
      expect(cpu.flag.N()).toEqual(0);
    });
    
    it("sets H flag is carry from bit 3", function() {
      spyOn(mmu, 'read8').and.returnValue(0x0F);
      cpu.register.A = 0x1;
      ops[0xC6]();
      expect(cpu.flag.H()).toEqual(1);
    });

    it("sets C flag if carry from bit 7", function() {
      spyOn(mmu, 'read8').and.returnValue(0xFF);
      cpu.register.A = 0x1;
      ops[0xC6]();
      expect((cpu.register.F & 0x10) >> 4).toEqual(1);
    });
  });
});
