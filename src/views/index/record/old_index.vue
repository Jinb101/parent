<template>
  <div class="record">
    <iframe :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
      times: Date.now(),
      url: "",
    };
  },
  inject: ["appGetParams"],
  computed: {
    urls() {
      let u = {
        id: this.appGetParams("id"),
        token: this.$demo.$local.get("token", ""),
        time: this.times,
        api: encodeURIComponent(this.api),
        type: "parent",
        theme: "theme1",
      };
      let s = [];
      Object.keys(u).forEach((k) => {
        s.push(k + "=" + u[k]);
      });
      return "?" + s.join("&");
    },
    api() {
      let u = this.$js.env
        ? window.location.origin + this.$js.api.http
        : this.$js.api.http;
      return u;
    },
  },
  methods: {
    getuser() {
      return new Promise((resolve) => {
        this.$api.http("user", {}, () => {
          resolve(1);
        });
      });
    },
    async topath(h5) {
      let a = await this.getuser();
      if (this.$js.env) {
        this.url = h5;
        return 0;
      }
      // 请求一次user 查看是否登录过期
      this.url = this.$js.api.h5 + "h5/contact_book/?h5=" + h5;
    },
  },
  mounted() {
    let tps = this.appGetParams("tps");
    if (tps === "show") {
      this.times = this.$demo.timeout(this.appGetParams("timeout"), "zero");
    }
    let val = {
      id: this.appGetParams("id"),
      token: this.$demo.$local.get("token", ""),
      time: this.times,
      api: encodeURIComponent(this.api),
      status: false,
    };
    let h5 = this.$demo.es6().encrypt(val);
    this.topath(h5);
  },
};
</script>
<style lang='less' scoped>
.record {
  iframe {
    display: block;
    width: 100%;
    height: calc(100% - 46px);
  }
  section {
    padding: 5px 0;
    h5 {
      padding: 10px;
      font-size: 15px;
      font-weight: 650;
      b {
        flex: 1;
      }
    }
  }
}
</style>
