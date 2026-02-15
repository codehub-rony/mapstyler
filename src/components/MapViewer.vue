<template>
  <div>
    <v-sheet :height="height" id="map_container"> </v-sheet>
  </div>
</template>

<script>
// store
import { useAppStore } from "@/store/app.js";
import { mapState, mapActions } from "pinia";

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
  },

  methods: {
    ...mapActions(useAppStore, ["unloadProject"]),
    initMap: function () {
      this.map = MapService.createMap("map_container");

      this.map.on("load", () => {
        console.log("Map is ready");
        this.loadStyle();
      });
    },
    loadStyle() {
      if (this.project.datasources.length > 0) {
        this.project.datasources.forEach((datasource) => {
          this.map.addSource(
            datasource.source_id,
            datasource.getSourceAsObject(),
          );
          datasource.layers.forEach((layer) => {
            this.map.addLayer(layer);
          });
        });
      }
    },
    setHeight: function () {
      this.height =
        window.innerHeight < 950 ? window.innerHeight * 0.8 : "85vh";
    },
  },
  unmounted() {
    this.unloadProject();
  },
};
</script>
<style>
#map_container {
  height: 85vh;
  border: solid 1px #e0e0e0;
}
</style>
