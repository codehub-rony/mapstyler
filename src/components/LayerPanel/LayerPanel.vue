<template>
  <v-sheet>
    <div class="d-flex flex-row justify-space-between mb-2">
      <div class="text-h6 font-weight-light">Datasets</div>
      <v-btn
        size="x-small"
        variant="text"
        @click="openDialogForNewSource"
        class="mt-2"
        v-if="
          isAuthenticated() &&
          styleJSON?.sources &&
          Object.keys(styleJSON.sources).length > 0
        "
        >add new</v-btn
      >
    </div>
    <v-scroll-y-transition>
      <div>
        <LayerList :layers="styleJSON?.layers" />
      </div>
    </v-scroll-y-transition>
    <div class="d-flex flex-column" v-if="styleJSON?.layers?.length > 0">
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
    <addDataDialog
      v-if="isAuthenticated"
      :stylejson="styleJSON"
      ref="newdatasource"
    />
  </v-sheet>
</template>

<script>
import LayerList from "@/components/LayerPanel/LayerList.vue";

//tmp
import addDataDialog from "@/components/DataImport/addDataDialog.vue";

// store
import { useAuthStore } from "@/store/auth.js";
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

import utils from "@/utils/common.js";

import _ from "lodash";

export default {
  components: {
    LayerList,
    addDataDialog,
  },
  props: {
    styleJSON: Object,
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
      utils.download_stylejson(this.styleJSON.export());
    },
    save: function () {
      this.saveProject();
    },
  },
};
</script>

<style></style>
