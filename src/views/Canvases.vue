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
        {
          subject: "node1",
          contents: "contents1",
          pw_nodes: [
            {
              subject: "node1-1",
              contents: "contents1-1",
              pw_nodes: [
                {
                  subject: "node1-1-1",
                  contents: "contents1-1-1",
                },
              ],
            },
          ],
        },
      ];
    },
  },
  mounted() {
    this.init();
  },
};
</script>
