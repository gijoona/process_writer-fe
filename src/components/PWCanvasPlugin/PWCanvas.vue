<template>
  <v-container @contextmenu.prevent="showContextmenu">
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
        @onContextmenu="nodeContextmenu"
      ></PWNode>
    </svg>
    <PWContextmenu :opts="contextmenuOpts" @click="callNodeProcess"/>
  </v-container>
</template>
<script>
import PWNode from "./PWNode.vue";
import PWContextmenu from './PWContextmenu.vue'

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
      node: {},
      nodes: [],
      pathDirection: "M0,0 L0,0",
      contextmenuOpts: {
        show: false,
        x: 0,
        y: 0
      }
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
    replaceNode(oNode, rNode, nodes){
      console.log('into replaceNode');
      nodes.forEach((node, idx) => {
        if (node === oNode) {
          console.log('match');
          node = rNode;
          return false;
        } else if (node.pw_nodes) {
          console.log('next pw_nodes');
          this.replaceNode(oNode, rNode, node.pw_nodes);
        }
      });
    },
    drawPath() {
      // TODO :: firefox에서 PATH가 안그려지는 증상 발생
      let markers = document.getElementsByName("nodeMarker");
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
    nodeContextmenu(data) {
      this.showContextmenu(data.event);
      this.node = data.node;
    },
    showContextmenu(e) {
      this.node = {};
      this.contextmenuOpts = {
        show: true,
        x: e.clientX,
        y: e.clientY
      }
    },
    callNodeProcess(cmd) {
      if (cmd === "plus") this.nodePlus();
      if (cmd === "branch") this.nodeBranch();
      if (cmd === "delete") this.nodeDelete();
    },
    nodePlus() {
      let newNode = { subject: '', contents: '', pw_nodes: [this.node] };
      this.replaceNode(this.node, newNode, this.pwNodes);
    },
    nodeBranch() {
      console.log("add branch");
    },
    nodeDelete() {
      if(confirm("하위노드까지 전부 삭제하시겠습니까?")) console.log("all delete");
      else console.log("single delete");
    }
  },
  mounted() {
    this.$watch("pwNodes", this.initCanvas, { immediate: true });
  },
  components: {
    PWNode: PWNode,
    PWContextmenu: PWContextmenu
  },
};
</script>
<style scoped>
.container {
  height: 100%;
}
</style>
