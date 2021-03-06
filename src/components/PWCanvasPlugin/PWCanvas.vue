<template>
  <v-container @contextmenu.prevent="showContextmenu">
    <svg id="canvas" :viewBox="svgViewBox" xmlns="http://www.w3.org/2000/svg" overflow="auto">
      <path v-for="(pathDirection, idx) in pathDirections" :key="'path' + idx" name="paths"
        :d="pathDirection"
        style="stroke: #6666ff; stroke-width: 1px; fill: none;"
      />
      <PWNode
        v-for="(node, idx) in nodes"
        :node="node"
        :key="idx"
        @onClick="showContents"
        @onContextmenu="nodeContextmenu"
      ></PWNode>
    </svg>
    <PWContextmenu :opts="contextmenuOpts" @click="callNodeProcess"/>
    <v-dialog
      v-model="dialog"
      max-width="50%"
    >
      <PWCard :node-info.sync="node"></PWCard>
    </v-dialog>
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
      parentNode: {},
      nodes: [],
      pathDirections: [],
      contextmenuOpts: {
        show: false,
        x: 0,
        y: 0
      },
      maxDeep: 0,
      maxBranch: 0,
      searchDeeps: 0,
      dialog: false
    };
  },
  computed: {
    svgViewBox() {
      let width = 140 * (this.maxBranch + 1) > 500 ? 140 * (this.maxBranch + 1) : 500;
      let height = 120 * (this.maxDeep + 1) > 400 ? 120 * (this.maxDeep + 1) : 400;
      return `0 0 ${width} ${height}`;
    }
  },
  methods: {
    async initCanvas(data) {
      this.maxDeep = 0;
      this.nodes = [];
      await this.generateNodes(data);
      this.drawPath();
    },
    generateNodes(data) {
      data.forEach((node, idx) => {
        if (node.deep > this.maxDeep) this.maxDeep = node.deep;
        if (node.branch > this.maxBranch) this.maxBranch = node.branch;

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
    findParentNode(cNode, nodes) {
      this.parentNode = cNode.parent_node;
    },
    // TODO :: Node 삭제처리를 위한 기능 개선 필요.
    changeNode(oNode, rNode, nodes) {
      nodes.forEach((node, idx) => {
        if (node === oNode) {
          if (rNode) { 
            node = rNode;
          }
          return false;
        }
        this.changeNode(oNode, rNode, (node.pw_nodes ?? []));
      });
    },
    replaceNode(oNode, rNode, nodes) {
      this.changeNode(oNode, rNode, nodes);
      this.initCanvas(nodes);
    },
    updateNodeDeep(nodes, num = 1) {
      nodes.forEach((node, idx) => {
        node.deep = node.deep + num;
        if (node.pw_nodes) this.updateNodeDeep(node.pw_nodes, num);
      });
    },
    updateNodeBranch(nodes, num = 1) {
      nodes.forEach((node, idx) => {
        node.branch = node.branch + num;
        if (node.pw_nodes) this.updateNodeBranch(node.pw_nodes, num);
      });
    },
    shiftNodeBranch(nodes, currBranch) {
      console.log(currBranch);
      nodes.forEach((node, idx) => {
        if (node.branch >= currBranch) {
          node.branch++;
          if (node.pw_nodes) this.shiftNodeBranch(node.pw_nodes, currBranch);
        }
      });
    },
    drawPath() {
       this.clearPath();

      this.nodes.forEach((node, idx) => {
        if (node.parent_node) {
          let pm = document.getElementById(`nodeMarker_${node.parent_node.branch}_${node.parent_node.deep}`);
          let cm = document.getElementById(`nodeMarker_${node.branch}_${node.deep}`);
          this.pathDirections.push(`M${pm.getAttribute('refX')},${pm.getAttribute('refY')} L${cm.getAttribute('refX')},${cm.getAttribute('refY')}`);
        }
      });
    },
    clearPath() {
      let canvas = document.getElementById("canvas");
      canvas.querySelectorAll('path').forEach(n => n.remove());
    },
    showContents(data) {
      this.findParentNode(data);
      this.dialog = true;
      this.node = data;
    },
    nodeContextmenu(data) {
      this.findParentNode(data.node);
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
      // TODO :: 부모 노드에서 자식 Branch 생성 후 다시 부모 노드에서 추가를 하면 자식 Branch가 부모의 부모 노드를 바라보는 증상. 개선 필요.
      let plusNode = this.node;
      let childNodes = [{...plusNode, ...{ parent_node: this.node, subject: '', contents: '', deep: (plusNode.deep + 1)}}];
      if (plusNode.pw_nodes) {
        this.updateNodeDeep(plusNode.pw_nodes);
      }
      plusNode.pw_nodes = childNodes;
      this.replaceNode(this.node, plusNode, this.pwNodes);
    },
    nodeBranch() {
      let branchNode = this.node;
      let branchNum = branchNode.branch;
      if (this.node.pw_nodes) branchNum += this.node.pw_nodes.length;

      this.shiftNodeBranch(this.pwNodes, branchNum);

      let appendNode = { parent_node: this.node, subject: '', contents: '', deep: (branchNode.deep + 1), branch: branchNum };
      branchNode.pw_nodes.push(appendNode);

      this.replaceNode(this.node, branchNode, this.pwNodes);
    },
    nodeDelete() {
      let deleteNodeIdx = this.parentNode.pw_nodes.findIndex((cNode) => this.node === cNode);
      // STEP1. 하위노드가 있는 경우
      // STEP1-1. 하위노드까지 삭제하는 경우
      // STEP1-2. 하위노드는 유지하는 경우
      // STEP1-2-1. 하위노드가 단일 Branch일 경우
      // STEP1-2-2. 하위노드의 다중 Branch일 경우
      // STEP2. 하위노드가 없는 경우

      if (this.parentNode.pw_nodes[deleteNodeIdx].pw_nodes) {
        // STEP1
        if(confirm("하위노드까지 전부 삭제하시겠습니까?")) {
          // STEP1-1
          let tempNodes = [];
          this.parentNode.pw_nodes.forEach((node, idx) => {
            if (idx !== deleteNodeIdx) {
              if (idx > deleteNodeIdx) {
                node.branch -= 1;
                if (node.pw_nodes) this.updateNodeBranch(node.pw_nodes, -1);
              }
              tempNodes.push(node);
            }
          });
          this.parentNode.pw_nodes = tempNodes;
        } else {
          // STEP1-2
          let parent = this.parentNode.pw_nodes[deleteNodeIdx].parent_node;
          let childNodes = this.parentNode.pw_nodes[deleteNodeIdx].pw_nodes;
          this.updateNodeDeep(childNodes, -1);
          if (childNodes.length === 1) {
            // STEP1-2-1
            this.parentNode.pw_nodes.push(childNodes[0]);
          } else if(childNodes.length >= 1) {
            // STEP1-2-2
            let tmpNodes = [];
            let plusNum = 0;
            this.parentNode.pw_nodes.forEach((node, idx) => {
              node.branch = node.branch + plusNum;
              if (idx === deleteNodeIdx) {
                plusNum = childNodes.length - 1;
                childNodes.forEach((cNode, idx) => {
                  cNode.parent_node = parent;
                  tmpNodes.push(cNode);
                });
              } else {
                tmpNodes.push(node);
              }
            });

            this.parentNode.pw_nodes = tmpNodes;
          }
        }
      } else {
        // STEP2
        delete this.parentNode.pw_nodes[deleteNodeIdx];
        let tempNodes = [];
        this.parentNode.pw_nodes.forEach((node, idx) => {
          if (idx !== deleteNodeIdx) {
            if (idx > deleteNodeIdx) {
              node.branch -= 1;
              if (node.pw_nodes) this.updateNodeBranch(node.pw_nodes, -1);
            }
            tempNodes.push(node);
          }
        });
        this.parentNode.pw_nodes = tempNodes;
      }
      this.replaceNode(this.node, null, this.pwNodes);
    }
  },
  mounted() {
    this.$watch("pwNodes", this.initCanvas, { immediate: true, deep: true });
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
