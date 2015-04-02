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
    0x6E: LDr_HL_('L')
  };
};
