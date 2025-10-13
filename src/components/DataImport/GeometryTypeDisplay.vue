<template>
  <div>
    <v-chip @click="edit" v-if="!editmode && selected" class="text-blue ma-2">{{
      selected
    }}</v-chip>

    <div v-else class="d-flex flex-row align-center">
      <v-icon
        @click="editmode = false"
        size="small"
        class="mr-3"
        :color="selected ? '' : 'red accent-4'"
        >{{ selected ? "mdi-close" : "mdi-alert-circle-outline" }}</v-icon
      >

      <v-chip-group v-model="selected" mandatory variant="outlined">
        <v-chip
          v-for="(geom, i) in geometries"
          :key="i"
          :value="geom"
          :class="selected === geom ? 'text-blue' : ''"
        >
          {{ geom }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    geometryType: String,
  },
  data() {
    return {
      selected: null,
      editmode: false,
      geometries: ["points", "lines", "polygons"],
    };
  },

  mounted() {
    const validTypes = ["points", "lines", "polygons"];
    this.selected = this.geometries.includes(this.geometryType)
      ? this.geometryType
      : null;
  },
  methods: {
    edit: function () {
      this.editmode = this.editmode ? false : true;
      console.log(this.editmode);
    },
  },
};
</script>

<style>
.geometry-not-found {
  background-color: red;
}
</style>
