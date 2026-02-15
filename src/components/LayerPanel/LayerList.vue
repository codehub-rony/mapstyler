<template>
  <div class="dataset-container mb-2">
    <LayerListControls
      :datasource="datasource"
      @collapse="isCollapsed = isCollapsed ? false : true"
      class="pl-2 pr-2 pt-1"
    />

    <div v-if="!isCollapsed">
      <div v-for="(layer, i) in datasource.layers" :id="i" class="mb-1 pl-4">
        <div
          class="d-flex flex-row align-center justify-space-between pl-2 pr-2"
        >
          <div class="flex-grow-1 pr-2" style="min-width: 0">
            <span
              class="text-subtitle-2"
              style="white-space: normal; word-break: break-word"
              >{{ layer["source-layer"] }}</span
            >
          </div>
          <div class="d-flex flex-row">
            <EditButton
              :layer="layer"
              :datasource="datasource"
              @open-edit-dialog="handleEvent"
            />
            <DeleteButton :callback="delete" :layer="layer" />
            <VisibilityButton :layer="layer" />
          </div>
        </div>

        <div
          v-for="(value, key) in layer.paint"
          :id="key"
          class="text-subtitle-2 test pr-4 pb-1 d-flex flex-row justify-space-between"
        >
          <ColorField
            v-if="
              key === 'fill-color' ||
              key === 'line-color' ||
              key === 'circle-stroke-color' ||
              key === 'circle-color'
            "
            :key="key"
            :property="{ layer_id: layer.id, property: key, value: value }"
            @color-updated="updateProperties"
          />
          <InputField
            v-if="
              key === 'line-width' ||
              key === 'circle-stroke-width' ||
              key === 'circle-radius'
            "
            :property="{ layer_id: layer.id, property: key, value: value }"
            @update-property="updateProperties"
          />
          <!--

          <DashArrayInput
            v-if="property.component.type === 'input_field_dasharray'"
            :property="property"
            :key="key"
          /> -->
        </div>
      </div>
      <!-- <BtnCreateLayer
        :styleObject="styleObject"
        mode="new"
        ref="filterDialog"
      /> -->
    </div>
  </div>
</template>

<script>
import InputField from "./InputField.vue";
import DashArrayInput from "./DashArrayInput.vue";
import ColorField from "./ColorField.vue";
import DeleteButton from "@/components/DeleteButton.vue";
import VisibilityButton from "./VisibilityButton.vue";
import EditButton from "./EditButton.vue";
import BtnCreateLayer from "@/components/Filters/BtnCreateLayer.vue";
import LayerListControls from "@/components/LayerPanel/LayerListControls.vue";

// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  emits: ["open-edit-dialog"],
  components: {
    InputField,
    DashArrayInput,
    ColorField,
    DeleteButton,
    VisibilityButton,
    EditButton,
    BtnCreateLayer,
    LayerListControls,
  },
  props: {
    datasource: Object,
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  methods: {
    ...mapActions(useAppStore, ["removeLayer", "setPaintProperties"]),
    delete: function (layer) {
      this.removeLayer(this.datasource.source_id, layer.id);
    },
    handleEvent: function (layer) {
      this.$refs.filterDialog.openDialog(layer);
    },
    updateProperties(update) {
      this.setPaintProperties(update.layer_id, update.properties);
    },
  },
};
</script>

<style>
.test {
  margin-left: 25px;
}

.dataset-container {
  border: 1px solid #e0e0e0;
}
</style>
