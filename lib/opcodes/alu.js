/**
 * ALU opcodes
 */
function checkCarry(a, b) {
  return a + b > 0xFF;
}

function check16BitCarry(a, b) {
  return a + b > 0xFFFF;
}

function checkHalfCarry(a, b, c) {
  return (a & 0xF) + (b & 0xF) + (c ? c & 0xf : 0) > 0xF;
}

function check16BitHalfCarry(a, b) {
  return (a & 0xFFF) + (b & 0xFFF) > 0xFFF;
}

function checkBorrow(a, b) {
  return a - b < 0;
}

function check16BitBorrow(a, b) {
  return a - b < 0;
}

function checkHalfBorrow(a, b, c) {
  return (a & 0xF) - (b & 0xF) - (c ? c & 0xF : 0) < 0;
}

function check16BitHalfBorrow(a, b) {
  return (a & 0xFFF) - (b & 0xFFF) < 0;
}

module.exports = function(cpu, mmu) {
  function ADDAr(r) {
    return function() {
      cpu.resetFlag('N');
      checkCarry(cpu.register.A, cpu.register[r]) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfCarry(cpu.register.A, cpu.register[r]) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A + cpu.register[r]) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function ADDA_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ADDAn() {
    var n = mmu.read8(++cpu.pc);
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ADCAr(r) {
    return function() {
      cpu.resetFlag('N');
      var carry = cpu.testFlag('C');
      checkCarry(cpu.register.A, cpu.register[r] + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfCarry(cpu.register.A, cpu.register[r], carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A + cpu.register[r] + carry) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function ADCA_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var carry = cpu.testFlag('C');
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n + carry) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ADCAn() {
    var n = mmu.read8(++cpu.pc);
    var carry = cpu.testFlag('C');
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n + carry) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function SUBAr(r) {
    return function() {
      cpu.setFlag('N');
      checkBorrow(cpu.register.A, cpu.register[r]) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfBorrow((cpu.register.A & 0xF), (cpu.register[r] & 0xF)) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A - cpu.register[r]) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function SUBA_HL_() {
    cpu.setFlag('N');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    checkBorrow(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - n) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function SUBAn() {
    var n = mmu.read8(++cpu.pc);
    cpu.setFlag('N');
    checkBorrow(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - n) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function SBCAr(r) {
    return function() {
      cpu.setFlag('N');
      var carry = cpu.testFlag('C');
      checkBorrow(cpu.register.A, cpu.register[r] + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfBorrow(cpu.register.A, cpu.register[r], carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A - (cpu.register[r]  + carry)) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function SBCA_HL_() {
    cpu.setFlag('N');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var carry = cpu.testFlag('C');
    checkBorrow(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - (n + carry)) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function SBCAn() {
    var n = mmu.read8(++cpu.pc);
    var carry = cpu.testFlag('C');
    cpu.setFlag('N');
    checkBorrow(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - (n + carry)) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ANDr(r) {
    return function() {
      cpu.setFlag('H');
      cpu.resetFlag('N');
      cpu.resetFlag('C');
      cpu.register.A &= cpu.register[r];
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function AND_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    cpu.setFlag('H');
    cpu.resetFlag('N');
    cpu.resetFlag('C');
    cpu.register.A &= n;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ANDn() {
    var n = mmu.read8(++cpu.pc);
    cpu.setFlag('H');
    cpu.resetFlag('N');
    cpu.resetFlag('C');
    cpu.register.A &= n;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ORr(r) {
    return function() {
      cpu.resetFlag('H');
      cpu.resetFlag('N');
      cpu.resetFlag('C');
      cpu.register.A |= cpu.register[r];
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function OR_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    cpu.resetFlag('H');
    cpu.resetFlag('N');
    cpu.resetFlag('C');
    cpu.register.A |= n;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function ORn() {
    var n = mmu.read8(++cpu.pc);
    cpu.resetFlag('H');
    cpu.resetFlag('N');
    cpu.resetFlag('C');
    cpu.register.A |= n;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function XORr(r) {
    return function() {
      cpu.resetFlag('H');
      cpu.resetFlag('N');
      cpu.resetFlag('C');
      cpu.register.A ^= cpu.register[r];
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function XOR_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    cpu.resetFlag('H');
    cpu.resetFlag('N');
    cpu.resetFlag('C');
    cpu.register.A ^= n;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function XORn() {
    var n = mmu.read8(++cpu.pc);
    cpu.resetFlag('H');
    cpu.resetFlag('N');
    cpu.resetFlag('C');
    cpu.register.A ^= n;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function CPr(r) {
    return function() {
      cpu.setFlag('N');
      checkBorrow(cpu.register.A, cpu.register[r]) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfBorrow((cpu.register.A & 0xF), (cpu.register[r] & 0xF)) ? cpu.setFlag('H') : cpu.resetFlag('H');
      var result = (cpu.register.A - cpu.register[r]) & 0xFF;
      result === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function CP_HL_() {
    cpu.setFlag('N');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    checkBorrow(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    var result = (cpu.register.A - n) & 0xFF;
    result === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function CPn() {
    var n = mmu.read8(++cpu.pc);
    cpu.setFlag('N');
    checkBorrow(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    var result = (cpu.register.A - n) & 0xFF;
    result === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 2;
  }

  function INCr(r) {
    return function() {
      cpu.resetFlag('N');
      checkHalfCarry(cpu.register[r], 1) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register[r] = (cpu.register[r] + 1) & 0xFF;
      cpu.register[r] === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function INC_HL_() {
    cpu.resetFlag('N');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    checkHalfCarry(n, 1) ? cpu.setFlag('H') : cpu.resetFlag('H');
    mmu.write8(addr, (n + 1) & 0xFF);
    ((n + 1) & 0xFF) === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 3;
  }

  function DECr(r) {
    return function() {
      cpu.setFlag('N');
      checkHalfBorrow(cpu.register[r], 1) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register[r] = (cpu.register[r] - 1) & 0xFF;
      cpu.register[r] === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 1;
    };
  }

  function DEC_HL_() {
    cpu.setFlag('N');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    checkHalfBorrow(n, 1) ? cpu.setFlag('H') : cpu.resetFlag('H');
    mmu.write8(addr, (n - 1) & 0xFF);
    ((n - 1) & 0xFF) === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 3;
  }

  function ADDHLrr(rr) {
    var spl = rr.split(''),
        r1 = spl[0], r2 = spl[1];
    return function() {
      cpu.resetFlag('N');
      var hl = (cpu.register.H << 8) | cpu.register.L;
      var rr = (cpu.register[r1] << 8) | cpu.register[r2];
      check16BitCarry(hl, rr) ? cpu.setFlag('C') : cpu.resetFlag('C');
      check16BitHalfCarry(hl, rr) ? cpu.setFlag('H') : cpu.resetFlag('H');
      hl = (hl + rr) & 0xFFFF;
      cpu.register.H = (hl & 0xFF00) >> 8;
      cpu.register.L = (hl & 0x00FF);
      return 2;
    };
  }

  function ADDHLSP() {
    cpu.resetFlag('N');
    var hl = (cpu.register.H << 8) | cpu.register.L;
    check16BitCarry(hl, cpu.sp) ? cpu.setFlag('C') : cpu.resetFlag('C');
    check16BitHalfCarry(hl, cpu.sp) ? cpu.setFlag('H') : cpu.resetFlag('H');
    hl = (hl + cpu.sp) & 0xFFFF;
    cpu.register.H = (hl & 0xFF00) >> 8;
    cpu.register.L = (hl & 0x00FF);
    return 2;
  }

  function ADDSPn() {
    cpu.resetFlag('Z');
    cpu.resetFlag('N');
    var n = mmu.read8(++cpu.pc);
    if (n & 0x80) {
      n = ((~n + 1) & 0xFF);
      check16BitHalfBorrow(cpu.sp, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
      check16BitBorrow(cpu.sp, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
      n *= -1;
    } else {
      check16BitHalfCarry(cpu.sp, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
      check16BitCarry(cpu.sp, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    }
    cpu.sp = (cpu.sp + n) & 0xFFFF;
    return 4;
  }

  function INCrr(rr) {
    var spl = rr.split(''),
        r1 = spl[0], r2 = spl[1];

    return function() {
      var n = (cpu.register[r1] << 8) | cpu.register[r2];
      n = ++n & 0xFFFF;
      cpu.register[r1] = (n & 0xFF00) >> 8;
      cpu.register[r2] = n & 0xFF;
      // cpu.register[r2] = ++cpu.register[r2] & 0xFF;
      // if(!cpu.register[r2]) {
      //   cpu.register[r1] = ++cpu.register[r1] & 0xFF;
      // }
      return 2;
    };
  }

  function INCSP() {
    cpu.sp = ++cpu.sp & 0xFFFF;
    return 2;
  }

  function DECrr(rr) {
    var spl = rr.split(''),
        r1 = spl[0], r2 = spl[1];

    return function() {
      var n = (cpu.register[r1] << 8) | cpu.register[r2];
      n = --n & 0xFFFF;
      cpu.register[r1] = (n & 0xFF00) >> 8;
      cpu.register[r2] = n & 0xFF;
      return 2;
    };
  }

  function DECSP() {
    cpu.sp = --cpu.sp & 0xFFFF;
    return 2;
  }

  return {
    0x87: ADDAr('A'),
    0x80: ADDAr('B'),
    0x81: ADDAr('C'),
    0x82: ADDAr('D'),
    0x83: ADDAr('E'),
    0x84: ADDAr('H'),
    0x85: ADDAr('L'),
    0x86: ADDA_HL_,
    0xC6: ADDAn,
    0x8F: ADCAr('A'),
    0x88: ADCAr('B'),
    0x89: ADCAr('C'),
    0x8A: ADCAr('D'),
    0x8B: ADCAr('E'),
    0x8C: ADCAr('H'),
    0x8D: ADCAr('L'),
    0x8E: ADCA_HL_,
    0xCE: ADCAn,
    0x97: SUBAr('A'),
    0x90: SUBAr('B'),
    0x91: SUBAr('C'),
    0x92: SUBAr('D'),
    0x93: SUBAr('E'),
    0x94: SUBAr('H'),
    0x95: SUBAr('L'),
    0x96: SUBA_HL_,
    0xD6: SUBAn,
    0x9F: SBCAr('A'),
    0x98: SBCAr('B'),
    0x99: SBCAr('C'),
    0x9A: SBCAr('D'),
    0x9B: SBCAr('E'),
    0x9C: SBCAr('H'),
    0x9D: SBCAr('L'),
    0x9E: SBCA_HL_,
    0xDE: SBCAn,
    0xA7: ANDr('A'),
    0xA0: ANDr('B'),
    0xA1: ANDr('C'),
    0xA2: ANDr('D'),
    0xA3: ANDr('E'),
    0xA4: ANDr('H'),
    0xA5: ANDr('L'),
    0xA6: AND_HL_,
    0xE6: ANDn,
    0xB7: ORr('A'),
    0xB0: ORr('B'),
    0xB1: ORr('C'),
    0xB2: ORr('D'),
    0xB3: ORr('E'),
    0xB4: ORr('H'),
    0xB5: ORr('L'),
    0xB6: OR_HL_,
    0xF6: ORn,
    0xAF: XORr('A'),
    0xA8: XORr('B'),
    0xA9: XORr('C'),
    0xAA: XORr('D'),
    0xAB: XORr('E'),
    0xAC: XORr('H'),
    0xAD: XORr('L'),
    0xAE: XOR_HL_,
    0xEE: XORn,
    0xBF: CPr('A'),
    0xB8: CPr('B'),
    0xB9: CPr('C'),
    0xBA: CPr('D'),
    0xBB: CPr('E'),
    0xBC: CPr('H'),
    0xBD: CPr('L'),
    0xBE: CP_HL_,
    0xFE: CPn,
    0x3C: INCr('A'),
    0x04: INCr('B'),
    0x0C: INCr('C'),
    0x14: INCr('D'),
    0x1C: INCr('E'),
    0x24: INCr('H'),
    0x2C: INCr('L'),
    0x34: INC_HL_,
    0x3D: DECr('A'),
    0x05: DECr('B'),
    0x0D: DECr('C'),
    0x15: DECr('D'),
    0x1D: DECr('E'),
    0x25: DECr('H'),
    0x2D: DECr('L'),
    0x35: DEC_HL_,
    0x09: ADDHLrr('BC'),
    0x19: ADDHLrr('DE'),
    0x29: ADDHLrr('HL'),
    0x39: ADDHLSP,
    0xE8: ADDSPn,
    0x03: INCrr('BC'),
    0x13: INCrr('DE'),
    0x23: INCrr('HL'),
    0x33: INCSP,
    0x0B: DECrr('BC'),
    0x1B: DECrr('DE'),
    0x2B: DECrr('HL'),
    0x3B: DECSP
  };
};
