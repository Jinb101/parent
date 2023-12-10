<template>
  <div class="lib_agree" :class="{ auto: auto }">
    <template v-if="auto">
      <v-tool-title
        text="用户登录协议"
        back
        @on-back="back"
        auto
      ></v-tool-title>
    </template>
    <template v-else>
      <v-tool-title></v-tool-title>
    </template>
    <div class="app_frame_content" v-html="cont"></div>
  </div>
</template>

<script>
export default {
  props: {
    auto: { type: Boolean, default: false },
  },
  data() {
    return {
      cont: "",
    };
  },
  methods: {
    back() {
      this.$emit("on-back");
    },
  },
  mounted() {
    this.$api.http("info", {}, (e) => {
      this.cont = e;
    });
  },
};
</script>
<style lang='less' scoped>
.lib_agree {
  &.auto {
    padding-top: 46px;
  }
}
</style>
