<template>
  <span class="text-body-2">{{ propertyLabel }}</span>
  <input
    v-model="value"
    type="number"
    id="name"
    name="name"
    class="pa-1 attribute-text-field text-caption"
    v-on:change="setValue"
  />
</template>

<script>
export default {
  emits: ["update-property"],
  props: {
    property: Object,
  },
  data() {
    return {
      value: 0,
    };
  },
  computed: {
    propertyLabel() {
      return this.property.property.split("-")[1];
    },
  },
  mounted() {
    this.value = this.property.value;
  },
  watch: {
    value: function () {
      let update = { layer_id: this.property.layer_id, properties: {} };

      let new_value = this.value === "" ? 0 : this.value;
      update.properties[this.property.property] = new_value;
      this.$emit("update-property", update);
    },
  },
};
</script>
<style>
.attribute-text-field {
  width: 35px;
  height: 20px;
  border: 1px solid rgb(207, 205, 205);
  border-radius: 1px;
  box-sizing: border-box;
  text-align: center;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
