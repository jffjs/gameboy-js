/*
 * Bit opcodes
 */
module.exports = function(cpu, mmu) {
  function BITbr(b, r) {
    return function() {
      cpu.setFlag('H');
      cpu.resetFlag('N');
      var bit = (cpu.register[r] & (1 << b)) >> b;
      cpu.updateFlag('Z', bit === 0);
      return 2;
    };
  }

  function BITb_HL_(b) {
    return function() {
      cpu.setFlag('H');
      cpu.resetFlag('N');
      var addr = (cpu.register.H << 8) | cpu.register.L;
      var n = mmu.read8(addr);
      var bit = (n & (1 << b)) >> b;
      cpu.updateFlag('Z', bit === 0);
      return 4;
    };
  }

  function SETbr(b, r) {
    return function() {
      cpu.register[r] |= 1 << b;
      return 2;
    };
  }

  function SETb_HL_(b) {
    return function() {
      var addr = (cpu.register.H << 8) | cpu.register.L;
      var n = mmu.read8(addr);
      n |= 1 << b;
      mmu.write8(addr, n);
      return 4;
    };
  }

  function RESbr(b,r) {
    return function() {
      var mask =  ~(1 << b) & 0xFF;
      cpu.register[r] &= mask;
      return 2;
    };
  }

  function RESb_HL_(b) {
    return function() {
      var addr = (cpu.register.H << 8) | cpu.register.L;
      var n = mmu.read8(addr);
      var mask =  ~(1 << b) & 0xFF;
      n &= mask;
      mmu.write8(addr, n);
      return 4;
    };
  }

  return {
    0xCB47: BITbr(0, 'A'),
    0xCB40: BITbr(0, 'B'),
    0xCB41: BITbr(0, 'C'),
    0xCB42: BITbr(0, 'D'),
    0xCB43: BITbr(0, 'E'),
    0xCB44: BITbr(0, 'H'),
    0xCB45: BITbr(0, 'L'),
    0xCB46: BITb_HL_(0),
    0xCB4F: BITbr(1, 'A'),
    0xCB48: BITbr(1, 'B'),
    0xCB49: BITbr(1, 'C'),
    0xCB4A: BITbr(1, 'D'),
    0xCB4B: BITbr(1, 'E'),
    0xCB4C: BITbr(1, 'H'),
    0xCB4D: BITbr(1, 'L'),
    0xCB4E: BITb_HL_(1),
    0xCB57: BITbr(2, 'A'),
    0xCB50: BITbr(2, 'B'),
    0xCB51: BITbr(2, 'C'),
    0xCB52: BITbr(2, 'D'),
    0xCB53: BITbr(2, 'E'),
    0xCB54: BITbr(2, 'H'),
    0xCB55: BITbr(2, 'L'),
    0xCB56: BITb_HL_(2),
    0xCB5F: BITbr(3, 'A'),
    0xCB58: BITbr(3, 'B'),
    0xCB59: BITbr(3, 'C'),
    0xCB5A: BITbr(3, 'D'),
    0xCB5B: BITbr(3, 'E'),
    0xCB5C: BITbr(3, 'H'),
    0xCB5D: BITbr(3, 'L'),
    0xCB5E: BITb_HL_(3),
    0xCB67: BITbr(4, 'A'),
    0xCB60: BITbr(4, 'B'),
    0xCB61: BITbr(4, 'C'),
    0xCB62: BITbr(4, 'D'),
    0xCB63: BITbr(4, 'E'),
    0xCB64: BITbr(4, 'H'),
    0xCB65: BITbr(4, 'L'),
    0xCB66: BITb_HL_(4),
    0xCB6F: BITbr(5, 'A'),
    0xCB68: BITbr(5, 'B'),
    0xCB69: BITbr(5, 'C'),
    0xCB6A: BITbr(5, 'D'),
    0xCB6B: BITbr(5, 'E'),
    0xCB6C: BITbr(5, 'H'),
    0xCB6D: BITbr(5, 'L'),
    0xCB6E: BITb_HL_(5),
    0xCB77: BITbr(6, 'A'),
    0xCB70: BITbr(6, 'B'),
    0xCB71: BITbr(6, 'C'),
    0xCB72: BITbr(6, 'D'),
    0xCB73: BITbr(6, 'E'),
    0xCB74: BITbr(6, 'H'),
    0xCB75: BITbr(6, 'L'),
    0xCB76: BITb_HL_(6),
    0xCB7F: BITbr(7, 'A'),
    0xCB78: BITbr(7, 'B'),
    0xCB79: BITbr(7, 'C'),
    0xCB7A: BITbr(7, 'D'),
    0xCB7B: BITbr(7, 'E'),
    0xCB7C: BITbr(7, 'H'),
    0xCB7D: BITbr(7, 'L'),
    0xCB7E: BITb_HL_(7),
    0xCBC7: SETbr(0, 'A'),
    0xCBC0: SETbr(0, 'B'),
    0xCBC1: SETbr(0, 'C'),
    0xCBC2: SETbr(0, 'D'),
    0xCBC3: SETbr(0, 'E'),
    0xCBC4: SETbr(0, 'H'),
    0xCBC5: SETbr(0, 'L'),
    0xCBC6: SETb_HL_(0),
    0xCBCF: SETbr(1, 'A'),
    0xCBC8: SETbr(1, 'B'),
    0xCBC9: SETbr(1, 'C'),
    0xCBCA: SETbr(1, 'D'),
    0xCBCB: SETbr(1, 'E'),
    0xCBCC: SETbr(1, 'H'),
    0xCBCD: SETbr(1, 'L'),
    0xCBCE: SETb_HL_(1),
    0xCBD7: SETbr(2, 'A'),
    0xCBD0: SETbr(2, 'B'),
    0xCBD1: SETbr(2, 'C'),
    0xCBD2: SETbr(2, 'D'),
    0xCBD3: SETbr(2, 'E'),
    0xCBD4: SETbr(2, 'H'),
    0xCBD5: SETbr(2, 'L'),
    0xCBD6: SETb_HL_(2),
    0xCBDF: SETbr(3, 'A'),
    0xCBD8: SETbr(3, 'B'),
    0xCBD9: SETbr(3, 'C'),
    0xCBDA: SETbr(3, 'D'),
    0xCBDB: SETbr(3, 'E'),
    0xCBDC: SETbr(3, 'H'),
    0xCBDD: SETbr(3, 'L'),
    0xCBDE: SETb_HL_(3),
    0xCBE7: SETbr(4, 'A'),
    0xCBE0: SETbr(4, 'B'),
    0xCBE1: SETbr(4, 'C'),
    0xCBE2: SETbr(4, 'D'),
    0xCBE3: SETbr(4, 'E'),
    0xCBE4: SETbr(4, 'H'),
    0xCBE5: SETbr(4, 'L'),
    0xCBE6: SETb_HL_(4),
    0xCBEF: SETbr(5, 'A'),
    0xCBE8: SETbr(5, 'B'),
    0xCBE9: SETbr(5, 'C'),
    0xCBEA: SETbr(5, 'D'),
    0xCBEB: SETbr(5, 'E'),
    0xCBEC: SETbr(5, 'H'),
    0xCBED: SETbr(5, 'L'),
    0xCBEE: SETb_HL_(5),
    0xCBF7: SETbr(6, 'A'),
    0xCBF0: SETbr(6, 'B'),
    0xCBF1: SETbr(6, 'C'),
    0xCBF2: SETbr(6, 'D'),
    0xCBF3: SETbr(6, 'E'),
    0xCBF4: SETbr(6, 'H'),
    0xCBF5: SETbr(6, 'L'),
    0xCBF6: SETb_HL_(6),
    0xCBFF: SETbr(7, 'A'),
    0xCBF8: SETbr(7, 'B'),
    0xCBF9: SETbr(7, 'C'),
    0xCBFA: SETbr(7, 'D'),
    0xCBFB: SETbr(7, 'E'),
    0xCBFC: SETbr(7, 'H'),
    0xCBFD: SETbr(7, 'L'),
    0xCBFE: SETb_HL_(7),
    0xCB87: RESbr(0, 'A'),
    0xCB80: RESbr(0, 'B'),
    0xCB81: RESbr(0, 'C'),
    0xCB82: RESbr(0, 'D'),
    0xCB83: RESbr(0, 'E'),
    0xCB84: RESbr(0, 'H'),
    0xCB85: RESbr(0, 'L'),
    0xCB86: RESb_HL_(0),
    0xCB8F: RESbr(1, 'A'),
    0xCB88: RESbr(1, 'B'),
    0xCB89: RESbr(1, 'C'),
    0xCB8A: RESbr(1, 'D'),
    0xCB8B: RESbr(1, 'E'),
    0xCB8C: RESbr(1, 'H'),
    0xCB8D: RESbr(1, 'L'),
    0xCB8E: RESb_HL_(1),
    0xCB97: RESbr(2, 'A'),
    0xCB90: RESbr(2, 'B'),
    0xCB91: RESbr(2, 'C'),
    0xCB92: RESbr(2, 'D'),
    0xCB93: RESbr(2, 'E'),
    0xCB94: RESbr(2, 'H'),
    0xCB95: RESbr(2, 'L'),
    0xCB96: RESb_HL_(2),
    0xCB9F: RESbr(3, 'A'),
    0xCB98: RESbr(3, 'B'),
    0xCB99: RESbr(3, 'C'),
    0xCB9A: RESbr(3, 'D'),
    0xCB9B: RESbr(3, 'E'),
    0xCB9C: RESbr(3, 'H'),
    0xCB9D: RESbr(3, 'L'),
    0xCB9E: RESb_HL_(3),
    0xCBA7: RESbr(4, 'A'),
    0xCBA0: RESbr(4, 'B'),
    0xCBA1: RESbr(4, 'C'),
    0xCBA2: RESbr(4, 'D'),
    0xCBA3: RESbr(4, 'E'),
    0xCBA4: RESbr(4, 'H'),
    0xCBA5: RESbr(4, 'L'),
    0xCBA6: RESb_HL_(4),
    0xCBAF: RESbr(5, 'A'),
    0xCBA8: RESbr(5, 'B'),
    0xCBA9: RESbr(5, 'C'),
    0xCBAA: RESbr(5, 'D'),
    0xCBAB: RESbr(5, 'E'),
    0xCBAC: RESbr(5, 'H'),
    0xCBAD: RESbr(5, 'L'),
    0xCBAE: RESb_HL_(5),
    0xCBB7: RESbr(6, 'A'),
    0xCBB0: RESbr(6, 'B'),
    0xCBB1: RESbr(6, 'C'),
    0xCBB2: RESbr(6, 'D'),
    0xCBB3: RESbr(6, 'E'),
    0xCBB4: RESbr(6, 'H'),
    0xCBB5: RESbr(6, 'L'),
    0xCBB6: RESb_HL_(6),
    0xCBBF: RESbr(7, 'A'),
    0xCBB8: RESbr(7, 'B'),
    0xCBB9: RESbr(7, 'C'),
    0xCBBA: RESbr(7, 'D'),
    0xCBBB: RESbr(7, 'E'),
    0xCBBC: RESbr(7, 'H'),
    0xCBBD: RESbr(7, 'L'),
    0xCBBE: RESb_HL_(7)
  };
};
