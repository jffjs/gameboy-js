/*global module require */

var extend = require('object-assign'),
    alu    = require('./opcodes/alu'),
    bit    = require('./opcodes/bit'),
    jump   = require('./opcodes/jump'),
    load   = require('./opcodes/load'),
    misc   = require('./opcodes/misc'),
    shift  = require('./opcodes/shift');

module.exports = CPU;

function CPU(mmu) {
  this.mmu = mmu;
  this.instructions = extend(alu(this, mmu),
                             bit(this, mmu),
                             jump(this, mmu),
                             load(this, mmu),
                             misc(this, mmu),
                             shift(this, mmu));
  this.reset();
}

CPU.prototype.reset = function() {
  this.pc = 0; // 16-bit
  this.sp = 0; // 16-bit
  this.enableInterrupts = false;
  this.incrementPC = true;

  // 8-bits each
  this.register = {
    A: 0, F: 0,
    B: 0, C: 0,
    D: 0, E: 0,
    H: 0, L: 0
  };

  this.clock = { M: 0, T: 0 };
};

CPU.prototype.execute = function() {
  this.incrementPC = true;
  var op = this.mmu.read8(this.pc);
  if (op === 0xCB) {
    op = (op << 8) | this.mmu.read8(++this.pc);
  }
  var m = this.instructions[op]();
  // if (this.incrementPC) {
    this.pc++;
  // }

  if (this.pc >= 0x100 && this.mmu.inBIOS) {
    this.mmu.inBIOS = false;
  }

  var t = m * 4;
  this.clock.M += m;
  this.clock.T += t;
  return t;
};

CPU.prototype.testFlag = function(flag) {
  switch(flag) {
    case 'Z':
      return (this.register.F & 0x80) >> 7;
    case 'N':
      return (this.register.F & 0x40) >> 6;
    case 'H':
      return (this.register.F & 0x20) >> 5;
    case 'C':
      return (this.register.F & 0x10) >> 4;
    default:
      return 0;
  }
};

CPU.prototype.setFlag = function(flag) {
  switch(flag) {
    case 'Z':
      this.register.F |= 0x80;
      break;
    case 'N':
      this.register.F |= 0x40;
      break;
    case 'H':
      this.register.F |= 0x20;
      break;
    case 'C':
      this.register.F |= 0x10;
      break;
  }
};

CPU.prototype.resetFlag = function(flag) {
  switch(flag) {
    case 'Z':
      this.register.F &= 0x7F;
      break;
    case 'N':
      this.register.F &= 0xBF;
      break;
    case 'H':
      this.register.F &= 0xDF;
      break;
    case 'C':
      this.register.F &= 0xEF;
      break;
  }
};

CPU.prototype.updateFlag = function(flag, setOrReset) {
  setOrReset ? this.setFlag(flag) : this.resetFlag(flag);
};
