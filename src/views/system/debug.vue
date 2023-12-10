<template>
  <div class="sys_debug">
    <v-tool-title></v-tool-title>
    <div class="view" id="qr-debug-view"></div>
    <div class="pad">
      <van-checkbox v-model="des">是否开启调试</van-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qr: null,
      url: "",
      des: false,
      token: "",
    };
  },
  watch: {
    des() {
      this.qr.clear();
      this.qr.makeCode(this.setUrl());
    },
  },
  methods: {
    setUrl() {
      let c = window.location.href.split("#");
      c[0] += "&token=" + this.token;
      if (this.des) {
        c[0] += "&debug=1";
      }
      c = c[0];
      this.url = c;
      return c;
    },
  },
  mounted() {
    this.token = this.$demo.$local.get("token", "");
    // eslint-disable-next-line
    this.qr = new QRCode(this.$demo.$.id("qr-debug-view"), {
      text: this.setUrl(),
      width: 200,
      height: 200,
    });
  },
};
</script>
<style lang='less' scoped>
.sys_debug {
  .pad {
    padding: 15px;
  }
  .view {
    width: 200px;
    height: 200px;
    margin: 30px auto 20px;
  }
}
</style>
