<template>
  <div class="chant_preview">
    <iframe
      :src="toplayerurl"
      frameborder="0"
      class="db_image"
      allowtransparency="true"
      allowfullscreen="true"
    ></iframe>
    <!-- <div
      class="cover_fixed_chant"
      :style="tostyleimage(images)"
      v-if="images"
    ></div>
    <div class="player_view">
      <div class="tab flex" v-if="list.length > 1">
        <span
          v-for="(i, j) in list"
          :key="j"
          @click="onchangeplayer(i)"
          :class="{ active: play.url === i.url }"
        >
          {{ i.type === "mp3" ? "音" : "视" }}频
        </span>
      </div>
      <div class="player" v-if="toplayerurl">
        <iframe
          :src="toplayerurl"
          frameborder="0"
          class="db_image"
          allowtransparency="true"
          allowfullscreen="true"
        ></iframe>
      </div>
      <van-empty v-else description="暂无"></van-empty>
      <div class="content" v-if="play.content" v-html="play.content"></div>
    </div> -->
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      play: {},
      list: [],
    };
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    toplayerurl() {
      if (!this.play.url) return "";
      return (
        this.$js.api.h5 +
        "h5/player/?url=" +
        this.play.url +
        "&pic=" +
        this.play.pic
      );
    },
    images() {
      return this.play.pic || "";
    },
  },
  watch: {
    ext: {
      handler(e) {
        this.init();
        this.$emit("input", e);
      },
      deep: true,
    },
  },
  methods: {
    onchangeplayer(e) {
      this.play = e;
    },
    tostyleimage(pic) {
      return {
        background: "url(" + pic + ") no-repeat 0 0 transparent scroll",
        "background-size": "100% 100%",
      };
    },
    init() {
      // if (this.$demo.$obj(this.ext, 1) === 4) {
      //   this.play = this.ext[0] || {};
      //   this.list = this.ext;
      // } else {
      //   let l = [];
      //   if (this.ext.video_address) {
      //     l.push({ url: this.ext.video_address, pic: this.ext.cover_image });
      //   }
      //   if (this.ext.audio) {
      //     l.push({
      //       url: this.ext.audio,
      //       content: this.ext.content || "",
      //       pic:
      //         this.ext.parent_cover_picture ||
      //         // eslint-disable-next-line
      //         siteConfig().icon("audio", "upload"),
      //     });
      //   }
      //   this.list = l;
      //   this.play = l[0] || {};
      // }
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
  destroyed() {},
};
</script>
<style lang='less' scoped>
.chant_preview {
  height: 100%;
}
// .cover_fixed_chant {
//   position: fixed;
//   left: 0;
//   top: 0;
//   z-index: 19;
//   width: 100vw;
//   height: 100vh;
//   filter: blur(10px);
//   opacity: 0.5;
// }
// .player_view {
//   position: relative;
//   z-index: 30;
//   box-sizing: border-box;
//   padding-top: 80px;
//   .tab {
//     padding: 10px;
//     height: 40px;
//     line-height: 40px;
//     width: 70%;
//     margin: 0 auto;
//     font-size: 15px;
//     span {
//       flex: 1;
//       text-align: center;
//       border: 1px solid #999;
//       border-radius: 20px;
//       & + span {
//         margin-left: 10px;
//       }
//       &.active {
//         color: #fff;
//         background-color: #18bc9c;
//         border-color: #18bc9c;
//       }
//     }
//   }
//   .player {
//     margin: 10px;
//     height: 200px;
//     background-color: #222;
//     border-radius: 5px;
//     overflow: hidden;
//   }
//   .content {
//     padding: 10px 20px;
//     box-sizing: border-box;
//     font-size: 15px;
//     line-height: 1.2;
//   }
// }
</style>
