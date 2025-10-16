import {
  GeoJSONDataSource,
  VectorTileSource,
} from "@/utils/datasources/maplibre_style_approach/DataSources";
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

export interface TileJSON {
  tilejson: string;
  tiles: string[];

  vector_layers: VectorLayer[];

  bounds?: [number, number, number, number];
  center?: [number, number, number];
  description?: string;
  maxzoom?: number;
  minzoom?: number;
  name?: string;

  // allow extra fields without breaking typing
  [key: string]: unknown;
}

export interface VectorLayer {
  id: string;
  fields: Record<string, string>;
  description?: string;
  maxzoom?: number;
  minzoom?: number;
  geometry_type?: string;
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
  geojson: GeoJSON
): Project {
  if (typeof geojson === "string") {
    geojson = JSON.parse(geojson);
  }
  const datasource = new GeoJSONDataSource(name, source_id, geojson);
  const geometry_type =
    geojson.features[0].geometry.type.toLowerCase() as GeometryType;
  datasource.createDefaultLayers(geometry_type);

  const project = new Project(name);
  project.addDataSource(datasource);

  return project;
}

/**
 * Creates a Project from a given tilejson.
 *
 * @param name - The display name of the project
 * @param vector_layers - array of vector_tiles from a tilejson
 * @param tiles_url - The url to fetch tilejson
 * @returns Project
 */

export function createProjectFromTileJSON(
  name: string,
  tilejson: TileJSON,
  vector_layers: Array<object>,
  tiles_url: string
): Project {
  console.log("yaya");
  const datasource = new VectorTileSource(name, tilejson.name, tiles_url);

  vector_layers.forEach((layer) => {
    console.log(layer, "==========");
    datasource.createDefaultLayers(layer.geometry_type, layer.id);
  });

  const project = new Project(name);
  project.addDataSource(datasource);

  return project;
}
