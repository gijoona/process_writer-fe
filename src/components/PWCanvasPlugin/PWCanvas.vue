<template>
  <v-container>
    <svg id="canvas" width="100%" height="100%">
      <path
        :d="pathDirection"
        style="stroke: #6666ff; stroke-width: 1px; fill: none;"
      />
      <PWNode
        v-for="(node, idx) in nodes"
        :node="node"
        :dept="idx"
        :key="idx"
        @onClick="showContents"
      ></PWNode>
    </svg>
  </v-container>
</template>
<script>
import PWNode from "./PWNode.vue";

export default {
  name: "PWCanvas",
  props: {
    pwNodes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      nodes: [],
      pathDirection: "M0,0 L0,0",
    };
  },
  methods: {
    async initCanvas(data) {
      await this.generateNodes(data);
      this.drawPath();
    },
    generateNodes(data) {
      data.forEach((node, idx) => {
        this.nodes.push(node);
        if (node.pw_nodes) this.generateNodes(node.pw_nodes);
      });
    },
    drawPath() {
      // TODO :: firefox에서 PATH가 안그려지는 증상 발생
      let markers = document.getElementsByName("nodeMarker");
      console.log(markers);
      if (markers) {
        let idx = 0;
        markers.forEach((marker) => {
          let prefix = idx === 0 ? "M" : "L";
          this.pathDirection +=
            prefix +
            marker.getAttribute("refX") +
            "," +
            marker.getAttribute("refY") +
            " ";
          idx++;
        });
      }
    },
    showContents(data) {
      console.log("showContents", data);
    },
  },
  mounted() {
    this.$watch("pwNodes", this.initCanvas, { immediate: true });
  },
  components: {
    PWNode: PWNode,
  },
};
</script>
<style scoped>
.container {
  height: 100%;
}
</style>
