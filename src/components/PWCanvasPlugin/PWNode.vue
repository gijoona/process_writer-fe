<template>
  <g @click="onClick" @auxclick="onRightClick" @contextmenu.prevent>
    <defs>
      <marker
        :id="'nodeMarker' + dept"
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
      fill="black"
      :font-size="fontSize"
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
    dept: {
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
      fontSize: 28,
    };
  },
  computed: {
    rect_x() {
      return this.horizontal
        ? this.gap + (this.x + this.gap) * this.dept
        : this.x;
    },
    rect_y() {
      return this.horizontal
        ? this.y
        : this.gap + (this.y + this.gap) * this.dept;
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
  },
  methods: {
    onClick() {
      this.$emit("onClick", this.node);
    },
    onRightClick() {
      console.log("not left click.");
    },
  },
};
</script>