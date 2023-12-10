<template>
  <div class="code"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  inject: ["appGetParams", "appPath"],
  methods: {
    init() {
      this.$api.http("setOpenid", { code: this.appGetParams("code") }, () => {
        this.$toast("绑定成功");
        this.$demo.$session.clear("app-time-user");
        this.appPath("/");
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
