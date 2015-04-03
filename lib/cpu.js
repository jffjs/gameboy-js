function CPU() {
  this.pc = 0; // 16-bit
  this.sp = 0; // 16-bit

  // 8-bits each
  this.register = {
    A: 0, F: 0,
    B: 0, C: 0,
    D: 0, E: 0,
    H: 0, L: 0,
    M: 0, T: 0
  };

  this.clock = { M: 0, T: 0};

  this.setFlag = function(flag) {
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

  this.resetFlag = function(flag) {
    switch(flag) {
      case 'Z':
        this.register.F &= 0x7F;
        break;
      case 'N':
        this.register.F &= 0xB0;
        break;
      case 'H':
        this.register.F &= 0xD0;
        break;
      case 'C':
        this.register.F &= 0xE0;
        break;
    }
  };
}

module.exports = CPU;
