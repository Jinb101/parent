<template>
  <div class="video_class">
    <div class="poster" :style="avs">
      <div class="video vc" v-if="!show">
        <van-loading type="spinner" :color="theme.bgc" size="35">
          <b v-if="!text">
            正在为您请求，请耐心等待！{{ index > 0 ? index : "" }}
          </b>
          <b v-else class="col_danger">{{ text }}</b>
        </van-loading>
      </div>
      <div :id="ids" v-show="show" class="video"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ids: { type: String, default: "cute-player" },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    wh: {
      type: Object,
      default: () => {
        return {};
      },
    },
    timeout: { type: Number, default: 30 },
  },
  data() {
    return {
      video: null,
      player: false,
      poster: "",
      url: "",
      show: false,
      tm: null,
      index: 0,
      theme: {},
      text: "",
    };
  },
  computed: {
    avs() {
      return this.wh;
    },
  },
  watch: {
    item: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  inject: ["appGetTheme"],
  methods: {
    timer() {
      if (this.tm) {
        clearInterval(this.tm);
        this.tm = null;
      }
      this.tm = setInterval(() => {
        this.index++;
        if (this.index >= this.timeout) {
          this.error();
        }
      }, 1e3);
    },
    error(f) {
      if (!f) {
        this.text = "地址失效,请联系管理员";
        this.$model.info(this.text, 2);
      } else {
        this.text = "";
      }
      if (this.tm) {
        clearInterval(this.tm);
        this.tm = null;
      }
    },
    init() {
      let url = this.item.src || "";
      let pic = this.item.pic || "";
      if (!url) return 0;
      this.poster = pic;
      this.show = false;
      if (this.video) {
        this.video.plugins.hls && this.video.plugins.hls.destroy();
        this.video.switchVideo({ url, pic });
        return 0;
      }
      // eslint-disable-next-line
      this.video = new DPlayer({
        container: this.$demo.$.id(this.ids),
        video: { url, pic, type: "hls" },
        live: true,
      });
      let that = this;
      try {
        that.video.on("timeupdate", () => {
          let time = that.video && that.video.video.currentTime;
          that.$emit("time", time);
          if (time === 0) {
            that.$model.info("加载需要时间，请耐心等待", 2);
            that.index = 0;
            that.text = "";
            that.timer();
          }
        });
        if (this.$demo.$web === 2) {
          setTimeout(() => {
            if (!this.show) {
              this.show = true;
            }
          }, 3000);
        }
      } catch (e) {}
      that.video.on("canplay", () => {
        that.$emit("play");
        that.show = true;
        that.error(1);
      });
      that.video.on("ended", () => {
        that.$emit("end");
      });
      that.video.on("error", () => {
        that.$emit("error");
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.init();
  },
  destroyed() {
    if (this.video) {
      this.video.plugins.hls && this.video.plugins.hls.destroy();
      this.video = null;
    }
    if (this.tm) {
      clearInterval(this.tm);
      this.tm = null;
    }
  },
};
</script>
<style lang='less' scoped>
.poster {
  width: 100%;
  height: 100%;
  position: relative;
  .video {
    display: block;
    width: 100%;
    height: 100%;
  }
  .vc {
    background-color: #f5f5f5;
    box-sizing: border-box;
    padding: 15px;
    text-align: center;
    padding-top: 80px;
  }
}
</style>
