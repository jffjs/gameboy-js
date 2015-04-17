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
      cpu.register.M = 2;
      cpu.register.T = 8;
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
    cpu.register.M = 4;
    cpu.register.T = 16;
  }

  // DAA
  // function() {
  //   var a=Z80._r.a;
  //   if ((Z80._r.f&0x20) || ((Z80._r.a&15)>9)) {   if H set or A & 0xF > 9
  //     Z80._r.a+=6;                                   add 6 to A
  //   }
  //   Z80._r.f&=0xEF;                               reset C flag
  //   if ((Z80._r.f&0x20)||(a>0x99)) {              if H set or A > 0x99
  //     Z80._r.a+=0x60;                                add 0x60 to A
  //     Z80._r.f|=0x10;                                set C flag
  //   }
  //   Z80._r.m=1;                                   1 machine cycle
  // }

  return {
    0xCB37: SWAPr('A'),
    0xCB30: SWAPr('B'),
    0xCB31: SWAPr('C'),
    0xCB32: SWAPr('D'),
    0xCB33: SWAPr('E'),
    0xCB34: SWAPr('H'),
    0xCB35: SWAPr('L'),
    0xCB36: SWAP_HL_
  };
};
