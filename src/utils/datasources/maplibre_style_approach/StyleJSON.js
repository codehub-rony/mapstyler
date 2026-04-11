export class StyleJSON {
  constructor(name = "") {
    this._id = null;
    this._version = 8;
    this._name = name;
    this._sources = {};
    this._layers = [];
  }

  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }

  get sources() {
    return this._sources;
  }

  get layers() {
    return this._layers;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }
  getLayerById(layerId) {
    return this._layers.find((l) => l.id === layerId);
  }

  addSource(sourceObj) {
    Object.assign(this._sources, sourceObj);
  }

  addLayers(newLayers) {
    if (!Array.isArray(newLayers)) {
      throw new Error("addLayers expects an array");
    }

    const existingIds = new Set(this._layers.map((layer) => layer.id));

    newLayers.forEach((layer) => {
      if (!layer.id) {
        throw new Error("Layer must have an id");
      }

      // Only add if it doesn't already exist
      if (!existingIds.has(layer.id)) {
        this._layers.push(layer);
        existingIds.add(layer.id);
      }
    });
  }

  updateLayerProperties(layerId, properties, section) {
    let target_layer = this.getLayerById(layerId);

    if (!target_layer) {
      console.warn(`Layer with id "${layerId}" not found`);
      return;
    }

    for (const [key, value] of Object.entries(properties)) {
      target_layer[section][key] = value;
    }
  }

  removeLayer(layerId) {
    this._layers.forEach((layer, i) => {
      if (layer.id === layerId) {
        this._layers.splice(i, 1);
      }
    });
  }

  export() {
    return {
      version: this._version,
      name: this._name,
      sources: this._sources,
      layers: this._layers,
    };
  }
}
