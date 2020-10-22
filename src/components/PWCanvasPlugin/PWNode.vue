<template>
  <g @click="onClick" @contextmenu.stop.prevent="onRightClick">
    <defs>
      <marker
        :id="'nodeMarker' + deep"
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
      :width="ractWidth"
      :height="ractHeight"
      style="fill:white; stroke:black; stroke-width:2;"
    ></rect>
    <text
      fill="gray"
      :font-size="subFontSize"
      :x="sub_cx"
      :y="sub_cy"
      dominant-baseline="middle"
    >
      {{ sub_text }}
    </text>
    <text
      fill="black"
      :font-size="titleFontSize"
      :x="cx"
      :y="cy"
      dominant-baseline="middle"
      text-anchor="middle"
    >
      {{ node.subject }}
    </text>
  </g>
</template>
<script>
export default {
  name: "PWNode",
  props: {
    node: {
      type: Object,
      default: () => {},
    },
    deep: {
      type: Number,
      default: () => 0,
    },
    branch: {
      type: Number,
      default: () => 0,
    },
    gap: {
      type: Number,
      default: () => 20,
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
      ractWidth: 100,
      ractHeight: 70,
      titleFontSize: 28,
      subFontSize: 12
    };
  },
  computed: {
    rect_x() {
      return this.horizontal
        ? this.gap + (this.x + this.gap) * this.deep
        : this.gap + (this.x + this.gap) * this.branch;
    },
    rect_y() {
      return this.horizontal
        ? this.gap + (this.y + this.gap) * this.branch
        : this.gap + (this.y + this.gap) * this.deep;
    },
    round_x() {
      return this.rx;
    },
    round_y() {
      return this.ry;
    },
    cx() {
      return this.rect_x + this.ractWidth / 2;
    },
    cy() {
      return this.rect_y + this.ractHeight / 2;
    },
    sub_cx() {
      return this.cx - 45;
    },
    sub_cy() {
      return this.cy - 23;
    },
    sub_text() {
      return this.node.branch + "-" + this.node.deep
    }
  },
  methods: {
    onClick() {
      this.$emit("onClick", this.node);
    },
    onRightClick(e) {
      this.$emit("onContextmenu", { node: this.node, event: e });
    },
  },
};
</script>
