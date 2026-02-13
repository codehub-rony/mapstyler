class BaseLayer {
  constructor(source_id, source_layer, layer_type) {
    if (!source_id) {
      throw new Error("Missing parameter: source_id");
    }
    this._id = this.#generateUniqueId();
    this._name = `source_layer ${layer_type}`;
    this._source = source_id;
    this._source_layer = source_layer;
    this._type = layer_type;
    this._paint = {};
    this._layout = { visibility: "visible" };
  }

  #generateUniqueId() {
    let id = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return id;
  }
  #getRandomInteger(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  // #generateRGBAColor() {
  //   let r = this.getRandomInteger(255);
  //   let g = this.getRandomInteger(255);
  //   let b = this.getRandomInteger(255);

  //   return { r: r, g: g, b: b, a: 0.7 };
  // }

  getLayerAsObject() {
    let layer = {
      id: this._id,
      name: this._name,
      type: this._type,
      source: this._source,

      paint: this._paint,
      layout: this._layout,
    };

    if (this._source_layer) {
      layer["source-layer"] = this._source_layer;
    }
    return layer;
  }
}

export default BaseLayer;
