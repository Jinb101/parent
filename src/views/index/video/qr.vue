<template>
  <div class="qrcode">
    <span class="c"> </span>
    <div class="head">
      <h6>扫码观看宝贝在线</h6>
      <p>更清晰</p>
    </div>
    <div class="code" @click.stop="onshow">
      <div id="qr-code-scan" ref="codes"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    urls: String,
  },
  inject: ["appShowImage"],
  data() {
    return {
      qr: null,
    };
  },
  methods: {
    init() {
      demo.js("#qr-code-scan").html("");
      let w = this.$refs.codes;
      let s = w.clientHeight;
      this.qr = new QRCode(demo.$.id("qr-code-scan"), {
        text: this.urls,
        width: s,
        height: s,
        colorDark: "#222",
        colorLight: "#fff",
      });
      if (this.$js.env) {
        console.log(this.urls);
      }
    },
    onshow() {
      let w = this.$refs.codes;
      let img = w.querySelector("img");
      let src = img.src;
      if (src) {
        this.appShowImage(src);
      } else {
        src = demo.js("#qr-code-scan img").attr("src");
        if (!src) {
          try {
            let c = w.querySelector("canvas");
            src = c.toDataURL("image/png");
            if (src) {
              this.appShowImage(src);
            } else {
              this.$toast("不支持放大预览");
            }
          } catch (err) {
            this.$toast("不支持放大预览");
          }
        } else {
          this.appShowImage(src);
        }
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
.qrcode {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 15px;
  position: relative;
  .c {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    clip-path: ellipse(100% 65% at 50% 0%);
    background-color: #38f;
    background: linear-gradient(180deg, #f1f4ff, #e1e7fa);
    img {
      display: block;
      height: 65%;
      width: 100%;
    }
  }
  .head {
    position: relative;
    z-index: 5;
    width: 100%;
    padding: 20px 10% 30px;
    box-sizing: border-box;
    line-height: 1.2;
    h6 {
      font-weight: 600;
      font-size: 20px;
    }
    p {
      background-color: #222;
      padding: 4px 8px;
      color: #fff;
      font-size: 13px;
      display: inline-block;
      margin-top: 10px;
    }
  }
  .code {
    position: relative;
    z-index: 5;
    width: 200px;
    height: 200px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: 0 0 8px #ccc;
    border-radius: 10px;
    > div {
      position: relative;
      width: 100%;
      height: 100%;
    }
    & + p {
      position: relative;
      z-index: 5;
      margin-top: 10px;
      font-size: 14px;
      color: #666;
      opacity: 0.6;
      &::before,
      &::after {
        position: absolute;
        content: "";
        width: 30px;
        height: 1px;
        background-color: #666;
        opacity: 0.5;
        top: 0;
        bottom: 0;
        margin: auto;
      }
      &::before {
        left: -35px;
      }
      &::after {
        right: -35px;
      }
    }
  }
}
</style>
