import maplibregl from "maplibre-gl";

class MapService {
  constructor() {
    if (MapService.instance) {
      return MapService.instance;
    }
    this.map = null;
    MapService.instance = this;
  }

  createMap(containerId, options = {}) {
    if (this.map) return this.map;
    this.map = new maplibregl.Map({
      container: containerId,
      style: options.style || "https://tiles.openfreemap.org/styles/positron",
      center: options.center || [5.204, 52.062],
      zoom: options.zoom || 6,
    });

    return this.map;
  }

  getMap() {
    if (!this.map) {
      throw new Error("Map has not been initialized yet");
    }
    return this.map;
  }

  addSource(datasource) {
    Object.entries(datasource).forEach(([sourceId, sourceDef]) => {
      if (this.map.getSource(sourceId)) {
        return;
      }

      this.map.addSource(sourceId, sourceDef);
    });
  }

  addLayer(layer) {
    if (!this.map.getLayer(layer.id)) {
      this.map.addLayer(layer);
    }
  }

  setPaintProperties(layerId, properties) {
    if (this.map.getLayer(layerId)) {
      for (const [key, value] of Object.entries(properties)) {
        this.map.setPaintProperty(layerId, key, value);
      }
    }
  }

  setLayoutProperties(layerId, properties) {
    if (this.map.getLayer(layerId)) {
      for (const [key, value] of Object.entries(properties)) {
        this.map.setLayoutProperty(layerId, key, value);
      }
    }
  }

  removeLayer(layerId) {
    if (!this.map) return;

    if (this.map.getLayer(layerId)) {
      this.map.removeLayer(layerId);
    }
  }

  removeSourceAndLayers(sourceId) {
    const style = this.map.getStyle();
    if (!style?.layers) return;

    style.layers
      .filter((l) => l.source === sourceId)
      .forEach((l) => this.map.removeLayer(l.id));

    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
    }
  }

  getStyleJSON() {
    return this.map.getStyle();
  }

  destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export default new MapService();
