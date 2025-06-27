import { GeoJsonSource } from "../src/utils/datasources/StyleDataSources.js";

describe("GeoJsonSource", function () {
  describe("Initialize class", () => {
    const source_id = "test_id";
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [4.895168, 52.370216],
          },
          properties: {
            name: "Amsterdam",
            category: "city",
          },
        },
      ],
    };

    beforeEach(() => {
      GeoJSONSource = new GeoJsonSource(source_id, geojson);
    });

    it("instance of GeoJsonSource is created", function () {
      expect(GeoJSONSource).toBeInstanceOf(GeoJSONSource);
    });

    it("source id to be set correctly", function () {
      expect(GeoJSONSource.id).toBe(source_id);
    });

    // it("type to be 'vector'", function () {
    //   let source_id = Object.keys(stylejson.sources)[0];
    //   stylejson.sources[source_id].type;

    //   expect(vectorSource._type).toBe(stylejson.sources[source_id].type);
    // });

    // it("tiles to have the correct number of items", function () {
    //   let source_id = Object.keys(stylejson.sources)[0];
    //   let originalLength = stylejson.sources[source_id].tiles.length;
    //   let tiles_length = vectorSource._tiles.length;

    //   expect(tiles_length).toBe(originalLength);
    // });
    // it("getSourceAsObject() returns valid sources object", function () {
    //   expect(vectorSource.getSourceAsObject()).toEqual(stylejson.sources);
    // });
  });
});
