/*
 * Jump, restart, and return opcodes
 */
module.exports = function(cpu, mmu) {
  function JPnn() {
    cpu.pc = mmu.read16(cpu.pc + 2);
    cpu.incrementPC = false;
    return 3;
  }

  return {
    0xC3: JPnn
  };
};
