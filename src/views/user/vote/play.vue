<template>
  <div class="play">
    <div class="click_once" v-if="!clickonce">
      <van-image :src="picurl" fit="cover"></van-image>
      <span class="play_circle" @click.stop="onstart"
        ><van-icon name="play-circle-o"
      /></span>
    </div>
    <div class="playd" :id="ids" v-else></div>
  </div>
</template>

<script>
export default {
  props: {
    ids: { type: String, default: "voteplay" },
    urls: String,
    pics: String,
    progress: [String, Number],
  },
  data() {
    return {
      player: null,
      src: "",
      num: 0,
      timer: null,
      maxnum: 1,
      once: false,
      cur: 0,
      clickonce: false,
      playonce: false,
    };
  },
  computed: {
    pro() {
      let a = this.maxnum;
      if (a <= 1) {
        a = 1000;
      }
      let b = this.num / a;
      return Math.ceil(b * 100);
    },
    picurl() {
      // eslint-disable-next-line
      return this.pics || siteConfig().icon("player", "player", ".jpg");
    },
  },
  watch: {
    urls() {
      this.init();
    },
    pro(n) {
      if (this.progress > 0 && n >= this.progress && !this.once) {
        this.once = true;
        if (this.cur > 0) {
          this.$emit("progress", this.cur, n);
        }
      }
    },
  },
  methods: {
    onstart() {
      this.clickonce = true;
      this.$nextTick(() => {
        this.init();
      });
    },
    cleartime() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    runtime() {
      this.cleartime();
      this.timer = setTimeout(() => {
        this.num++;
        this.cleartime();
        this.runtime();
      }, 1e3);
    },
    init() {
      if (!this.clickonce) {
        return 0;
      }
      if (this.src) {
        if (this.player) {
          this.player.switchVideo({
            url: this.src || "",
            pic: this.pics || "",
          });
        } else {
          this.player = null;
          // eslint-disable-next-line
          this.player = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.dom("#" + this.ids),
            video: { url: this.src || "", pic: this.pics || "" },
            mutex: true,
            autoplay: true,
            loop: true,
          });

          this.player.on("canplay", () => {
            // console.log("canplay");
            if (!this.playonce) {
              this.player.play();
            }
          });
          this.player.on("ended", () => {
            // console.log("ended");
            this.cleartime();
          });
          this.player.on("error", () => {
            // console.log("error");
            this.cleartime();
            this.$emit("pause");
          });
          this.player.on("timeupdate", () => {
            // console.log("timeupdate");
            if (this.player && this.player.video) {
              this.maxnum = this.player.video.duration;
              this.cur = this.player.video.currentTime;
            }
          });
          this.player.on("pause", () => {
            // console.log("pause");
            this.cleartime();
            this.$emit("pause");
          });
          this.player.on("play", () => {
            this.playonce = true;
            // console.log("play");
            this.runtime();
            this.$emit("play");
          });
        }
      }
    },
  },
  mounted() {
    this.src = this.urls;
    this.$nextTick(() => {
      this.init();
    });
  },
  destroyed() {
    if (this.player && this.player.destroy) {
      this.player.plugins.hls && this.player.plugins.hls.destroy();
      this.player.destroy();
      this.player = null;
    }
  },
};
</script>
<style lang='less' scoped>
.play {
  width: 100%;
  height: 100%;
  background-color: #222;
  position: relative;
  .playd,
  .click_once {
    width: 100%;
    height: 100%;
  }
  .play_circle {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 100px;
    height: 100px;
    color: #fff;
    font-size: 100px;
    i {
      transform: scale(0.6);
    }
  }
}
</style>
