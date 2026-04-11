<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-sheet>
      <v-container class="mb-4">
        <v-row>
          <v-col>
            <div class="d-flex flex-row mb-5">
              <span class="text-h5 font-weight-light">Add data</span>
            </div>
          </v-col>
        </v-row>
        <v-row dense
          ><v-col cols="12">
            <div class="d-flex flex-column form-input-item-container">
              <DataSourceSelector
                @select="selectedType = $event"
                v-if="!selectedType"
              />

              <component
                :is="selectedType"
                v-if="selectedType"
                @datasource-created="datasource = $event"
              />
            </div>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="auto" class="text-center">
            <ButtonGroup @confirm="addDataToStyleJSON" @decline="closeDialog" />
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-dialog>
</template>

<script>
import ButtonGroup from "@/components/DataImport/ButtonGroup.vue";
import TileJSONSource from "@/components/DataImport/TileJSONSource.vue";
import InputTextField from "@/components/GenericComponents/InputTextField.vue";
import DataSourceSelector from "./DataSourceSelector.vue";

// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  components: {
    ButtonGroup,
    TileJSONSource,
    InputTextField,
    DataSourceSelector,
  },
  props: {
    stylejson: Object,
  },

  data() {
    return {
      selectedType: null,
      isOpen: false,
      datasource: null,
    };
  },

  methods: {
    ...mapActions(useAppStore, ["addDataSource"]),
    addDataToStyleJSON() {
      if (!this.stylejson) {
        console.error("No stylejson defined");
        return;
      }

      this.addDataSource(this.datasource);

      this.closeDialog();
    },

    openDialog() {
      this.isOpen = true;
    },
    closeDialog() {
      this.styleName = null;
      this.tilejson = null;
      this.isOpen = false;
    },
  },
};
</script>
