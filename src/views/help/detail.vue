<template>
  <div class="help_detail">
    <v-tool-title :text="ext.problem"></v-tool-title>
    <div v-html="ext.content" class="app_frame_content"></div>
    <template v-if="ext.video">
      <div class="viewo">
        <v-p :item="[{ cover: '', img: ext.video }]"></v-p>
      </div>
    </template>
  </div>
</template>

<script>
import vP from "../private/video2.vue";
export default {
  data() {
    return {
      id: "",
      ext: {},
    };
  },
  components: { vP },
  watch: {
    id() {
      this.init();
    },
  },
  methods: {
    init() {
      this.$api.http("helpDetail", { problem_id: this.id }, (res) => {
        // console.log(res);
        this.ext = res;
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id;
  },
};
</script>
<style lang='less' scoped>
.help_detail {
  overflow-y: scroll;
}
.video {
  padding: 20px 0;
}
</style>
