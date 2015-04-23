/*
 * Jump, restart, and return opcodes
 */
module.exports = function(cpu, mmu) {
  function JPnn() {
    cpu.pc = mmu.read16(cpu.pc + 2);
    cpu.incrementPC = false;
    return 3;
  }

  function JPNcnn(c) {
    return function() {
      if (!cpu.testFlag(c)) {
        cpu.pc = mmu.read16(cpu.pc + 2);
        cpu.incrementPC = false;
      }
      return 3;
    };
  }

  function JPcnn(c) {
    return function() {
      if (cpu.testFlag(c)) {
        cpu.pc = mmu.read16(cpu.pc + 2);
        cpu.incrementPC = false;
      }
      return 3;
    };
  }

  return {
    0xC3: JPnn,
    0xC2: JPNcnn('Z'),
    0xCA: JPcnn('Z'),
    0xD2: JPNcnn('C'),
    0xDA: JPcnn('C')
  };
};
