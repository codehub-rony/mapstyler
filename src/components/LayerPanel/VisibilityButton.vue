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
    handleClick: function () {
      this.isVisible = this.isVisible ? false : true;
      let update = {
        layer_id: this.layer.id,
        properties: { visibility: this.isVisible ? "visible" : "none" },
      };
      this.emitter.emit("set-layout-properties", update);
    },
  },
};
</script>
