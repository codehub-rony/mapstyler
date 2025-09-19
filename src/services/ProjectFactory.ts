import GeoJSONDataSource from "@/utils/datasources/maplibre_style_approach/DataSources";
import Project from "@/utils/datasources/maplibre_style_approach/Project";

type GeometryType = "point" | "linestring" | "polygon";

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: Record<string, any>;
}

interface GeoJSON {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

/**
 * Creates a Project from a given GeoJSON dataset.
 *
 * @param name - The display name of the project
 * @param source_id - Unique identifier for the datasource
 * @param data - The GeoJSON dataset
 * @returns Project
 */

export function createProjectFromGeoJSON(
  name: string,
  source_id: string,
  data: GeoJSON
): Project {
  const datasource = new GeoJSONDataSource(name, source_id, data);
  const geometry_type =
    data.features[0].geometry.type.toLowerCase() as GeometryType;
  datasource.createDefaultLayers(geometry_type);

  const project = new Project(name);
  project.addDataSource(datasource);

  return project;
}
