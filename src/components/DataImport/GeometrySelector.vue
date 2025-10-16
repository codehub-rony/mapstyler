<template>
  <div>
    <v-tooltip v-if="!editmode && selected" text="Click to edit geometry type">
      <template v-slot:activator="{ props }">
        <v-chip v-bind="props" @click="edit" class="text-blue ma-2">{{
          selected
        }}</v-chip></template
      ></v-tooltip
    >

    <div v-else class="d-flex flex-row align-center">
      <v-tooltip
        text="Geometry type is not known. Select one to continue"
        :disabled="selected"
      >
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            @click="editmode = false"
            size="small"
            class="mr-3"
            :color="selected ? '' : 'red accent-4'"
            >{{ selected ? "mdi-close" : "mdi-alert-circle-outline" }}</v-icon
          ></template
        ></v-tooltip
      >

      <v-chip-group
        v-model="selected"
        mandatory
        variant="outlined"
        @update:model-value="select"
      >
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
  emits: ["update-geomtype"],
  props: {
    geometryType: String,
    layerId: String,
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
    },
    select: function () {
      this.editmode = false;
      this.$emit("update-geomtype", {
        layer_id: this.layerId,
        geometry_type: this.selected,
      });
    },
  },
};
</script>
