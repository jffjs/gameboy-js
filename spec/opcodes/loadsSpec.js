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
    
    describe("LD B, n", function() {
      it("loads immediate 8-bit value into register B", function() {
        ops[0x06]();
        expect(cpu.registers.B).toEqual(0x1A);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
      });
    });

    describe("LD C, n", function() {
      it("loads immediate 8-bit value into register C", function() {
        ops[0x0E]();
        expect(cpu.registers.C).toEqual(0x1A);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
      });
    });

    describe("LD D, n", function() {
      it("loads immediate 8-bit value into register D", function() {
        ops[0x16]();
        expect(cpu.registers.D).toEqual(0x1A);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
      });
    });
    
    describe("LD E, n", function() {
      it("loads immediate 8-bit value into register D", function() {
        ops[0x1E]();
        expect(cpu.registers.E).toEqual(0x1A);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
      });
    });

    describe("LD H, n", function() {
      it("loads immediate 8-bit value into register D", function() {
        ops[0x26]();
        expect(cpu.registers.H).toEqual(0x1A);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
      });
    });

    describe("LD L, n", function() {
      it("loads immediate 8-bit value into register D", function() {
        ops[0x2E]();
        expect(cpu.registers.L).toEqual(0x1A);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x201);
      });
    });
  });

  describe("LD r1, r2 - Load r2 into r1 - ", function() {
    describe("LD A, A", function() {
      it("loads A into A", function() {
        cpu.registers.A = 0x33;
        ops[0x7F]();
        expect(cpu.registers.A).toEqual(cpu.registers.A);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });

    describe("LD A, B", function() {
      it("loads B into A", function() {
        cpu.registers.A = 0x33;
        cpu.registers.B = 0x11;
        ops[0x78]();
        expect(cpu.registers.A).toEqual(cpu.registers.B);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });
     
    describe("LD A, C", function() {
      it("loads C into A", function() {
        cpu.registers.A = 0x33;
        cpu.registers.C = 0x11;
        ops[0x79]();
        expect(cpu.registers.A).toEqual(cpu.registers.C);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });

    describe("LD A, D", function() {
      it("loads D into A", function() {
        cpu.registers.A = 0x33;
        cpu.registers.D = 0x11;
        ops[0x7A]();
        expect(cpu.registers.A).toEqual(cpu.registers.D);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });

    describe("LD A, E", function() {
      it("loads E into A", function() {
        cpu.registers.A = 0x33;
        cpu.registers.E = 0x11;
        ops[0x7B]();
        expect(cpu.registers.A).toEqual(cpu.registers.E);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });

    describe("LD A, H", function() {
      it("loads H into A", function() {
        cpu.registers.A = 0x33;
        cpu.registers.H = 0x11;
        ops[0x7C]();
        expect(cpu.registers.A).toEqual(cpu.registers.H);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });

    describe("LD A, L", function() {
      it("loads L into A", function() {
        cpu.registers.A = 0x33;
        cpu.registers.L = 0x11;
        ops[0x7D]();
        expect(cpu.registers.A).toEqual(cpu.registers.L);
        expect(cpu.registers.M).toEqual(1);
        expect(cpu.registers.T).toEqual(4);
      });
    });

    describe("LD A, (HL)", function() {
      it("loads value from address in HL into A", function() {
        spyOn(mmu, 'read8').and.returnValue(0x30);
        cpu.registers.A = 0x33;
        cpu.registers.H = 0x31;
        cpu.registers.L = 0xAB;
        ops[0x7E]();
        expect(cpu.registers.A).toEqual(0x30);
        expect(cpu.registers.M).toEqual(2);
        expect(cpu.registers.T).toEqual(8);
        expect(mmu.read8).toHaveBeenCalledWith(0x31AB);
      });
    });
  });
});
