/*
 * Bitwise opcodes
 */
module.exports = function(cpu, mmu) {
  function RLCA() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var msb = (cpu.register.A & 0x80) >> 7;
    cpu.updateFlag('C', msb);
    cpu.register.A = ((cpu.register.A << 1) & 0xFF) | msb;
    cpu.updateFlag('Z', cpu.register.A === 0);
    return 1;
  }

  function RLA() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var msb = (cpu.register.A & 0x80) >> 7;
    var c = cpu.checkFlag('C');
    cpu.updateFlag('C', msb);
    cpu.register.A = ((cpu.register.A << 1) & 0xFF) | c;
    cpu.updateFlag('Z', cpu.register.A === 0);
    return 1;
  }

  return {
    0x07: RLCA,
    0x17: RLA
  };
};
