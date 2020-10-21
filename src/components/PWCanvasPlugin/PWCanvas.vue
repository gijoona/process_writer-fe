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
        :deep="node.deep"
        :branch="node.branch"
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
import PWCard from "./PWCard.vue";
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
      },
      nodeDeeps: 0,
      searchDeeps: 0
    };
  },
  methods: {
    async initCanvas(data) {
      this.nodes = [];
      await this.generateNodes(data);
      this.drawPath();
    },
    generateNodes(data) {
      data.forEach((node, idx) => {
        this.nodeDeeps++;
        this.nodes.push(node);
        if (node.pw_nodes) this.generateNodes(node.pw_nodes);
      });
    },
    searchNodeDeeps(oNode, nodes){
      nodes.forEach((node, idx) => {
        this.searchDeeps++;
        if (node === oNode) {
          return false;
        } else if (node.pw_nodes) {
          this.searchNodeDeeps(oNode, node.pw_nodes);
        }
      });
    },
    // TODO :: Node 삭제처리를 위한 기능 개선 필요.
    changeNode(oNode, rNode, nodes) {
      nodes.forEach((node, idx) => {
        if (node === oNode) {
          if (rNode) { 
            node = rNode; 
          } else { 
            node = null; 
          }
          return false;
        }
        this.changeNode(oNode, rNode, (node.pw_nodes || []));
      });
    },
    replaceNode(oNode, rNode, nodes) {
      this.changeNode(oNode, rNode, nodes);
      this.initCanvas(nodes);
    },
    // 기존 추가, 분기, 삭제처리 로직. 단일 패스에 대한 처리만 가능하므로 changeNode로 기능 이전 및 개선 진행. 이후 삭제
    // replaceNode(oNode, rNode, nodes){
    //   let currNode = nodes;
    //   while(0 < currNode.length) {
    //     if (currNode[0] === oNode) {
    //       if (rNode) { currNode[0] = rNode; }
    //       else { delete currNode[0]; }
    //       break;
    //     }
    //     currNode = currNode[i].pw_nodes || [];
    //   }
    //   this.initCanvas(nodes);
    // },
    updateNodeDeep(nodes, num) {
      nodes.forEach((node, idx) => {
        node.deep = node.deep + num;
        if (node.pw_nodes) this.updateNodeDeep(node.pw_nodes, num);
      });
    },
    updateNodeBranch(nodes, num) {
      nodes.forEach((node, idx) => {
        node.branch = node.branch + num;
        if (node.pw_nodes) this.updateNodeBranch(node.pw_nodes, num);
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
      let plusNode = this.node;
      if (this.node.pw_nodes) this.updateNodeDeep(this.node.pw_nodes, 1);

      let childNodes = [Object.assign({}, plusNode, { subject: '', contents: '', deep: (plusNode.deep + 1)})];
      plusNode.pw_nodes = childNodes;
      this.replaceNode(this.node, plusNode, this.pwNodes);
    },
    nodeBranch() {
      let branchNode = this.node;
      if (this.node.pw_nodes) this.updateNodeBranch(this.node.pw_nodes, 1);

      let appendNode = { subject: '', contents: '', deep: (branchNode.deep + 1), branch: branchNode.branch };
      branchNode.pw_nodes.push(appendNode);

      this.replaceNode(this.node, branchNode, this.pwNodes);
    },
    nodeDelete() {
      if(confirm("하위노드까지 전부 삭제하시겠습니까?")) {
        this.replaceNode(this.node, null, this.pwNodes);
      }
      else {
        let childNode = this.node.pw_nodes;
        if (childNode) this.updateNodeDeep(childNode, -1);
        this.replaceNode(this.node, childNode, this.pwNodes);
      }
    }
  },
  mounted() {
    this.$watch("pwNodes", this.initCanvas, { immediate: true });
  },
  components: {
    PWNode: PWNode,
    PWCard: PWCard,
    PWContextmenu: PWContextmenu
  },
};
</script>
<style scoped>
.container {
  height: 100%;
}
</style>
