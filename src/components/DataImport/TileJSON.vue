<template>
  <div>
    <v-form ref="tilejsonform">
      <InputTextField
        v-model="stylename"
        :validationRules="['not_empty', 'only_char']"
      />
      <span
        >TileJSON URL
        <v-tooltip
          text="We currently only support WebMercator. Click for more information on github"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              density="compact"
              size="small"
              icon="mdi-information-outline"
              flat
              class="mb-1"
              @click="openUrl"
            ></v-btn>
          </template> </v-tooltip
        ><span class="text-caption beta-text-label ml-1">beta</span></span
      >

      <v-text-field
        v-model="url"
        variant="outlined"
        density="comfortable"
        append-icon="mdi-web"
        class="mt-2"
        @update:modelValue="validateInput"
        :error-messages="errorMessages"
        :rules="tilejsonRules"
      ></v-text-field>
    </v-form>

    <div class="dataset-container pa-3" v-if="vector_layers.length > 0">
      <div
        class="d-flex flex-row justify-space-between mb-3 text-text-subtitle-2 font-weight-bold"
      >
        <div>Layer</div>
        <div>Geometry type</div>
      </div>
      <div
        v-for="(item, i) in vector_layers"
        :key="i"
        class="d-flex flex-row align-center justify-space-between"
      >
        <div class="cursor-select" @click="selectItem(item.id)">
          <v-icon>
            {{
              selected.includes(item.id)
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}</v-icon
          ><span class="ml-3">{{ item.id }} </span>
        </div>
        <GeometryTypeDisplay :geometryType="item.geometry_type" />
      </div>
    </div>
    <div class="d-flex justify-center mt-5">
      <v-btn color="primary" flat @click="validateInput"
        >import vector layers</v-btn
      >
    </div>
  </div>
</template>

<script>
import InputTextField from "@/components/GenericComponents/InputTextField.vue";
import GeometryTypeDisplay from "./GeometryTypeDisplay.vue";
export default {
  components: { InputTextField, GeometryTypeDisplay },
  data() {
    return {
      url: null,
      errorMessages: [],
      selected: [],
      stylename: null,
      tilejsonRules: [(v) => !!v || "A URL to a vector tilejson is required"],
      validGoemetries: [
        "polygons",
        "polygon",
        "point",
        "line",
        "lines",
        "points",
      ],
      vector_layers: [],
      selected: [],
    };
  },
  methods: {
    openUrl: function () {
      window.open(
        "https://github.com/codehub-rony/map-styler/wiki/OGC-API-%E2%80%90-Tiles",
        "_blank"
      );
    },
    validateInput: async function () {
      this.errorMessages = [];
      this.vector_layers = [];
      const { valid } = await this.$refs.tilejsonform.validate();

      if (valid) {
        this.loadData();
      }
    },
    loadData: function () {
      fetch(this.url)
        .then((res) => res.json())
        .then((tilejson) => {
          this.tilejson = tilejson;
          console.log(this.tilejson);
          if (!"vector_layers" in tilejson) {
            this.errorMessages.push("Tilejson has now vector layers defined");
          }
          console.log(tilejson.vector_layers);
          this.vector_layers = tilejson.vector_layers;
          console.log(this.vector_layers);
        })
        .catch(() => {
          this.errorMessages.push("The URL does not return a valid tilejson");
        });
    },
    selectItem: function (item) {
      console.log(item);
      let index = this.selected.indexOf(item);
      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(item);
      }
    },
  },
};
</script>

<style>
.beta-text-label {
  color: red;
}

.cursor-select {
  cursor: pointer;
}

.selected-item {
  background-color: rgba(172, 206, 209, 0.2);
}
</style>
