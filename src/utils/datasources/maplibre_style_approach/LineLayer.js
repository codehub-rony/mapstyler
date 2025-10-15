import BaseLayer from "./BaseLayer.js";

class LineLayer extends BaseLayer {
  constructor(source_id, source_layer) {
    super(source_id, source_layer, "line");

    this._paint = {
      "line-color": "rgb(0, 0, 0)",
      "line-width": 1,
    };
  }
}
export default LineLayer;
