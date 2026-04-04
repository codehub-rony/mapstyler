<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" xl="2" lg="3" md="3" sm="3">
        <LayerPanel :project="project" />
      </v-col>

      <v-col cols="12" xl="10" lg="8" md="9" sm="9">
        <MapViewer ref="map" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// components
import LayerPanel from "@/components/LayerPanel/LayerPanel.vue";
import MapViewer from "@/components/MapViewer.vue";

// store
import { useAppStore } from "@/store/app";
import { useAuthStore } from "@/store/auth";
import { mapActions, mapState } from "pinia";

import _ from "lodash";

//API
import api from "@/services/apiService";

export default {
  components: {
    LayerPanel,
    MapViewer,
  },
  computed: {
    ...mapState(useAppStore, [
      "styleObjects",
      "currentProject",
      "originalState",
      "project",
    ]),
  },

  methods: {
    ...mapActions(useAppStore, ["clearProject", "hasUnsavedChanges"]),
    ...mapActions(useAuthStore, ["isAuthenticated"]),
    deleteStyleJSONS: function () {
      const missingObjects = this.originalState.filter(
        (obj1) => !this.styleObjects.some((obj2) => obj2.id === obj1.id),
      );

      if (missingObjects.length > 0) {
        missingObjects.forEach((stylejson) => {
          api.Project.deleteStyleJSON(
            this.currentProject.id,
            stylejson.id,
          ).then((res) => {
            console.log("succesfully deleted");
          });
        });
      }
    },
  },

  beforeRouteLeave: function (to, from, next) {
    if (this.isAuthenticated()) {
      if (this.hasUnsavedChanges()) {
        const answer = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        );
        if (!answer) return;
      }
    }
    this.clearProject();

    this.$nextTick(() => {
      next();
    });
  },
};
</script>
<style></style>
