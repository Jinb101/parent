<template>
  <div class="video_class">
    <div class="poster" :style="avs">
      <van-icon name="play" v-if="!player" class="aa" @click="onPlayer" />
      <van-image
        :src="poster"
        fit="cover"
        v-if="!player"
        @click="onPlayer"
        @error="onerror"
      ></van-image>
      <div :id="ids" v-show="player" class="video"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ids: { type: String, default: "class-player-n" },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      video: null,
      player: false,
      poster: "",
      url: "",
      defpic: "https://jsxrk.jsxrk.xin/500/icon/player/player.jpg",
      times: {
        currentTime: 0,
        duration: 0,
      },
    };
  },
  computed: {
    avs() {
      return {};
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
  methods: {
    reset() {
      if (!this.video) return 0;
      this.video.pause();
      this.video.destroy();
      this.video = null;
      this.$nextTick(() => {
        this.init();
      });
    },
    seek(num) {
      if (!this.video) return 0;
      this.video.pause();
      this.video.seek(num);
    },
    onerror(e) {
      console.warn("封面出错，更换默认封面", this.item.cover);
      this.poster = this.defpic;
    },
    init() {
      let v = this.item;
      this.poster = v.cover || this.defpic;
      if (this.video) {
        this.video.switchVideo({ url: v.url, pic: v.cover });
        return 0;
      }
      // eslint-disable-next-line
      this.video = new DPlayer({
        container: this.$demo.$.id(this.ids),
        video: { url: v.url, pic: v.cover },
        contextmenu: [{ text: "下载", link: v.url }],
        preload: "none",
      });
      this.$emit("create", this.video);
      this.video.on("timeupdate", () => {
        this.times.duration = this.video.video.duration || 0;
        this.times.currentTime = this.video.video.currentTime;
        this.$emit("times", this.times);
      });
    },
    onPlayer() {
      this.player = !this.player;
      if (this.player) {
        this.video.play();
      } else {
        this.video.pause();
      }
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (this.video && this.video.destroy) {
      this.video.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.poster {
  width: 100%;
  height: 210px;
  margin: 0 auto;
  position: relative;
  .aa {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 60px;
    height: 60px;
    z-index: 3;
    font-size: 40px;
    text-align: center;
    line-height: 60px;
    color: #fff;
    box-shadow: 0 0 10px rgba(204, 204, 204, 0.3);
    border-radius: 50%;
  }
  .video {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
