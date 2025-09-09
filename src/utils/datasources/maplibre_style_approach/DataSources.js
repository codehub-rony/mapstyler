import FillLayer from "./FillLayer";
import LineLayer from "./LineLayer";

const geometryToLayerClasses = {
  polygon: [FillLayer, LineLayer],
  multipolygon: [FillLayer, LineLayer],
  line: [LineLayer],
  // point: [CircleLayer],
};

class BaseDataSource {
  constructor(label, source_id, type) {
    (this._label = label), (this._source_id = source_id);
    this._type = type;
    this._layers = [];
  }
  createDefaultLayers(geometry_type) {
    const LayerClasses = geometryToLayerClasses[geometry_type];
    if (!LayerClasses || LayerClasses.length === 0) {
      throw new Error(`Unsupported geometry type: ${geometry_type}`);
    }

    LayerClasses.forEach((LayerClass) => {
      const layer = new LayerClass(this._source_id);
      this._layers.push(layer.getLayerAsObject());
    });
  }

  get label() {
    return this._label;
  }

  set label(label) {
    this._label = label;
  }

  get source_id() {
    return this._source_id;
  }

  get type() {
    return this._type;
  }

  get layers() {
    return this._layers;
  }

  deleteLayer(layer_id) {
    this._layers.forEach((layer, i) => {
      if (layer.id === layer_id) {
        this._layers.splice(i, 1);
      }
    });
  }
}

class GeoJSONDataSource extends BaseDataSource {
  constructor(label, source_id, geojson) {
    super(label, source_id, "geojson");
    this._data = geojson;
  }

  get data() {
    return this._data;
  }

  getSourceAsObject() {
    return { type: this._type, data: this._data };
  }
}

export default GeoJSONDataSource;
