import GeoJSONDataSource from "@/utils/datasources/maplibre_style_approach/DataSources";
import Project from "@/utils/datasources/maplibre_style_approach/Project";

export function createProjectFromGeoJSON(name, source_id, data) {
  const datasource = new GeoJSONDataSource(name, source_id, data);
  const geometry_type = data.features[0].geometry.type.toLowerCase();
  datasource.createDefaultLayers(geometry_type);

  const project = new Project(name);
  project.addDataSource(datasource);

  return project;
}
