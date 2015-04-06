/**
 * ALU opcodes
 */
function checkCarry(a, b) {
  return a + b > 0xFF;
}

function checkHalfCarry(a, b, c) {
  return (a & 0xF) + (b & 0xF) + (c ? c & 0xf : 0) > 0xF;
}

function checkBorrow(a, b) {
  return a - b < 0;
}

function checkHalfBorrow(a, b, c) {
  return (a & 0xF) - (b & 0xF) - (c ? c & 0xF : 0) < 0;
}

module.exports = function(cpu, mmu) {
  function ADDAr(r) {
    return function() {
      cpu.resetFlag('N');
      checkCarry(cpu.register.A, cpu.register[r]) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfCarry(cpu.register.A, cpu.register[r]) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A + cpu.register[r]) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      cpu.register.M = 1;
      cpu.register.T = 4;
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
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function ADDAn() {
    var n = mmu.read8(++cpu.pc);
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function ADCAr(r) {
    return function() {
      cpu.resetFlag('N');
      var carry = cpu.flag.C();
      checkCarry(cpu.register.A, cpu.register[r] + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfCarry(cpu.register.A, cpu.register[r], carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A + cpu.register[r] + carry) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      cpu.register.M = 1;
      cpu.register.T = 4;
    };
  }

  function ADCA_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var carry = cpu.flag.C();
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n + carry) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function ADCAn() {
    var n = mmu.read8(++cpu.pc);
    var carry = cpu.flag.C();
    cpu.resetFlag('N');
    checkCarry(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfCarry(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A + n + carry) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function SUBAr(r) {
    return function() {
      cpu.setFlag('N');
      checkBorrow(cpu.register.A, cpu.register[r]) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfBorrow((cpu.register.A & 0xF), (cpu.register[r] & 0xF)) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A - cpu.register[r]) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      cpu.register.M = 1;
      cpu.register.T = 4;
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
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function SUBAn() {
    var n = mmu.read8(++cpu.pc);
    cpu.setFlag('N');
    checkBorrow(cpu.register.A, n) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - n) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function SBCAr(r) {
    return function() {
      cpu.setFlag('N');
      var carry = cpu.flag.C();
      checkBorrow(cpu.register.A, cpu.register[r] + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
      checkHalfBorrow(cpu.register.A, cpu.register[r], carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
      cpu.register.A = (cpu.register.A - (cpu.register[r]  + carry)) & 0xFF;
      cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      cpu.register.M = 1;
      cpu.register.T = 4;
    };
  }

  function SBCA_HL_() {
    cpu.setFlag('N');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var carry = cpu.flag.C();
    checkBorrow(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - (n + carry)) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function SBCAn() {
    var n = mmu.read8(++cpu.pc);
    var carry = cpu.flag.C();
    cpu.setFlag('N');
    checkBorrow(cpu.register.A, n + carry) ? cpu.setFlag('C') : cpu.resetFlag('C');
    checkHalfBorrow(cpu.register.A, n, carry) ? cpu.setFlag('H') : cpu.resetFlag('H');
    cpu.register.A = (cpu.register.A - (n + carry)) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
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
    0xDE: SBCAn
  };
};
