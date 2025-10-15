<template>
  <div>
    <v-sheet :height="height" id="map_container"> </v-sheet>
  </div>
</template>

<script>
// store
import { useAppStore } from "@/store/app.js";
import { mapState } from "pinia";

import MapService from "@/services/MapService";

export default {
  computed: {
    ...mapState(useAppStore, ["project"]),
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

    this.emitter.on("set-layout-properties", (update) => {
      for (const [key, value] of Object.entries(update.properties)) {
        this.map.setLayoutProperty(update.layer_id, key, value);
      }
    });

    this.emitter.on("remove-layer", (layer_id) => {
      if (this.map.getLayer(layer_id)) this.map.removeLayer(layer_id);
    });
  },
  methods: {
    initMap: function () {
      const map_service = new MapService();
      this.map = map_service.createMap("map_container");

      this.map.on("load", () => {
        if (this.project.datasources.length > 0) {
          this.project.datasources.forEach((datasource) => {
            // if (datasource.type === "geojson") {
            this.addGeoJSONSource(datasource);
            // }

            this.emitter.on("set-paint-property", (update) => {
              console.log(update);
              for (const [key, value] of Object.entries(update.properties)) {
                this.map.setPaintProperty(update.layer_id, key, value);
              }
            });
          });
        }
      });
    },
    addGeoJSONSource(datasource) {
      this.map.addSource(datasource.source_id, datasource.getSourceAsObject());
      console.log(datasource.layers, "=================");
      datasource.layers.forEach((layer) => {
        this.map.addLayer(layer);
      });
    },
    setHeight: function () {
      this.height =
        window.innerHeight < 950 ? window.innerHeight * 0.8 : "85vh";
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
