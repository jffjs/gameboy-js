/**
 * ALU opcodes
 */
module.exports = function(cpu, mmu) {
  function ADDAr(r) {
    return function() {
      cpu.resetFlag('N');
      if (cpu.register.A + cpu.register[r] > 0xFF) {
        cpu.setFlag('C');
      }
      if ((cpu.register.A & 0xF) + (cpu.register[r] & 0xF) > 0xF) {
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

  return {
    0x87: ADDAr('A'),
    0x80: ADDAr('B'),
    0x81: ADDAr('C'),
    0x82: ADDAr('D'),
    0x83: ADDAr('E'),
    0x84: ADDAr('H'),
    0x85: ADDAr('L')
  };
};
