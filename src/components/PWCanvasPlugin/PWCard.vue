<template>
	<v-card
    class="mx-auto"
    outlined
  >
    <v-card-title>
      <v-text-field v-model="nodeInfo.subject"></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-textarea outlined v-model="nodeInfo.contents"></v-textarea>
    </v-card-text>
    <!-- <v-divider></v-divider>
    <v-card-actions>
      <v-btn outlined rounded text>닫기</v-btn>
    </v-card-actions> -->
  </v-card>
</template>
<script>
  export default {
    name: 'PWCard',
    props: {
      nodeInfo: {
        type: Object,
        default: () => { return {subject: '', contents: ''}; }
      }
    },
    data() {
      return {}
    },
    watch: {
      nodeInfo: {
        deep: true,
        handler(val) {
          this.$emit('update:nodeInfo', val);
        }
      }
    }
  }
</script>