<template>
  <div class="app_audio">
    <div id="app-audio-box"></div>
    <span class="del" @click.stop="del">
      <van-icon name="cross" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    music: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      ap: null,
      title: "",
      url: "",
      pic: "",
      name: "",
    };
  },
  watch: {
    url() {
      this.checkUrl();
    },
    music: {
      handler(v) {
        this.setData(v);
      },
      deep: true,
    },
  },
  methods: {
    del() {
      this.$model.model("是否移除播放", "", (res) => {
        if (res) {
          this.url = "";
          this.setData({ type: "end" });
          this.$emit("on-remove");
        }
      });
    },
    setData(v) {
      switch (v.type) {
        case "play":
          if (this.url === v.url) {
            this.ap && this.ap.play();
          } else {
            this.title = v.name;
            this.name = v.nick;
            this.pic = v.pic;
            if (this.ap) {
              this.ap.list.clear();
              this.ap.list.add({
                name: v.name,
                url: v.url,
                artist: v.nick,
                cover: v.pic,
              });
              this.ap.play();
            } else {
              this.url = v.url;
            }
          }
          break;
        case "pause":
          this.ap && this.ap.pause();
          break;
        default:
          this.ap && this.ap.destroy();
      }
    },
    checkUrl() {
      if (!this.url) {
        return 0;
      }
      if (this.ap && this.ap.destroy) {
        this.ap.destroy();
        this.ap = null;
      }
      // eslint-disable-next-line
      this.ap = new APlayer({
        container: document.getElementById("app-audio-box"),
        autoplay: true,
        audio: [
          {
            name: this.title,
            url: this.url,
            artist: this.name,
            cover: this.pic,
          },
        ],
      });
      this.ap.on("error", (e) => {
        this.$emit("error");
        if (this.ap && this.ap.pause) {
          this.ap.pause();
        }
      });
    },
  },
  mounted() {},
  destroyed() {
    if (this.ap && this.ap.destroy) {
      this.ap.destroy();
      this.ap = null;
    }
  },
};
</script>
<style lang='less'>
.app_audio {
  position: fixed;
  left: 0;
  height: 50px;
  background-color: rgb(241, 253, 225);
  width: 100%;
  bottom: 0;
  z-index: 500;
  transition: all 0.3s;
  &.foot {
    bottom: 50px;
  }
  .del {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 16px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: tomato;
  }
}
.aplayer {
  margin: 0 !important;
}
.aplayer .aplayer-pic {
  width: 50px !important;
  height: 50px !important;
}
.aplayer .aplayer-info {
  height: 50px !important;
  margin-left: 50px !important;
  padding: 0 10px !important;
}
</style>
