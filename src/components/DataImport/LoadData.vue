<template>
  <div style="width: 100%">
    <div class="d-flex flex-column align-center">
      <span class="text-h5 font-weight-light mt-2 mb-6">{{ dialogTitle }}</span>

      <DataSourceSelector
        @select="selectedType = $event"
        v-if="!selectedType"
      />
      <div class="d-flex flex-column" style="width: 100%">
        <InputTextField
          v-model="stylename"
          v-if="selectedType"
          :validationRules="['not_empty', 'only_char']"
        >
          <template #label> Style name </template></InputTextField
        >

        <component
          :is="selectedType"
          v-if="selectedType"
          @datasource-created="datasource = $event"
        />
      </div>

      <div class="d-flex flex-row">
        <v-btn
          flat
          @click="handleBackClick"
          :loading="loadingData"
          variant="text"
          v-if="!$route.name === 'new-project'"
          >back</v-btn
        >
        <v-btn
          color="primary"
          flat
          @click="validate"
          :loading="loadingData"
          v-if="selectedType"
          >import</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import TileJSONSource from "@/components/DataImport/TileJSONSource.vue";
import GeoJSONInput from "@/components/DataImport/GeoJSONInput.vue";
import InputTextField from "@/components/GenericComponents/InputTextField.vue";

import Project from "@/utils/datasources/maplibre_style_approach/Project";

import {
  createProjectFromGeoJSON,
  createProjectFromTileJSON,
} from "@/services/ProjectFactory";

// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  components: { InputTextField, TileJSONSource, GeoJSONInput },
  computed: {
    dialogTitle() {
      return this.selectedType ? "Import your data" : "Choose a data source";
    },
  },
  data() {
    return {
      fileInput: null,
      stylename: null,
      selectedType: null,
      datasource: null,
      dataSources: [
        { label: "GeoJSON", id: "geojson" },
        { label: "TileJSON", id: "tilejson" },
      ],
      loading: false,
      loadingData: false,
    };
  },

  methods: {
    ...mapActions(useAppStore, ["addStyleObject", "setProject"]),
    async validate() {
      this.loading = true;

      if (this.datasource) {
        const project = new Project(null, this.stylename, null);
        project.addDataSource(this.datasource);

        console.log("created project", project);
        this.setProject(project);
        this.$router.push("/editor");
      }

      // if (valid) {
      //   if (this.selectedType === "geojson") {
      //     this.openFile().then((geojson) => {
      //       const project = createProjectFromGeoJSON(
      //         this.stylename,
      //         this.stylename.toLowerCase(),
      //         geojson,
      //       );
      //     });
      //   }
    },

    // Move this function to GeoJsoninput
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
        reader.readAsText(this.fileInput);
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
    handleBackClick: function () {
      if (this.selectedType) {
        this.selectedType = null;
      } else {
        this.$emit("go-back");
      }
    },
  },
};
</script>
<style>
.input-container {
  width: 100%;
  max-width: 900px;
}
.form-input-item-container {
  width: 100%;
}

.form-input-item-label {
  width: 70%;
  margin-top: 5px;
}

.testy {
  border: solid 1px lightgrey !important;
}
</style>
