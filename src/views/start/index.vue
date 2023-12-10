<template>
  <div></div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  inject: ["appPath"],
  methods: {
    init() {
      this.$toast.loading({ duration: 0 });
      let params = demo.getUrl();
      params.id && demo.$local.set("nid", params.id);
      if (params.token) {
        demo.$local.set("token", params.token);
        demo.$session.reset();
        this.toindex("link");
        return 0;
      }
      let token = demo.$local.get("token");
      let url = window.location.href;
      // let user = demo.$session.get("user", {});
      if (!token) {
        // 一键登录
        this.setdata({}, (tp) => {
          if (tp === "wx") {
            this.$js.wxlogin();
          } else {
            this.appPath("/login");
          }
        });
        return "";
      }else if (token && url.indexOf("tulis") > -1){
        this.appPath("index");
        return 0
      }
      this.toindex("index");
    },
    toindex(by) {
      this.setdata({ by }, () => {
        this.$nextTick(() => {
          this.appPath("/index");
        });
      });
    },
    setdata(obj = {}, fn) {
      let iswx = demo.es6().isWx();
      let os = {
        by: iswx ? "wx" : "login",
        time: Date.now(),
        ...obj,
      };
      demo.$local.set("login-status-data-check", os);
      fn ? fn(os.by) : null;
    },
  },

  mounted() {
    this.init();
  },
  destroyed() {
    this.$toast.clear();
  },
};
</script>
<style lang='less' scoped>
</style>
