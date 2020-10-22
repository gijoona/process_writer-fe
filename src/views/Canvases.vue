<template>
  <pw-canvas :pw-nodes="pwNodes" />
</template>

<script>
export default {
  name: "Canvases",
  data() {
    return {
      pwNodes: [],
    };
  },
  methods: {
    init() {
      this.pwNodes = [
        {"subject":"1","contents":"1","deep":0,"branch":0}
      ];
    },
  },
  mounted() {
    this.init();
  },
};
</script>
