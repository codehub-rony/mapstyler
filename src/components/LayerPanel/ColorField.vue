<template>
  <span class="text-body-2">{{ propertyLabel }}</span>
  <div
    class="layerlist-item-color"
    v-bind:style="{ backgroundColor: rgba }"
    @click="handleClick"
  >
    <div class="color-selector-container">
      <v-scroll-y-transition>
        <v-color-picker
          class="color-selector"
          v-model="color"
          show-swatches
          :modes="['rgba']"
          rounded="0"
          elevation="0"
          width="100%"
          @update:modelValue="handleColorSelection"
          v-if="colorPickerIsOpen"
          v-click-outside="closeColorPicker"
        ></v-color-picker>
      </v-scroll-y-transition>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["color-updated"],
  props: {
    property: Object,
  },
  computed: {
    rgba() {
      return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a}`;
    },
    propertyLabel() {
      return this.property.property.split("-")[1];
    },
  },
  data() {
    return {
      color: { r: 0, g: 0, b: 0, a: 1 },
      swatches: [
        ["#a6611a", "#f5f5f5", "#c2a5cf"],
        ["#fdae61", "#d7191c", "#dfc27d"],
        ["#2c7bb6", "#abd9e9", "#bababa"],
        ["#1a9641", "#a6d96a", "#ffffbf"],
      ],
      colorPickerIsOpen: false,
    };
  },
  mounted() {
    this.setColorFromProperty(this.property.value);
  },

  methods: {
    parseRGB(rgbString) {
      const result = rgbString.match(/\d+/g); // extract all numbers
      if (result && result.length === 3) {
        return {
          r: parseInt(result[0]),
          g: parseInt(result[1]),
          b: parseInt(result[2]),
        };
      }
      return null;
    },

    setColorFromProperty(property) {
      const rgb = this.parseRGB(property);
      if (rgb) {
        this.color.r = rgb.r;
        this.color.g = rgb.g;
        this.color.b = rgb.b;
      }
    },
    handleClick: function (e) {
      // Prevent colorpicker from closing when the colorpicker itself is clicked
      if (e.target.classList.contains("layerlist-item-color")) {
        this.colorPickerIsOpen = this.colorPickerIsOpen ? false : true;
      }
    },
    handleColorSelection: function (e) {
      this.color.a = this.color.a ? Math.round(this.color.a * 100) / 100 : 1;

      let updated_color = { layer_id: this.property.layer_id, properties: {} };
      updated_color.properties[this.property.property] =
        `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      updated_color.properties[
        this.property.property.includes("fill")
          ? "fill-opacity"
          : "line-opacity"
      ] = this.color.a;

      this.$emit("color-updated", updated_color);
    },
    closeColorPicker: function () {
      if (this.colorPickerIsOpen) {
        this.colorPickerIsOpen = false;
      }
    },
  },
};
</script>
<style>
.layerlist-item-color {
  cursor: pointer;
  height: 20px;
  width: 35px;
  border: 1px solid rgb(197, 197, 197);
  z-index: 130;
}
.color-selector-container {
  position: relative;
  z-index: 120;
}
.color-selector {
  position: absolute;
  min-width: 250px;
  left: 35px;
  z-index: 120;
  border: 1px solid #e0e0e0;
}
</style>
