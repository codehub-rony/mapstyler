import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import TileJSON from "ol/source/TileJSON";

const initBaseMap = function (maptiler_api_key) {
  if (maptiler_api_key) {
    return new TileLayer({
      source: new TileJSON({
        url: `https://api.maptiler.com/maps/dataviz/tiles.json?key=${maptiler_api_key}`,
        tileSize: 512,
        crossOrigin: "anonymous",
      }),
    });
  }

  return new TileLayer({
    source: new OSM(),
  });
};

export default { initBaseMap };
