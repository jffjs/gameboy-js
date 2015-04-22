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

  function RL(r) {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var msb = (cpu.register[r] & 0x80) >> 7;
    var c = cpu.checkFlag('C');
    cpu.updateFlag('C', msb);
    cpu.register[r] = ((cpu.register[r] << 1) & 0xFF) | c;
    cpu.updateFlag('Z', cpu.register[r] === 0);
  }

  function RLA() {
    RL('A');
    return 1;
  }

  function RLr(r) {
    return function() {
      RL(r);
      return 2;
    };
  }

  function RRC(r) {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var lsb = cpu.register[r] & 1;
    cpu.updateFlag('C', lsb);
    cpu.register[r] = ((cpu.register[r] >> 1) & 0xFF) | (lsb << 7);
    cpu.updateFlag('Z', cpu.register[r] === 0);
  }

  function RRCA() {
    RRC('A');
    return 1;
  }

  function RRCr(r) {
    return function() {
      RRC(r);
      return 2;
    };
  }

  function RR(r) {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var lsb = cpu.register[r] & 1;
    var c = cpu.checkFlag('C');
    cpu.updateFlag('C', lsb);
    cpu.register[r] = ((cpu.register[r] >> 1) & 0xFF) | (c << 7);
    cpu.updateFlag('Z', cpu.register[r] === 0);
  }

  function RRA() {
    RR('A');
    return 1;
  }

  function RRr(r) {
    return function() {
      RR(r);
      return 2;
    };
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

  function RL_HL() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var c = cpu.checkFlag('C');
    var msb = (n & 0x80) >> 7;
    cpu.updateFlag('C', msb);
    n = ((n << 1) & 0xFF) | c;
    mmu.write8(addr, n);
    cpu.updateFlag('Z', n === 0);
    return 4;
  }

  function RRC_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var lsb = n & 1;
    cpu.updateFlag('C', lsb);
    n = ((n >> 1) & 0xFF) | (lsb << 7);
    mmu.write8(addr, n);
    cpu.updateFlag('Z', n === 0);
    return 4;
  }

  function RR_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var c = cpu.checkFlag('C');
    var lsb = n & 1;
    cpu.updateFlag('C', lsb);
    n = ((n >> 1) & 0xFF) | c;
    mmu.write8(addr, n);
    cpu.updateFlag('Z', n === 0);
    return 4;
  }

  function SLAr(r) {
    return function() {
      cpu.resetFlag('N');
      cpu.resetFlag('H');
      var msb = (cpu.register[r] & 0x80) >> 7;
      cpu.updateFlag('C', msb);
      cpu.register[r] = (cpu.register[r] << 1) & 0xFF;
      cpu.updateFlag('Z', cpu.register[r] === 0);
      return 2;
    };
  }

  function SLA_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var msb = (n & 0x80) >> 7;
    cpu.updateFlag('C', msb);
    n = (n << 1) & 0xFF;
    mmu.write8(addr, n);
    cpu.updateFlag('Z', n === 0);
    return 4;
  }

  function SRAr(r) {
    return function() {
      cpu.resetFlag('N');
      cpu.resetFlag('H');
      var msb = cpu.register[r] & 0x80;
      var lsb = cpu.register[r] & 1;
      cpu.updateFlag('C', lsb);
      cpu.register[r] = ((cpu.register[r] >> 1) & 0xFF) | msb;
      cpu.updateFlag('Z', cpu.register[r] === 0);
      return 2;
    };
  }

  function SRA_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var msb = n & 0x80;
    var lsb = n & 1;
    cpu.updateFlag('C', lsb);
    n = ((n >> 1) & 0xFF) | msb;
    mmu.write8(addr, n);
    cpu.updateFlag('Z', n === 0);
    return 4;
  }

  function SRLr(r) {
    return function() {
      cpu.resetFlag('N');
      cpu.resetFlag('H');
      var lsb = cpu.register[r] & 1;
      cpu.updateFlag('C', lsb);
      cpu.register[r] = (cpu.register[r] >> 1) & 0xFF;
      cpu.updateFlag('Z', cpu.register[r] === 0);
      return 2;
    };
  }

  function SRL_HL_() {
    cpu.resetFlag('N');
    cpu.resetFlag('H');
    var addr = (cpu.register.H << 8) | cpu.register.L;
    var n = mmu.read8(addr);
    var lsb = n & 1;
    cpu.updateFlag('C', lsb);
    n = (n >> 1) & 0xFF;
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
    0xCB06: RLC_HL_,
    0xCB17: RLr('A'),
    0xCB10: RLr('B'),
    0xCB11: RLr('C'),
    0xCB12: RLr('D'),
    0xCB13: RLr('E'),
    0xCB14: RLr('H'),
    0xCB15: RLr('L'),
    0xCB16: RL_HL,
    0xCB0F: RRCr('A'),
    0xCB08: RRCr('B'),
    0xCB09: RRCr('C'),
    0xCB0A: RRCr('D'),
    0xCB0B: RRCr('E'),
    0xCB0C: RRCr('H'),
    0xCB0D: RRCr('L'),
    0xCB0E: RRC_HL_,
    0xCB1F: RRr('A'),
    0xCB18: RRr('B'),
    0xCB19: RRr('C'),
    0xCB1A: RRr('D'),
    0xCB1B: RRr('E'),
    0xCB1C: RRr('H'),
    0xCB1D: RRr('L'),
    0xCB1E: RR_HL_,
    0xCB27: SLAr('A'),
    0xCB20: SLAr('B'),
    0xCB21: SLAr('C'),
    0xCB22: SLAr('D'),
    0xCB23: SLAr('E'),
    0xCB24: SLAr('H'),
    0xCB25: SLAr('L'),
    0xCB26: SLA_HL_,
    0xCB2F: SRAr('A'),
    0xCB28: SRAr('B'),
    0xCB29: SRAr('C'),
    0xCB2A: SRAr('D'),
    0xCB2B: SRAr('E'),
    0xCB2C: SRAr('H'),
    0xCB2D: SRAr('L'),
    0xCB2E: SRA_HL_,
    0xCB3F: SRLr('A'),
    0xCB38: SRLr('B'),
    0xCB39: SRLr('C'),
    0xCB3A: SRLr('D'),
    0xCB3B: SRLr('E'),
    0xCB3C: SRLr('H'),
    0xCB3D: SRLr('L'),
    0xCB3E: SRL_HL_
  };
};
