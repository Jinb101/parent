<template>
  <v-view header></v-view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onsubmitpush() {
      let os = {
        type: "push",
        id: this.$route.params.id,
        nid: this.$demo.$local.get("nid"),
        token: this.$demo.$local.get("token"),
        checkcode: true,
      };
      if (!os.id) return this.$toast("错误数据");
      let user = this.$demo.$session.get("user", {});
      if (user.openid) {
        os.openid = user.openid;
      }
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = this.$js.api.h5 + "h5/poster/?type=push&h5=" + a;
      if (!this.$demo.es6().isWx()) {
        console.log(url);
        return 0;
      }
      window.location.href = url;
    },
  },
  mounted() {
    this.onsubmitpush();
  },
};
</script>
<style lang='less' scoped>
</style>
