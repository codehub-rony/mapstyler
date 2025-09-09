import BaseLayer from "./BaseLayer.js";

class FillLayer extends BaseLayer {
  constructor(source_id) {
    super(source_id, "fill");

    this._paint = {
      "fill-color": "rgb(255, 255, 255)",
      "fill-opacity": 0.6,
    };
  }
}

export default FillLayer;
