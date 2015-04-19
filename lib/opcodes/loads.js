/*
 * Load opcodes
 */
module.exports = function(cpu, mmu) {
  function LDrn(r) {
    return function() {
      cpu.register[r] = mmu.read8(++cpu.pc);
      return 2;
    };
  }

  function LDr1r2(r1, r2) {
    return function() {
      cpu.register[r1] = cpu.register[r2];
      return 1;
    };
  }

  function LDr_HL_(r) {
    return function() {
      var addr = (cpu.register.H << 8) | cpu.register.L;
      cpu.register[r] = mmu.read8(addr);
      return 2;
    };
  }

  function LD_HL_r(r) {
    return function() {
      var addr = (cpu.register.H << 8) | cpu.register.L;
      mmu.write8(addr, cpu.register[r]);
      return 2;
    };
  }

  function LD_rr_A(rr) {
    var spl = rr.split(''),
        rh = spl[0], rl = spl[1];
    return function() {
      var addr = (cpu.register[rh] << 8) | cpu.register[rl];
      mmu.write8(addr, cpu.register.A);
      return 2;
    };
  };

  function LD_HL_n() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(++cpu.pc);
    mmu.write8(addr, n);
    return 3;
  }

  function LDA_rr_(rr) {
    var spl = rr.split(''),
        rh = spl[0], rl = spl[1];
    return function() {
      var addr = (cpu.register[rh] << 8) | cpu.register[rl];
      cpu.register.A = mmu.read8(addr);
      return 2;
    };
  };

  function LD_nn_A() {
    cpu.pc += 2;
    mmu.write8(mmu.read16(cpu.pc), cpu.register.A);
    return 4;
  }

  function LDA_nn_() {
    cpu.pc += 2;
    var addr = mmu.read16(cpu.pc);
    cpu.register.A = mmu.read8(addr);
    return 4;
  }

  function LDHA_C_() {
    cpu.register.A = mmu.read8(0xFF00 + cpu.register.C);
    return 2;
  }

  function LDH_C_A() {
    mmu.write8(0xFF00 + cpu.register.C, cpu.register.A);
    return 2;
  }

  function LDH_n_A() {
    var n = mmu.read8(++cpu.pc);
    mmu.write8(0xFF00 + n, cpu.register.A);
    return 3;
  }

  function LDHA_n_() {
    var n = mmu.read8(++cpu.pc);
    cpu.register.A = mmu.read8(0xFF00 + n);
    return 3;
  }

  function LDDA_HL() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    cpu.register.A = mmu.read8(addr);
    addr--;
    cpu.register.H = addr >> 8;
    cpu.register.L = addr & 0x00FF;
    return 2;
  }

  function LDD_HL_A() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    mmu.write8(addr, cpu.register.A);
    addr--;
    cpu.register.H = addr >> 8;
    cpu.register.L = addr & 0x00FF;
    return 2;
  }

  function LDIA_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    cpu.register.A = mmu.read8(addr);
    addr++;
    cpu.register.H = addr >> 8;
    cpu.register.L = addr & 0x00FF;
    return 2;
  }

  function LDI_HL_A() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    mmu.write8(addr, cpu.register.A);
    addr++;
    cpu.register.H = addr >> 8;
    cpu.register.L = addr & 0x00FF;
    return 2;
  }

  function LDrrnn(rr) {
    var spl = rr.split(''),
        rh = spl[0], rl = spl[1];
    return function() {
      cpu.pc += 2;
      var nn = mmu.read16(cpu.pc);
      cpu.register[rh] = nn >> 8;
      cpu.register[rl] = nn & 0x00FF;
      return 3;
    };
  }

  function LDSPnn() {
    cpu.pc += 2;
    cpu.sp = mmu.read16(cpu.pc);
    return 3;
  }

  function LDSPHL() {
    cpu.sp = (cpu.register.H << 8) | cpu.register.L;
    return 2;
  }

  function LDHLSPn() {
    var addr;
    var n = mmu.read8(++cpu.pc);
    if (n & 0x80) {
      addr = cpu.sp + ((~n + 1) & 0xFF) * -1; // Decode two's complement
      if (addr < 0) {
        cpu.setFlag('C');
        addr &= 0xFFFF;
      }

      if ((cpu.sp & 0xF) - (n & 0xF) < 0) {
        cpu.setFlag('H');
      }
    } else {
      addr = cpu.sp + n;
      if (addr > 0xFFFF) {
        cpu.setFlag('C');
        addr &= 0xFFFF;
      }

      if ((cpu.sp & 0xF) + (n & 0xF) > 0xF) {
        cpu.setFlag('H');
      }
    }
    cpu.register.H = addr >> 8;
    cpu.register.L = addr & 0x00FF;
    cpu.resetFlag('Z');
    cpu.resetFlag('N');
    return 3;
  }

  function LD_nn_SP() {
    cpu.pc += 2;
    var addr = mmu.read16(cpu.pc);
    mmu.write16(addr, cpu.sp);
    return 5;
  }

  function PUSHrr(rr) {
    var spl = rr.split(''),
        rh = spl[0], rl = spl[1];
    return function() {
      cpu.sp--;
      mmu.write8(cpu.sp, cpu.register[rh]);
      cpu.sp--;
      mmu.write8(cpu.sp, cpu.register[rl]);
      return 4;
    };
  }

  function POPrr(rr) {
    var spl = rr.split(''),
        rh = spl[0], rl = spl[1];
    return function() {
      cpu.sp++;
      cpu.register[rh] = mmu.read8(cpu.sp);
      cpu.sp++;
      cpu.register[rl] = mmu.read8(cpu.sp);
      return 3;
    };
  }

  return {
    0x3E: LDrn('A'),
    0x06: LDrn('B'),
    0x0E: LDrn('C'),
    0x16: LDrn('D'),
    0x1E: LDrn('E'),
    0x26: LDrn('H'),
    0x2E: LDrn('L'),
    0x7F: LDr1r2('A', 'A'),
    0x78: LDr1r2('A', 'B'),
    0x79: LDr1r2('A', 'C'),
    0x7A: LDr1r2('A', 'D'),
    0x7B: LDr1r2('A', 'E'),
    0x7C: LDr1r2('A', 'H'),
    0x7D: LDr1r2('A', 'L'),
    0x47: LDr1r2('B', 'A'),
    0x40: LDr1r2('B', 'B'),
    0x41: LDr1r2('B', 'C'),
    0x42: LDr1r2('B', 'D'),
    0x43: LDr1r2('B', 'E'),
    0x44: LDr1r2('B', 'H'),
    0x45: LDr1r2('B', 'L'),
    0x4F: LDr1r2('C', 'A'),
    0x48: LDr1r2('C', 'B'),
    0x49: LDr1r2('C', 'C'),
    0x4A: LDr1r2('C', 'D'),
    0x4B: LDr1r2('C', 'E'),
    0x4C: LDr1r2('C', 'H'),
    0x4D: LDr1r2('C', 'L'),
    0x57: LDr1r2('D', 'A'),
    0x50: LDr1r2('D', 'B'),
    0x51: LDr1r2('D', 'C'),
    0x52: LDr1r2('D', 'D'),
    0x53: LDr1r2('D', 'E'),
    0x54: LDr1r2('D', 'H'),
    0x55: LDr1r2('D', 'L'),
    0x5F: LDr1r2('E', 'A'),
    0x58: LDr1r2('E', 'B'),
    0x59: LDr1r2('E', 'C'),
    0x5A: LDr1r2('E', 'D'),
    0x5B: LDr1r2('E', 'E'),
    0x5C: LDr1r2('E', 'H'),
    0x5D: LDr1r2('E', 'L'),
    0x67: LDr1r2('H', 'A'),
    0x60: LDr1r2('H', 'B'),
    0x61: LDr1r2('H', 'C'),
    0x62: LDr1r2('H', 'D'),
    0x63: LDr1r2('H', 'E'),
    0x64: LDr1r2('H', 'H'),
    0x65: LDr1r2('H', 'L'),
    0x6F: LDr1r2('L', 'A'),
    0x68: LDr1r2('L', 'B'),
    0x69: LDr1r2('L', 'C'),
    0x6A: LDr1r2('L', 'D'),
    0x6B: LDr1r2('L', 'E'),
    0x6C: LDr1r2('L', 'H'),
    0x6D: LDr1r2('L', 'L'),
    0x7E: LDr_HL_('A'),
    0x46: LDr_HL_('B'),
    0x4E: LDr_HL_('C'),
    0x56: LDr_HL_('D'),
    0x5E: LDr_HL_('E'),
    0x66: LDr_HL_('H'),
    0x6E: LDr_HL_('L'),
    0x77: LD_HL_r('A'),
    0x70: LD_HL_r('B'),
    0x71: LD_HL_r('C'),
    0x72: LD_HL_r('D'),
    0x73: LD_HL_r('E'),
    0x74: LD_HL_r('H'),
    0x75: LD_HL_r('L'),
    0x36: LD_HL_n,
    0x02: LD_rr_A('BC'),
    0x12: LD_rr_A('DE'),
    0xEA: LD_nn_A,
    0x0A: LDA_rr_('BC'),
    0x1A: LDA_rr_('DE'),
    0xFA: LDA_nn_,
    0xF2: LDHA_C_,
    0xE2: LDH_C_A,
    0x3A: LDDA_HL,
    0x32: LDD_HL_A,
    0x2A: LDIA_HL_,
    0x22: LDI_HL_A,
    0xE0: LDH_n_A,
    0xF0: LDHA_n_,
    0x01: LDrrnn('BC'),
    0x11: LDrrnn('DE'),
    0x21: LDrrnn('HL'),
    0x31: LDSPnn,
    0xF9: LDSPHL,
    0xF8: LDHLSPn,
    0x08: LD_nn_SP,
    0xF5: PUSHrr('AF'),
    0xC5: PUSHrr('BC'),
    0xD5: PUSHrr('DE'),
    0xE5: PUSHrr('HL'),
    0xF1: POPrr('AF'),
    0xC1: POPrr('BC'),
    0xD1: POPrr('DE'),
    0xE1: POPrr('HL')
  };
};
