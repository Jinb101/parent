<template>
  <div class="help_detail">
    <template v-if="detail.video">
      <div class="app_top">
        <div class="video_box">
          <template v-if="play">
            <div id="player-detail-help" @click.stop></div>
          </template>
          <template v-else>
            <div class="poster">
              <div class="player" @click.stop="onCreatePlayer(detail.video)">
                <van-icon name="play-circle-o" />
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <div
      class="app_frame_content"
      id="help-detail"
      v-html="detail.content"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    pid: [String, Number],
  },
  data() {
    return {
      detail: {},
      play: false,
      player: null,
    };
  },
  inject: ["appShowImage"],
  methods: {
    onCreatePlayer(video) {
      this.play = true;
      this.$nextTick(() => {
        if (!this.player) {
          // eslint-disable-next-line
          this.player = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-detail-help"),
            video: {
              url: video,
              pic: "",
            },
            mutex: true,
            preload: "none",
          });
          this.player.play();
        }
      });
    },
    init() {
      this.$api.http("helpDetail", { problem_id: this.pid }, (r) => {
        this.detail = r;
        this.$vx({ title: "用户手册", desc: r.problem });
        this.$emit("end", r);
        this.$nextTick(() => {
          this.mouseimg();
        });
      });
    },
    mouseimg() {
      // eslint-disable-next-line
      // let a = demo.siteConfig.matchurl(this.detail.content);
      // a = a.filter((r) => {
      //   let f = r.split(".");
      //   return ["png", "jpg", "jpeg"].indexOf(f[f.length - 1]) >= 0;
      // });
      let sio = this.appShowImage;
      this.$nextTick(() => {
        // eslint-disable-next-line
        let dom = demo.js("#help-detail").child("img");
        // eslint-disable-next-line
        demo.click(dom, (res) => {
          sio(res.dom.src);
        });
      });
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.video_box {
  height: 210px;
  background-color: #232323;
  overflow: hidden;
}
.poster {
  height: 100%;
  position: relative;
  .player {
    position: absolute;
    z-index: 5;
    width: 80px;
    height: 80px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 50px;
  }
}
[id^="player"] {
  height: 100%;
  width: 100%;
  display: block;
}
</style>
