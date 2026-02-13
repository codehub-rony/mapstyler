import BaseLayer from "./BaseLayer.js";

class CircleLayer extends BaseLayer {
  constructor(source_id, source_layer) {
    super(source_id, source_layer, "circle");

    this._paint = {
      "circle-color": "rgb(232, 227, 223)",
      "circle-radius": 5,
      "circle-stroke-color": "rgb(54, 154,204)",
      "circle-stroke-width": 1,
    };
  }
}

export default CircleLayer;
