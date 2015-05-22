var util = {
  mapTileToAddress: function(tileIndex, select) {
    var addr;
    if (select === 1) {
      addr = tileIndex * 16;
    } else {
      if (addr >> 7) {
        addr = (tileIndex & 0xFF) * 16;
      } else {
        addr = (tileIndex + 256) * 16;
      }
    }
    return addr;
  },

  mapPixelToTileMapAddress: function(x, y) {
    return (x >> 3) + (y >> 3) * 32;
  }
};

module.exports = util;
