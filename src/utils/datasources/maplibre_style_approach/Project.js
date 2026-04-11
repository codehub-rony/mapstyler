class Project {
  constructor(id = null, name, description) {
    this._id = id;
    this._name = name;
    this._description = description ? description : "";
    this._datasources = [];
    this._stylejson_id = null;
  }

  // The overal idea of refactoring this is that a Project can have multiple stylesjsons.
  // SO a new class is needed called stylejson, which holds all functions for creating and
  // managing the style and its attributes.
  // This style is saved seperately in the database and has therefore its one stylejson_id.
  // This is also used to either create the style i nthe db if stylejson_id is not defined,
  // or save if it already exists

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

  get stylejson_id() {
    return this._stylejson_id;
  }

  set stylejson_id(id) {
    this._stylejson_id = id;
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

    style.name = this.name;

    return style;
  }

  addDataSource(datasource) {
    this._datasources.push(datasource);
  }
}

export default Project;
