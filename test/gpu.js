/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var GPU = require('../lib/gpu');

describe("GPU", function() {
  var gpu;

  beforeEach(function() {
    gpu = new GPU();
  });

  describe("execute", function() {
    it("increments clock by t", function() {
      gpu.clock = 2;
      gpu.execute(8);
      expect(gpu.clock).to.equal(10);
    });

    describe("mode 0", function() {
      beforeEach(function() {
        gpu.mode = 0;
        gpu.line = 10;
        gpu.clock = 200;
      });

      it("resets clock at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.clock).to.equal(0);
      });

      it("increments line number at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.line).to.equal(11);
      });

      it("switches to mode 2 at 204 ticks", function() {
        gpu.execute(4);
        expect(gpu.mode).to.equal(2);
      });

      it("switches to mode 1 after 143 lines", function () {
        gpu.line = 142;
        gpu.execute(4);
        expect(gpu.mode).to.equal(1);
      });
    });

    describe("mode 1", function() {
      beforeEach(function() {
        gpu.mode = 1;
        gpu.line = 144;
        gpu.clock = 453;
      });

      it("resets clock at 456 ticks", function() {
        gpu.execute(4);
        expect(gpu.clock).to.equal(0);
      });

      it("increments line number at 456 ticks", function() {
        gpu.execute(4);
        expect(gpu.line).to.equal(145);
      });

      it("switches to mode 2 at 456 ticks after 10 lines", function() {
        gpu.line = 153;
        gpu.execute(4);
        expect(gpu.mode).to.equal(2);
      });

      it("resets line count at 456 ticks after 10 lines", function() {
        gpu.line = 153;
        gpu.execute(4);
        expect(gpu.line).to.equal(0);
      });
    });

    describe("mode 2", function() {
      beforeEach(function() {
        gpu.clock = 79;
        gpu.mode = 2;
        gpu.execute(2);
      });

      it("resets clock at 80 ticks", function() {
        expect(gpu.clock).to.equal(0);
      });

      it("switches to mode 3 at 80 ticks", function() {
        expect(gpu.mode).to.equal(3);
      });
    });

    describe("mode 3", function() {
      beforeEach(function() {
        gpu.clock = 170;
        gpu.mode = 3;
        gpu.execute(2);
      });

      it("resets clock at 172 ticks", function() {
        expect(gpu.clock).to.equal(0);
      });

      it("switches to mode 0 at 172 ticks", function() {
        expect(gpu.mode).to.equal(0);
      });
    });
  });
});
