/*global require, describe, it, beforeEach*/

var expect = require('chai').expect;
var sinon = require('sinon');
var util = require('../lib/util');

describe("util functions", function() {
  describe("mapTileToAddress", function() {
    it("maps tile index to address in tile data", function() {
      expect(util.mapTileToAddress(0, 1)).to.equal(0);
      expect(util.mapTileToAddress(45, 1)).to.equal(720);
      expect(util.mapTileToAddress(-128, 0)).to.equal(2048);
      expect(util.mapTileToAddress(50, 0)).to.equal(4896);
    });

    it("returns same address for overlapping tile indexes", function() {
      expect(util.mapTileToAddress(-128, 0)).to.equal(util.mapTileToAddress(128, 1));
      expect(util.mapTileToAddress(-56, 0)).to.equal(util.mapTileToAddress(200, 1));
      expect(util.mapTileToAddress(-1, 0)).to.equal(util.mapTileToAddress(255, 1));
    });
  });

  describe("mapPixelToTileMapAddress", function() {
    it("maps pixel coordinates to corresponding address in tile map", function() {
      expect(util.mapPixelToTileMapAddress(0, 0)).to.equal(0);
      expect(util.mapPixelToTileMapAddress(1, 0)).to.equal(0);
      expect(util.mapPixelToTileMapAddress(255, 0)).to.equal(31);
      expect(util.mapPixelToTileMapAddress(8, 8)).to.equal(33);
      expect(util.mapPixelToTileMapAddress(255, 255)).to.equal(1023);
    });
  });
});
