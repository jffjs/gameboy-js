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

}

module.exports = CPU;
