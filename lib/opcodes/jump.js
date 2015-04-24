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

  function JP_HL_() {
    cpu.pc = (cpu.register.H << 8) | cpu.register.L;
    cpu.incrementPC = false;
    return 1;
  }

  function JRn() {
    var offset = mmu.read8(cpu.pc + 1);
    if ((offset & 0x80) >> 7) {
      offset = ((~offset + 1) & 0xFF) * -1;
    }
    cpu.pc = (cpu.pc + offset) & 0xFFFF;
    cpu.incrementPC = false;
    return 2;
  }

  function JRNcn(c) {
    return function() {
      var offset = mmu.read8(++cpu.pc);
      if (!cpu.testFlag(c)) {
        if ((offset & 0x80) >> 7) {
          offset = ((~offset + 1) & 0xFF) * -1;
        }
        cpu.pc = (--cpu.pc + offset) & 0xFFFF;
        cpu.incrementPC = false;
      }
      return 2;
    };
  }

  function JRcn(c) {
    return function() {
      var offset = mmu.read8(++cpu.pc);
      if (cpu.testFlag(c)) {
        if ((offset & 0x80) >> 7) {
          offset = ((~offset + 1) & 0xFF) * -1;
        }
        cpu.pc = (--cpu.pc + offset) & 0xFFFF;
        cpu.incrementPC = false;
      }
      return 2;
    };
  }

  function CALLnn() {
    var addr = mmu.read16(cpu.pc + 2);
    cpu.sp -= 2;
    mmu.write16(cpu.sp, cpu.pc + 3);
    cpu.pc = addr;
    cpu.incrementPC = false;
    return 3;
  }

  function CALLNcnn(c) {
    return function() {
      cpu.pc +=2;
      if (!cpu.testFlag(c)) {
        var addr = mmu.read16(cpu.pc);
        cpu.sp -= 2;
        mmu.write16(cpu.sp, cpu.pc + 1);
        cpu.pc = addr;
        cpu.incrementPC = false;
      }
      return 3;
    };
  }

  function CALLcnn(c) {
    return function() {
      cpu.pc +=2;
      if (cpu.testFlag(c)) {
        var addr = mmu.read16(cpu.pc);
        cpu.sp -= 2;
        mmu.write16(cpu.sp, cpu.pc + 1);
        cpu.pc = addr;
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
    0xDA: JPcnn('C'),
    0xE9: JP_HL_,
    0x18: JRn,
    0x20: JRNcn('Z'),
    0x28: JRcn('Z'),
    0x30: JRNcn('C'),
    0x38: JRcn('C'),
    0xCD: CALLnn,
    0xC4: CALLNcnn('Z'),
    0xCC: CALLcnn('Z'),
    0xD4: CALLNcnn('C'),
    0xDC: CALLcnn('C')
  };
};
