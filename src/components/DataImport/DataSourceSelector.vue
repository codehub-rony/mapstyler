<template>
  <div class="d-flex flex-row justify-center">
    <div v-for="(source, i) in dataSources" :key="i">
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-card
            v-bind="props"
            :color="isHovering ? 'primary' : undefined"
            class="pa-4 ma-4 testy"
            rounded="1"
            flat
            @click="handleClick(source)"
          >
            <h4>{{ source.label }}</h4>
          </v-card>
        </template>
      </v-hover>
    </div>
  </div>
</template>
<script>
export default {
  emits: ["select"],
  data() {
    return {
      dataSources: [
        { label: "GeoJSON", id: "geojson", component: "GeoJSONInput" },
        { label: "TileJSON", id: "tilejson", component: "TileJSONSource" },
      ],
    };
  },
  methods: {
    handleClick: function (source) {
      console.log(source);
      this.$emit("select", source.component);
    },
  },
};
</script>
