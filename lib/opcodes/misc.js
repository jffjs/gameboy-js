/*
 * Misc opcodes
 */
module.exports = function(cpu, mmu) {
  function SWAPr(r) {
    return function() {
      cpu.resetFlag('N');
      cpu.resetFlag('H');
      cpu.resetFlag('C');
      cpu.register[r] = (cpu.register[r] & 0xF) << 4 | (cpu.register[r] & 0xF0) >> 4;
      cpu.register[r] === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
      return 2;
    };
  }

  function SWAP_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    cpu.resetFlag('C');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    n = (n & 0xF) << 4 | (n & 0xF0) >> 4;
    n === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    mmu.write8(addr, n);
    return 4;
  }

  function DAA() {
    var u = (cpu.register.A & 0xF0) >> 4;
    var l = (cpu.register.A & 0xF);
    var adjust = 0;
    if (cpu.flag.N() === 0) {      // N == 0
      if (cpu.flag.C() === 0) {    // C == 0
        if (cpu.flag.H() === 0) {  // H == 0
          if (u < 9 && l > 9) {
            adjust = 0x06;
          } else if (u > 9 && l < 0xA) {
            adjust = 0x60;
            cpu.setFlag('C');
          } else if (u > 8 && l > 9) {
            adjust = 0x66;
            cpu.setFlag('C');
          }
        } else {                   // H == 1
          if (u < 0xA && l < 4) {
            adjust = 0x06;
          } else if (u > 9 && l < 4) {
            adjust = 0x66;
            cpu.setFlag('C');
          }
        }
      } else {                     // C == 1
        if (cpu.flag.H() === 0) {  // H == 0
          if (u < 3 && l < 0xA) {
            adjust = 0x60;
          } else if (u < 3 && l > 9) {
            adjust = 0x66;
          }
        } else {                   // H == 1
          if (u < 4 && l < 4) {
            adjust = 0x66;
          }
        }
      }
    } else {
      if (cpu.flag.C() === 0) {
        if (cpu.flag.H() === 1 && u < 9 && l > 5) {
          adjust = 0xFA;
        }
      } else {
        if(cpu.flag.H() === 0 && u > 6 && l < 0xA) {
          adjust = 0xA0;
          cpu.setFlag('C');
        } else if (cpu.flag.H() === 1 && u > 5 && u < 8 && l > 5) {
          adjust = 0x9A;
          cpu.setFlag('C');
        }
      }
    }
    cpu.register.A = (cpu.register.A + adjust) & 0xFF;
    cpu.register.A === 0 ? cpu.setFlag('Z') : cpu.resetFlag('Z');
    return 1;
  }

  return {
    0xCB37: SWAPr('A'),
    0xCB30: SWAPr('B'),
    0xCB31: SWAPr('C'),
    0xCB32: SWAPr('D'),
    0xCB33: SWAPr('E'),
    0xCB34: SWAPr('H'),
    0xCB35: SWAPr('L'),
    0xCB36: SWAP_HL_,
    0x27: DAA
  };
};
