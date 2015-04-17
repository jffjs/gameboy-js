/*
 * Misc opcodes
 */
module.exports = function(cpu, mmu) {
  function SWAPA() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    cpu.resetFlag('C');
    var tmp = cpu.register.A;
    cpu.register.A = (tmp & 0xF) << 4 | (tmp & 0xF0) >> 4;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    cpu.register.M = 2;
    cpu.register.T = 8;
  }

  return {
    0xCB37: SWAPA
  };
};
