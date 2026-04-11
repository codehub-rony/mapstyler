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
    ...mapState(useAppStore, ["styleJSON"]),
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
      const sources = this.styleJSON.sources;
      const layers = this.styleJSON.layers;
      if (this.styleJSON && Object.keys(sources).length > 0) {
        for (const [key, value] of Object.entries(sources)) {
          this.map.addSource(key, value);
        }

        layers.forEach((layer) => {
          this.map.addLayer(layer);
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
