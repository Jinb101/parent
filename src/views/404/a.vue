<template>
  <div class="aaa">
    <v-c :item="{ src }"></v-c>
  </div>
</template>

<script>
import vC from "../private/video3.vue";
export default {
  data() {
    return {
      src: "",
    };
  },
  components: { vC },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
