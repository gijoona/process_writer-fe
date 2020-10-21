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
          deep: 0,
          branch: 0,
          pw_nodes: [
            {
              subject: "node1-1",
              contents: "contents1-1",
              deep: 1,
              branch: 0,
              pw_nodes: [
                {
                  subject: "node1-1-1",
                  contents: "contents1-1-1",
                  deep: 2,
                  branch: 0
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
