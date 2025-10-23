// src/services/mapService.js
import maplibregl from "maplibre-gl";

export default class MapService {
  constructor() {
    if (MapService.instance) {
      return MapService.instance;
    }
    this.map = null;
    this.optionsCache = null;

    MapService.instance = this;
  }

  createMap(container, options = {}) {
    if (!this.map) {
      this.optionsCache = {
        style: "https://tiles.openfreemap.org/styles/positron",
        center: [5.204, 52.062],
        zoom: 6,
        ...options,
      };

      this.map = new maplibregl.Map({
        container,
        ...this.optionsCache,
      });
    }
    return this.map;
  }

  destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
