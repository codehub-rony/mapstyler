<template>
  <v-btn
    variant="text"
    :icon="icon"
    color="grey"
    size="x-small"
    @click="handleClick"
  ></v-btn>
</template>
<script>
// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  props: {
    layer: Object,
  },
  data() {
    return {
      isVisible: true,
    };
  },
  computed: {
    icon() {
      return this.isVisible ? "mdi-eye-outline" : "mdi-eye-off-outline";
    },
  },
  methods: {
    ...mapActions(useAppStore, ["setLayoutProperties"]),
    handleClick: function () {
      this.isVisible = this.isVisible ? false : true;

      let properties = { visibility: this.isVisible ? "visible" : "none" };
      this.setLayoutProperties(this.layer.id, properties);
    },
  },
};
</script>
