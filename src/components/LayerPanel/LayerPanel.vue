<template>
  <v-sheet>
    <div class="d-flex flex-row justify-space-between mb-2">
      <div class="text-h6 font-weight-light">Datasets</div>
      <v-btn
        size="x-small"
        variant="text"
        @click="openDialogForNewSource"
        class="mt-2"
        v-if="isAuthenticated() && project?.datasources?.length > 0"
        >add new</v-btn
      >
    </div>
    <v-scroll-y-transition>
      <div>
        <LayerList
          v-for="(datasource, key) in project?.datasources"
          :key="key"
          :datasource="datasource"
        />
      </div>
    </v-scroll-y-transition>
    <div class="d-flex flex-column" v-if="project?.datasources?.length > 0">
      <v-btn
        block
        color="primary"
        rounded="0"
        elevation="0"
        class="mt-2"
        v-if="isAuthenticated()"
        @click="save"
        >save</v-btn
      >
      <v-btn
        :color="isAuthenticated() ? 'black' : 'primary'"
        rounded="0"
        elevation="0"
        class="mt-2"
        :variant="isAuthenticated() ? 'text' : 'flat'"
        @click="handleClickDownload"
        >download</v-btn
      >
    </div>

    <div v-else class="d-flex flex-column justify-center mt-5">
      <span class="font-italic text-body-2 text-center mb-5"
        >Welcome to the editor <br />
        Currently it looks a bit empty. Let's fix that! <br />Add a VectorTile
        layer to begin exploring.</span
      >
      <v-btn
        size="small"
        variant="outlined"
        rounded="0"
        color="black"
        class="mt-4"
        @click="openDialogForNewSource"
        >Add VectorTile layer</v-btn
      >
    </div>
    <addDataDialog v-if="isAuthenticated" ref="newdatasource" />
  </v-sheet>
</template>

<script>
import LayerList from "@/components/LayerPanel/LayerList.vue";

import utils from "@/utils/common.js";

//tmp
import addDataDialog from "@/components/DataImport/addDataDialog.vue";

import MapService from "@/services/MapService";

// store
import { useAuthStore } from "@/store/auth.js";
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

import _ from "lodash";

export default {
  // emits: ["save-project"],
  components: {
    LayerList,
    addDataDialog,
  },
  props: {
    project: Object,
  },
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["isAuthenticated"]),
    ...mapActions(useAppStore, ["saveProject"]),

    openDialogForNewSource: function () {
      this.$refs.newdatasource.openDialog();
    },
    handleClickDownload: function () {
      const style = MapService.getStyleJSON();
      let stylejson = this.project.cleanStyle(style);
      utils.download_stylejson(this.project.name, stylejson);
    },
    save: function () {
      this.saveProject();
    },
  },
};
</script>

<style></style>
