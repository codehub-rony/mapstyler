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
import GeoJSONSource from "@/components/DataImport/GeoJSONSource.vue";
import InputTextField from "@/components/GenericComponents/InputTextField.vue";

import Project from "@/utils/datasources/maplibre_style_approach/Project";

// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  components: { InputTextField, TileJSONSource, GeoJSONSource },
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

        this.setProject(project);
        this.$router.push("/editor");
      }
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
