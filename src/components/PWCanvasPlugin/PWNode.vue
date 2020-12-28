<template>
  <g @click="onClick" @contextmenu.stop.prevent="onRightClick">
    <defs>
      <marker
        :id="'nodeMarker_' + node_branch + '_' + node_deep"
        name="nodeMarker"
        markerWidth="8"
        markerHeight="8"
        :refX="cx"
        :refY="cy"
      >
        <circle :cx="cx" :cy="cy" r="3" style="stroke: none; fill:#000000;" />
      </marker>
    </defs>
    <rect
      id="rect"
      :x="rect_x"
      :y="rect_y"
      :rx="round_x"
      :ry="round_y"
      :width="node_width"
      :height="node_height"
      :style="'fill:' + node_fill + '; stroke:' + node_stroke + '; stroke-width: 2;'"
    ></rect>
    <text
      :fill="bdnum_color"
      :font-size="bdnum_fontsize"
      :x="bdnum_x"
      :y="bdnum_y"
      dominant-baseline="hanging"
    >
      {{ node_bdnum }}
    </text>
    <text
      :fill="subject_color"
      :font-size="subject_fontsize"
      :x="subject_x"
      :y="subject_y"
      dominant-baseline="middle"
      text-anchor="middle"
    >
      {{ node_subject }}
    </text>
  </g>
</template>
<script>
export default {
  name: "PWNode",
  props: {
    node: {
      type: Object,
      default: () => { return { subject: '', deep: 0, branch: 0 }; },
    },
    horizontal: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      x: 100,
      y: 100,
      rx: 10,
      ry: 10,
      gap: 20,
      branch: 0,
      deep: 0,
      width: 100,
      height: 70,
      fill: 'white',
      stroke: 'black',
      subject: {
        text: '',
        color: 'black',
        size: 28
      },
      bdnum: {
        text: '',
        color: 'gray',
        size: 12
      }
    };
  },
  computed: {
    node_gap() {
      return this.node.gap ? this.node.gap : this.gap;
    },
    rect_x() {
      return this.horizontal
        ? this.node_gap + (this.x + this.node_gap) * this.node_deep
        : this.node_gap + (this.x + this.node_gap) * this.node_branch;
    },
    rect_y() {
      return this.horizontal
        ? this.node_gap + (this.y + this.node_gap) * this.node_branch
        : this.node_gap + (this.y + this.node_gap) * this.node_deep;
    },
    cx() {
      return this.rect_x + this.node_width / 2;
    },
    cy() {
      return this.rect_y + this.node_height / 2;
    },
    round_x() {
      return this.rx;
    },
    round_y() {
      return this.ry;
    },
    node_bdnum() {
      // branch-deep number
      return `${this.node_branch}-${this.node_deep}`;
    },
    bdnum_x() {
      return this.cx - this.node_width / 2;
    },
    bdnum_y() {
      return this.cy - this.node_height / 2;
    },
    bdnum_color() {
      return this.bdnum.color;
    },
    bdnum_fontsize() {
      return this.bdnum.size;
    },
    node_fill() {
      return this.node.fill ? this.node.fill : this.fill;
    },
    node_stroke() {
      return this.node.stroke ? this.node.stroke : this.stroke;
    },
    node_width() {
      return this.node.width ? this.node.width : this.width;
    },
    node_height() {
      return this.node.height ? this.node.height : this.height;
    },
    node_deep() {
      return this.node.deep ? this.node.deep : this.deep;
    },
    node_branch() {
      return this.node.branch ? this.node.branch : this.branch;
    },
    node_subject() {
      return this.subject.text;
    },
    subject_color() {
      return this.subject.color;
    },
    subject_fontsize() {
      return this.subject.size;
    },
    subject_x() {
      return this.cx;
    },
    subject_y() {
      return this.cy;
    },
  },
  methods: {
    onClick() {
      this.$emit("onClick", this.node);
    },
    onRightClick(e) {
      this.$emit("onContextmenu", { node: this.node, event: e });
    },
    mergeObject(objNm) {
      return Object.assign(this[objNm], this.node[objNm] instanceof Object ? this.node[objNm] : { 'text': this.node[objNm] ?? '' });
    }
  },
  mounted() {
    this.mergeObject('subject');
    this.mergeObject('bdnum');
  }
};
</script>
