<template>
  <span>GeoJSON file</span>
  <v-file-input
    v-model="file"
    :rules="validationRules"
    variant="outlined"
    density="comfortable"
    accept="application/geojson"
    validate-on="submit-lazy"
    append-icon="mdi-paperclip"
    prepend-icon
    :error-messages="errorMessages"
    @update:focused="messages = []"
    @change="update"
    class="mt-2"
  ></v-file-input>
</template>

<script>
import { GeoJSONDataSource } from "@/utils/datasources/maplibre_style_approach/DataSources";
export default {
  emits: ["datasource-created"],
  data() {
    return {
      file: null,
      errorMessages: [],
      validationRules: [
        (v) => !!v || "Select a file",
        (v) =>
          (v && v.name.endsWith(".geojson")) ||
          "Currently we only support GeoJSON",
      ],
    };
  },
  methods: {
    update: function () {
      if (this.file) {
        this.openFile().then((geojson) => {
          if (typeof geojson === "string") {
            geojson = JSON.parse(geojson);
          }

          let datasetName = this.file.name
            .split(".")[0]
            .replace(/\s+/g, "_")
            .toLowerCase();
          const datasource = new GeoJSONDataSource(
            datasetName,
            datasetName,
            geojson,
          );
          const geometry_type = geojson.features[0].geometry.type.toLowerCase();
          datasource.createDefaultLayers(geometry_type);

          this.$emit("datasource-created", datasource);
        });
      }
    },
    isValidJSON: function (file) {
      try {
        JSON.parse(file);
      } catch (e) {
        return false;
      }
      return true;
    },

    openFile: async function (e) {
      let reader = new FileReader();
      const promise = new Promise((resolve, reject) => {
        reader.readAsText(this.file);
        reader.onload = () => {
          if (this.isValidJSON(reader.result)) {
            this.loading = false;

            resolve(reader.result);
          } else {
            this.$refs.geoJSONInput.messages.push(
              "Invalid JSON structure. Could not parse the GeoJSON file",
            );

            reject();
          }
        };
      });

      return promise;
    },
  },
};
</script>

<style></style>
