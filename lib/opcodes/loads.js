/*
 * Load opcodes
 */
module.exports = function(cpu, mmu) {
  function LDrn(r) {
    return function() {
      cpu.registers[r] = mmu.read8(mmu.read8(++cpu.pc));
      cpu.registers.M = 2;
      cpu.registers.T = 8;
    };
  }

  function LDr1r2(r1, r2) {
    return function() {
      cpu.registers[r1] = cpu.registers[r2];
      cpu.registers.M = 1;
      cpu.registers.T = 4;
    };
  }

  function LDr_HL_(r) {
    return function() {
      var addr = (cpu.registers.H << 8) | cpu.registers.L;
      cpu.registers[r] = mmu.read8(addr);
      cpu.registers.M = 2;
      cpu.registers.T = 8;
    };
  }

  return {
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
    0x7E: LDr_HL_('A')
  };
};
