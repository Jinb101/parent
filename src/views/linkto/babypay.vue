<template>
  <div class="linkto"></div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      let params = this.$route.params;
      // 获取token
      let token = demo.$local.get("token");
      let url = this.$js.wxshareh5("babypayindex", {
        token,
        sid: params.id || "",
      });
      if (this.$js.env) {
        console.log(url);
        return 0;
      }
      window.location.replace(url);
    },
  },
  mounted() {
    demo.$local.set("babypay", Date.now());
    this.$toast.loading({ duration: 0 });
    this.$api.http("user", {}, (r) => {
      demo.$local.clear("babypay");
      this.init();
    });
  },
  destroyed() {
    this.$toast.clear();
  },
};
</script>
<style lang='less' scoped>
</style>
