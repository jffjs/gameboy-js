/*
 * Bitwise opcodes
 */
module.exports = function(cpu, mmu) {
  // TODO: Z80 manual says these operations do not effect Z flag. Try removing if problems occur.

  function RLC(r) {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var msb = (cpu.register[r] & 0x80) >> 7;
    cpu.updateFlag('C', msb);
    cpu.register[r] = ((cpu.register[r] << 1) & 0xFF) | msb;
    cpu.updateFlag('Z', cpu.register[r] === 0);
  };

  function RLCA() {
    RLC('A');
    return 1;
  }

  function RLCr(r) {
    return function() {
      RLC(r);
      return 2;
    };
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

  function RRCA() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var lsb = cpu.register.A & 1;
    cpu.updateFlag('C', lsb);
    cpu.register.A = ((cpu.register.A >> 1) & 0xFF) | (lsb << 7);
    cpu.updateFlag('Z', cpu.register.A === 0);
    return 1;
  }

  function RRA() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var lsb = cpu.register.A & 1;
    var c = cpu.checkFlag('C');
    cpu.updateFlag('C', lsb);
    cpu.register.A = ((cpu.register.A >> 1) & 0xFF) | (c << 7);
    cpu.updateFlag('Z', cpu.register.A === 0);
    return 1;
  }

  function RLC_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var msb = (n & 0x80) >> 7;
    cpu.updateFlag('C', msb);
    n = ((n << 1) & 0xFF) | msb;
    mmu.write8(addr, n);
    cpu.updateFlag('Z', n === 0);
    return 4;
  }

  return {
    0x07: RLCA,
    0x17: RLA,
    0x0F: RRCA,
    0x1F: RRA,
    0xCB07: RLCr('A'),
    0xCB00: RLCr('B'),
    0xCB01: RLCr('C'),
    0xCB02: RLCr('D'),
    0xCB03: RLCr('E'),
    0xCB04: RLCr('H'),
    0xCB05: RLCr('L'),
    0xCB06: RLC_HL_
  };
};
