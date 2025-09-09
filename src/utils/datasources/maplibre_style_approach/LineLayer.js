import BaseLayer from "./BaseLayer.js";

class LineLayer extends BaseLayer {
  constructor(source_id) {
    super(source_id, "line");

    this._paint = {
      "line-color": "rgb(0, 0, 0)",
      "line-width": 1,
    };
  }
}
export default LineLayer;
