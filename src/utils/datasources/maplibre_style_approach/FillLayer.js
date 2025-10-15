import BaseLayer from "./BaseLayer.js";

class FillLayer extends BaseLayer {
  constructor(source_id, source_layer) {
    super(source_id, source_layer, "fill");

    this._paint = {
      "fill-color": "rgb(255, 255, 255)",
      "fill-opacity": 0.6,
    };
  }
}

export default FillLayer;
