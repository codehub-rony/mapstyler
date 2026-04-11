<template>
  <div style="width: 100%">
    <v-form ref="tilejsonform">
      <InputTextField
        v-model="datasourceId"
        :validationRules="['not_empty', 'only_char']"
      >
        <template #label> Datasource name </template></InputTextField
      >
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
        @update:modelValue="loadData"
        :error-messages="TileJSONErrors"
        :rules="tilejsonRules"
      ></v-text-field>
    </v-form>

    <div
      class="dataset-container pa-3 d-flex flex-row justify-space-between"
      v-if="vector_layers.length > 0"
    >
      <div class="d-flex flex-column justify-space-between mb-3">
        <div class="text-text-subtitle-2 font-weight-bold">Layer</div>

        <div
          v-for="(layer, i) in vector_layers"
          :key="i"
          class="d-flex flex-row align-center justify-space-between"
        >
          <div class="cursor-select" @click="selectLayer(layer)">
            <v-icon>
              {{
                selected.some((l) => l.id === layer.id)
                  ? "mdi-checkbox-marked"
                  : "mdi-checkbox-blank-outline"
              }}</v-icon
            ><span class="ml-3">{{ layer.id }} </span>
          </div>
        </div>
      </div>
      <div>
        <div
          class="text-text-subtitle-2 font-weight-bold justify-space-between mt-1"
        >
          Geometry type
        </div>
        <div v-for="(layer, i) in vector_layers" :key="i">
          <GeometrySelector
            :geometryType="layer.geometry_type"
            :layerId="layer.id"
            @update-geomtype="setGeoemtryType"
          />
        </div>
      </div>
    </div>
    <div class="d-flex align-center mt-5 flex-column">
      <div
        class="text-red-accent-4 mb-3 error-message"
        :style="{ visibility: validationError ? 'visible' : 'hidden' }"
      >
        {{ validationError || " " }}
      </div>
    </div>
  </div>
</template>

<script>
// TO DO: centralize dataset-container class (grey outline of box)
// TO DO: refactor timer
import InputTextField from "@/components/GenericComponents/InputTextField.vue";
import GeometrySelector from "./GeometrySelector.vue";
import { StyleJSON } from "@/utils/datasources/maplibre_style_approach/StyleJSON";

import { VectorTileSource } from "@/utils/datasources/maplibre_style_approach/DataSources";

// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  components: { InputTextField, GeometrySelector },
  data() {
    return {
      url: null,
      validationError: " ",
      TileJSONErrors: [],
      selected: [],
      datasourceId: null,
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
      timeout: null,
    };
  },
  methods: {
    ...mapActions(useAppStore, ["setProject"]),
    setGeoemtryType: function (update) {
      this.vector_layers.forEach((vector_layer) => {
        if (vector_layer.id === update.layer_id) {
          vector_layer.geometry_type = update.geometry_type;
        }
      });
    },
    openUrl: function () {
      window.open(
        "https://github.com/codehub-rony/map-styler/wiki/OGC-API-%E2%80%90-Tiles",
        "_blank",
      );
    },
    validateInput: async function () {
      this.errorMessages = "";

      let { valid } = await this.$refs.tilejsonform.validate();

      if (this.selected.length < 1) {
        this.stopTimer();
        this.validationError = "Select at least one Vector layer to continue";

        this.timeout = setTimeout(() => {
          this.validationError = null;
        }, 4000);
        return;
      }

      this.selected.forEach((layer) => {
        if (!this.validGoemetries.includes(layer.geometry_type)) {
          valid = false;
          this.stopTimer();
          this.validationError =
            "one or more selected vector layers have an unkown geometry type. Please select one.";

          this.timeout = setTimeout(() => {
            this.validationError = null;
          }, 4000);
        }
      });

      if (valid) {
        this.stopTimer();

        const datasource = new VectorTileSource(
          this.datasourceId,
          this.datasourceId,
          this.tilejson.tiles[0],
        );

        this.selected.forEach((layer) => {
          datasource.createDefaultLayers(
            layer.geometry_type,
            layer.id,
            this.datasourceId,
          );
        });

        this.$emit("datasource-created", datasource);
      }
    },

    stopTimer: function () {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.validationError = null;
        this.TileJSONErrors = null;
      }
    },

    loadData: function () {
      this.TileJSONErrors = [];
      this.vector_layers = [];
      fetch(this.url)
        .then((res) => res.json())
        .then((tilejson) => {
          this.tilejson = tilejson;

          if ((!"vector_layers") in tilejson) {
            this.TileJSONErrors.push("Tilejson has now vector layers defined");
          }

          this.vector_layers = tilejson.vector_layers;
        })
        .catch(() => {
          this.TileJSONErrors.push("The URL does not return a valid tilejson");
        });
    },
    selectLayer: function (layer) {
      let index = this.selected.findIndex((l) => layer.id === l.id);

      if (index > -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(layer);
      }

      this.validateInput();
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

.error-message {
  min-height: 1.5em;
  display: block;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.error-message[style*="visible"] {
  opacity: 1;
}
</style>
