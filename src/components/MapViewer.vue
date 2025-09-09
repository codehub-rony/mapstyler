<template>
  <div>
    <v-sheet :height="height" id="map_container"> </v-sheet>
  </div>
</template>

<script>
// store
import { useAppStore } from "@/store/app.js";
import { mapState, mapActions } from "pinia";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default {
  computed: {
    ...mapState(useAppStore, ["styleObjects", "currentProject", "project"]),
  },
  data() {
    return {
      map: null,
      height: null,
    };
  },

  mounted() {
    this.setHeight();
    this.initMap();

    this.emitter.on("set-paint-properties", (update) => {
      for (const [key, value] of Object.entries(update.properties)) {
        this.map.setPaintProperty(update.layer_id, key, value);
      }
    });

    this.emitter.on("set-layout-properties", (update) => {
      console.log("--- update", update);
      for (const [key, value] of Object.entries(update.properties)) {
        this.map.setLayoutProperty(update.layer_id, key, value);
      }
    });
  },
  methods: {
    ...mapActions(useAppStore, ["isStyleObjectLoaded"]),
    initMap: function () {
      this.map = new maplibregl.Map({
        container: "map_container",
        style: "https://tiles.openfreemap.org/styles/bright",
        center: [5.204, 52.062],
        zoom: 6,
      });

      this.map.on("load", () => {
        if (this.project.datasources.length > 0) {
          this.project.datasources.forEach((datasource) => {
            console.log(datasource);

            if (datasource.type === "geojson") {
              this.addGeoJSONSource(datasource);
            }
          });
        }
      });
    },
    addGeoJSONSource(datasource) {
      this.map.addSource(datasource.source_id, datasource.getSourceAsObject());

      datasource.layers.forEach((layer) => {
        this.map.addLayer(layer);
      });
    },
    setHeight: function () {
      this.height =
        window.innerHeight < 950 ? window.innerHeight * 0.8 : "85vh";
    },
  },

  watch: {
    styleObjects: {
      handler() {
        // if (this.styleObjects.length > 0) {
        //   console.log(this.styleObjects, "----------");
        //   this.addGeoJSONSource(this.styleObjects[0]);
        // }
      },
      deep: true,
    },
  },
};
</script>
<style>
#map_container {
  height: 85vh;
  border: solid 1px #e0e0e0;
}
</style>
