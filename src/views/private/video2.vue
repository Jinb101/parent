<template>
  <div class="video_class">
    <div class="poster" :style="avs">
      <van-icon name="play" v-if="!player" class="aa" @click="onPlayer" />
      <van-image
        :src="poster"
        fit="cover"
        v-if="!player"
        @click="onPlayer"
      ></van-image>
      <div :id="ids" v-show="player" class="video"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ids: { type: String, default: "class-player" },
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    wh: {
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
  methods: {
    init() {
      if (!this.item.length) return 0;
      let v = this.item[0];
      this.poster =
        v.cover || "https://jsxrk.jsxrk.xin/500/icon/player/player.jpg";
      if (this.video) {
        this.video.switchVideo({ url: v.img, pic: v.cover });
        return 0;
      }
      // eslint-disable-next-line
      this.video = new DPlayer({
        container: this.$demo.$.id(this.ids),
        video: { url: v.img, pic: v.cover },
        contextmenu: [{ text: "下载", link: v.img }],
        preload: "none",
      });
    },
    onPlayer() {
      this.player = !this.player;
      if (this.player) {
        this.video.play();
      } else {
        this.player.pause();
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.poster {
  width: 280px;
  height: 142px;
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
