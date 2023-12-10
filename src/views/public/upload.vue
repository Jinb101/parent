<template>
  <div
    class="index_upload van-hairline--surround"
    @click="onFile('')"
    :class="{ change: change }"
    ref="upload"
  >
    <van-image
      :src="path"
      v-if="path"
      :round="round"
      :fit="cover ? 'cover' : ''"
    ></van-image>
    <van-icon name="plus" size="66" color="#eee" v-else :style="lin" />
  </div>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "img" },
    timeout: { type: [String, Number], default: 32 }, // video 最大秒数
    size: { type: [String, Number], default: 1024 }, // image 最大体积 500K
    view: { type: Boolean, default: true },
    logo: { type: String, default: "" },
    change: { type: Boolean, default: false },
    more: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    cover: { type: Boolean, default: false },
  },
  data() {
    return {
      path: "",
      h: 100,
    };
  },
  watch: {
    logo(n) {
      this.setPath(n);
    },
  },
  computed: {
    lin() {
      return { "line-height": this.h + "px" };
    },
  },
  inject: ["appUploadImage", "appObject"],
  methods: {
    setPath(n) {
      if (!n) return 0;
      if (n === "false") {
        this.path = "";
        return 0;
      }
      if (this.$js.def.upload[n]) {
        this.path = this.$js.def.upload[n];
      } else {
        this.path = n;
      }
    },
    onFile(xxx) {
      let ts = this;
      let o = ts.$js.def.uploadAccept;
      let name = xxx !== "" ? xxx : ts.type;
      let os = o[name] || {};
      os.accept = { ...os.accept, more: this.more };
      ts.appUploadImage(os, (e) => {
        // if (ts.type === "video") {
        //   ts.$demo.es6().videoTimeout(e.file, ts.timeout, (s) => {
        //     if (!s.flag) {
        //       return ts.$demo.alert("视频长度不可大于" + ts.timeout + "秒");
        //     }
        //     ts.up(e.file);
        //   });
        //   return 0;
        // }
        if (ts.type === "img") {
          let size = Math.ceil(e.file.size / 1024);
          if (size > ts.size) {
            return ts.$demo.alert("图片过大");
          }
        }
        ts.up(e.file);
      });
    },
    up(imgs) {
      let image = this.$js.def.upload[this.type] || {};
      let type = this.type;
      type = ["word", "excel"].indexOf(type) >= 0 ? "pdf" : type;
      this.$api.upload({ type, imgs }, (r) => {
        if (r.code !== 200) {
          return this.$model.info(r.msg, 2);
        }
        let os = this.appObject(r.data, {
          url: r.data.data,
          data: image.icon ? image.icon : r.data.data,
          type: this.type,
          path: r.data.halfway,
        });
        if (this.view) {
          this.path = os.data;
        }
        this.$emit("path", os);
      });
    },
  },
  mounted() {
    this.setPath(this.logo);
    this.h = this.$refs.upload.clientHeight;
  },
};
</script>
<style lang='less' scoped>
.index_upload {
  width: 100px;
  height: 100px;
  text-align: center;
  .van-icon {
    line-height: 100px;
  }
  &.change {
    position: fixed;
    left: -300vw;
    height: -300vh;
    z-index: -1;
  }
}
</style>
