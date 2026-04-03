class Project {
  constructor(id = null, stylename, description) {
    this._id = id;
    this._name = stylename;
    this._description = description ? description : "";
    this._datasources = [];
  }
  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get datasources() {
    return this._datasources;
  }

  getSourceIds() {
    return this._datasources.map((ds) => ds.source_id);
  }

  cleanStyle(style) {
    const sourceIds = new Set(this.getSourceIds());

    style.layers = style.layers.filter((layer) => {
      return !layer.source || sourceIds.has(layer.source);
    });

    style.sources = Object.fromEntries(
      Object.entries(style.sources).filter(([id]) => sourceIds.has(id)),
    );

    delete style.glyphs;
    delete style.sprite;

    return style;
  }

  addDataSource(datasource) {
    this._datasources.push(datasource);
  }
}

export default Project;
