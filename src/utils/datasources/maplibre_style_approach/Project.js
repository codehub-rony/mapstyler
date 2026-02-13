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

  get style_config() {
    return this._style_config;
  }

  get datasources() {
    return this._datasources;
  }

  addDataSource(datasource) {
    this._datasources.push(datasource);
  }
}

export default Project;
