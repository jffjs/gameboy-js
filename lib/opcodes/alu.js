/**
 * ALU opcodes
 */
function checkCarry(a, b) {
  return a + b > 0xFF;
}

function checkHalfCarry(a, b, c) {
  return (a & 0xF) + (b & 0xF) + (c ? c & 0xf : 0) > 0xF;
}

module.exports = function(cpu, mmu) {
  function ADDAr(r) {
    return function() {
      cpu.resetFlag('N');
      if (checkCarry(cpu.register.A, cpu.register[r])) {
        cpu.setFlag('C');
      }
      if (checkHalfCarry(cpu.register.A, cpu.register[r])) {
        cpu.setFlag('H');
      }
      cpu.register.A = (cpu.register.A + cpu.register[r]) & 0xFF;
      if(cpu.register.A === 0) {
        cpu.setFlag('Z');
      }
      cpu.register.M = 1;
      cpu.register.T = 4;
    };
  }

  function ADDA_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    cpu.resetFlag('N');
    if (checkCarry(cpu.register.A, n)) {
      cpu.setFlag('C');
    }
    if (checkHalfCarry(cpu.register.A, n)) {
      cpu.setFlag('H');
    }
    cpu.register.A = (cpu.register.A + n) & 0xFF;
    if(cpu.register.A === 0) {
      cpu.setFlag('Z');
    }
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function ADDAn() {
    var n = mmu.read8(++cpu.pc);
    cpu.resetFlag('N');
    if (checkCarry(cpu.register.A, n)) {
      cpu.setFlag('C');
    }
    if (checkHalfCarry(cpu.register.A, n)) {
      cpu.setFlag('H');
    }
    cpu.register.A = (cpu.register.A + n) & 0xFF;
    if(cpu.register.A === 0) {
      cpu.setFlag('Z');
    }
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function ADCAr(r) {
    return function() {
      cpu.resetFlag('N');
      if (checkCarry(cpu.register.A, cpu.register[r] + cpu.flag.C())) {
        cpu.setFlag('C');
      }
      if (checkHalfCarry(cpu.register.A, cpu.register[r], cpu.flag.C())) {
        cpu.setFlag('H');
      }
      cpu.register.A = (cpu.register.A + cpu.register[r] + cpu.flag.C()) & 0xFF;
      if(cpu.register.A === 0) {
        cpu.setFlag('Z');
      }
      cpu.register.M = 1;
      cpu.register.T = 4;
    };
  }

  function ADCA_HL_() {
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    cpu.resetFlag('N');
    if (checkCarry(cpu.register.A, n + cpu.flag.C())) {
      cpu.setFlag('C');
    }
    if (checkHalfCarry(cpu.register.A, n, cpu.flag.C())) {
      cpu.setFlag('H');
    }
    cpu.register.A = (cpu.register.A + n + cpu.flag.C()) & 0xFF;
    if(cpu.register.A === 0) {
      cpu.setFlag('Z');
    }
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  function ADCAn() {
    var n = mmu.read8(++cpu.pc);
    cpu.resetFlag('N');
    if (checkCarry(cpu.register.A, n + cpu.flag.C())) {
      cpu.setFlag('C');
    }
    if (checkHalfCarry(cpu.register.A, n, cpu.flag.C())) {
      cpu.setFlag('H');
    }
    cpu.register.A = (cpu.register.A + n + cpu.flag.C()) & 0xFF;
    if(cpu.register.A === 0) {
      cpu.setFlag('Z');
    }
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
    0xCE: ADCAn
  };
};
