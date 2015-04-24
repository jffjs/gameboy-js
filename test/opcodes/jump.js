/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var CPU = require('../../lib/cpu');
var MMU = require('../../lib/mmu');
var jump = require('../../lib/opcodes/jump');

describe("Jump opcodes", function() {
  var cpu, mockMMU, ops;

  beforeEach(function() {
    cpu = new CPU();
    var mmu = new MMU();
    mockMMU = sinon.mock(mmu);
    ops = jump(cpu, mmu);
    cpu.pc = 0x200;
  });

  describe("JP nn", function() {
    it("jumps to 16-bit immediate value nn", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xC3]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xC3]()).to.equal(3);
    });
  });

  describe("JP NZ,nn", function() {
    it("jumps to 16-bit immediate value nn if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xC2]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xC2]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xC2]()).to.equal(3);
    });
  });

  describe("JP Z,nn", function() {
    it("jumps to 16-bit immediate value nn if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xCA]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xCA]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xCA]()).to.equal(3);
    });
  });
  
  describe("JP NC,nn", function() {
    it("jumps to 16-bit immediate value nn if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xD2]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xD2]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xD2]()).to.equal(3);
    });
  });

  describe("JP C,nn", function() {
    it("jumps to 16-bit immediate value nn if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xDA]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0x34AB);
      ops[0xDA]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xDA]()).to.equal(3);
    });
  });

  describe("JP (HL)", function() {
    beforeEach(function() {
      cpu.register.H = 0x34;
      cpu.register.L = 0xAB;
    });

    it("jumps to address in HL", function() {
      ops[0xE9]();
      expect(cpu.pc).to.equal(0x34AB);
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 1 machine cycle", function() {
      expect(ops[0xE9]()).to.equal(1);
    });
  });

  describe("JR n", function() {
    it("jumps to current address plus 8-bit signed immediate value n", function() {
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x18]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x20A);
      expect(cpu.incrementPC).to.be.false;
    });

    it("jumps to current address plus 8-bit signed immediate value n (negative n)", function() {
      mockMMU.expects('read8').once().withArgs(0x201).returns(0xFE);
      ops[0x18]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x1FE);
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x18]()).to.equal(2);
    });
  });

  describe("JR NZ,n", function() {
    it("jumps to current address plus 8-bit signed immediate value n if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x20]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x20A);
      expect(cpu.incrementPC).to.be.false;
    });

    it("jumps to current address plus 8-bit signed immediate value n is 0 (negative n)", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0xFE);
      ops[0x20]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x1FE);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x20]();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x20]()).to.equal(2);
    });
  });

  describe("JR Z,n", function() {
    it("jumps to current address plus 8-bit signed immediate value n if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x28]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x20A);
      expect(cpu.incrementPC).to.be.false;
    });

    it("jumps to current address plus 8-bit signed immediate value n is 1 (negative n)", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0xFE);
      ops[0x28]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x1FE);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x28]();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x28]()).to.equal(2);
    });
  });

  describe("JR NC,n", function() {
    it("jumps to current address plus 8-bit signed immediate value n if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x30]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x20A);
      expect(cpu.incrementPC).to.be.false;
    });

    it("jumps to current address plus 8-bit signed immediate value n is 0 (negative n)", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0xFE);
      ops[0x30]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x1FE);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x30]();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x30]()).to.equal(2);
    });
  });

  describe("JR C,n", function() {
    it("jumps to current address plus 8-bit signed immediate value n if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x38]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x20A);
      expect(cpu.incrementPC).to.be.false;
    });

    it("jumps to current address plus 8-bit signed immediate value n is 1 (negative n)", function() {
      cpu.setFlag('C');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0xFE);
      ops[0x38]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0x1FE);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not jump if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read8').once().withArgs(0x201).returns(0x0A);
      ops[0x38]();
      expect(cpu.pc).to.equal(0x201);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0x38]()).to.equal(2);
    });
  });

  describe("CALL nn", function() {
    beforeEach(function() {
      cpu.sp = 0xFFF0;
    });

    it("pushes address of next instruction onto stack and jumps to 16-bit immediate address nn", function() {
      mockMMU.expects('read16').once().withArgs(0x202).returns(0xABCD);
      mockMMU.expects('write16').once().withArgs(0xFFEE, 0x203);
      ops[0xCD]();
      mockMMU.verify();
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xCD]()).to.equal(3);
    });
  });

  describe("CALL NZ,nn", function() {
    beforeEach(function() {
      cpu.sp = 0xFFF0;
    });

    it("pushes address of next instruction onto stack and jumps to 16-bit immediate address nn if Z flag is 0", function() {
      cpu.resetFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0xABCD);
      mockMMU.expects('write16').once().withArgs(0xFFEE, 0x203);
      ops[0xC4]();
      mockMMU.verify();
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not call if Z flag is 1", function() {
      cpu.setFlag('Z');
      ops[0xC4]();
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xC4]()).to.equal(3);
    });
  });

  describe("CALL Z,nn", function() {
    beforeEach(function() {
      cpu.sp = 0xFFF0;
    });

    it("pushes address of next instruction onto stack and jumps to 16-bit immediate address nn if Z flag is 1", function() {
      cpu.setFlag('Z');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0xABCD);
      mockMMU.expects('write16').once().withArgs(0xFFEE, 0x203);
      ops[0xCC]();
      mockMMU.verify();
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not call if Z flag is 0", function() {
      cpu.resetFlag('Z');
      ops[0xCC]();
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xCC]()).to.equal(3);
    });
  });

  describe("CALL NC,nn", function() {
    beforeEach(function() {
      cpu.sp = 0xFFF0;
    });

    it("pushes address of next instruction onto stack and jumps to 16-bit immediate address nn if C flag is 0", function() {
      cpu.resetFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0xABCD);
      mockMMU.expects('write16').once().withArgs(0xFFEE, 0x203);
      ops[0xD4]();
      mockMMU.verify();
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not call if C flag is 1", function() {
      cpu.setFlag('C');
      ops[0xD4]();
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xD4]()).to.equal(3);
    });
  });

  describe("CALL C,nn", function() {
    beforeEach(function() {
      cpu.sp = 0xFFF0;
    });

    it("pushes address of next instruction onto stack and jumps to 16-bit immediate address nn if C flag is 1", function() {
      cpu.setFlag('C');
      mockMMU.expects('read16').once().withArgs(0x202).returns(0xABCD);
      mockMMU.expects('write16').once().withArgs(0xFFEE, 0x203);
      ops[0xDC]();
      mockMMU.verify();
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not call if C flag is 0", function() {
      cpu.resetFlag('C');
      ops[0xDC]();
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.pc).to.equal(0x202);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 3 machine cycles", function() {
      expect(ops[0xDC]()).to.equal(3);
    });
  });

  [
    { p: 0x00, op: 0xC7 },
    { p: 0x08, op: 0xCF },
    { p: 0x10, op: 0xD7 },
    { p: 0x18, op: 0xDF },
    { p: 0x20, op: 0xE7 },
    { p: 0x28, op: 0xEF },
    { p: 0x30, op: 0xF7 },
    { p: 0x38, op: 0xFF }
  ].forEach(function(test) {
    describe("RST " + test.p.toString(16) + "h", function() {
      it("pushes current address onto stack and jumps to 0x00" + test.p.toString(16), function() {
        mockMMU.expects('write16').once().withArgs(0xFFEE, 0x201);
        cpu.sp = 0xFFF0;
        ops[test.op]();
        mockMMU.verify();
        expect(cpu.pc).to.equal(test.p);
        expect(cpu.incrementPC).to.be.false;
      });

      it("takes 8 machine cycles", function() {
        expect(ops[test.op]()).to.equal(8);
      });
    });
  });

  describe("RET", function() {
    it("pops two bytes from stack and jumps to that address", function() {
      mockMMU.expects('read16').once().withArgs(0xFFF0).returns(0xABCD);
      cpu.sp = 0xFFEE;
      ops[0xC9]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.incrementPC).to.be.false;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xC9]()).to.equal(2);
    });
  });

  describe("RET NZ", function() {
    it("pops two bytes from stack and jumps to that address if Z flag is 0", function() {
      mockMMU.expects('read16').once().withArgs(0xFFF0).returns(0xABCD);
      cpu.resetFlag('Z');
      cpu.sp = 0xFFEE;
      ops[0xC0]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not return if Z flag is 1", function() {
      cpu.sp = 0xFFEE;
      cpu.setFlag('Z');
      ops[0xC0]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xC0]()).to.equal(2);
    });
  });

  describe("RET Z", function() {
    it("pops two bytes from stack and jumps to that address if Z flag is 1", function() {
      mockMMU.expects('read16').once().withArgs(0xFFF0).returns(0xABCD);
      cpu.setFlag('Z');
      cpu.sp = 0xFFEE;
      ops[0xC8]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not return if Z flag is 0", function() {
      cpu.sp = 0xFFEE;
      cpu.resetFlag('Z');
      ops[0xC8]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xC8]()).to.equal(2);
    });
  });

  describe("RET NC", function() {
    it("pops two bytes from stack and jumps to that address if C flag is 0", function() {
      mockMMU.expects('read16').once().withArgs(0xFFF0).returns(0xABCD);
      cpu.resetFlag('C');
      cpu.sp = 0xFFEE;
      ops[0xD0]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not return if C flag is 1", function() {
      cpu.sp = 0xFFEE;
      cpu.setFlag('C');
      ops[0xD0]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xD0]()).to.equal(2);
    });
  });

  describe("RET C", function() {
    it("pops two bytes from stack and jumps to that address if C flag is 1", function() {
      mockMMU.expects('read16').once().withArgs(0xFFF0).returns(0xABCD);
      cpu.setFlag('C');
      cpu.sp = 0xFFEE;
      ops[0xD8]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.incrementPC).to.be.false;
    });

    it("does not return if C flag is 0", function() {
      cpu.sp = 0xFFEE;
      cpu.resetFlag('C');
      ops[0xD8]();
      expect(cpu.pc).to.equal(0x200);
      expect(cpu.sp).to.equal(0xFFEE);
      expect(cpu.incrementPC).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xD8]()).to.equal(2);
    });
  });

  describe("RETI", function() {
    it("returns and enables interrupts", function() {
      mockMMU.expects('read16').once().withArgs(0xFFF0).returns(0xABCD);
      cpu.setFlag('C');
      cpu.sp = 0xFFEE;
      ops[0xD9]();
      mockMMU.verify();
      expect(cpu.pc).to.equal(0xABCD);
      expect(cpu.sp).to.equal(0xFFF0);
      expect(cpu.incrementPC).to.be.false;
      expect(cpu.enableInterrupts).to.be.true;
    });

    it("takes 2 machine cycles", function() {
      expect(ops[0xD9]()).to.equal(2);
    });
  });
});
