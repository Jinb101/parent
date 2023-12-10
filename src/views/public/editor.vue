<template>
  <div class="app_editor">
    <div class="edit_header flex" v-if="header">
      <span @click="upload"><van-icon name="photo" /></span>
      <span @click="video" v-if="videoBtn"><van-icon name="video" /></span>
    </div>
    <div class="header dn" :id="ids + '-header'"></div>
    <div
      :id="ids"
      ref="editor"
      class="edit van-hairline--top"
      :class="{ header: header }"
    ></div>
    <v-u :view="false" change ref="uploads" :type="tps" @path="onPath"></v-u>
  </div>
</template>

<script>
import vU from "./upload.vue";
export default {
  props: {
    ids: { type: String, default: "editor" },
    content: { type: String, default: "" },
    header: { type: Boolean, default: false },
    videoBtn: { type: Boolean, default: true },
  },
  components: { vU },
  data() {
    return {
      editor: null,
      config: [],
      tps: "img",
    };
  },
  watch: {
    content(n) {
      this.editor.clipboard.dangerouslyPasteHTML(0, n);
    },
  },
  methods: {
    setMedia(src, type = "image") {
      this.editor.focus();
      // 插入 media
      let length = this.editor.getSelection().index;
      // 插入 media
      this.editor.insertEmbed(length, type, src);
      // 调整光标到最后
      this.editor.setSelection(length + 1);
    },
    init() {
      if (this.content) {
        this.editor.clipboard.dangerouslyPasteHTML(this.content);
      }
      let that = this;
      this.editor.on("text-change", (delta, oldDelta, source) => {
        let text = that.editor.getText();
        let html = that.$refs.editor.children[0].innerHTML;
        that.$demo._timers("timer_editor", (res) => {
          if (res) {
            that.$emit("input", { text, html });
          }
        });
      });
      this.editor.on("selection-change", (e) => {
        if (!e) {
          // console.log("离开");
          that.$emit("blur");
        } else {
          // console.log("进入");
          that.$emit("focus");
        }
      });
      that.$emit("ready");
    },
    upload() {
      this.tps = "img";
      this.onChange();
    },
    video() {
      this.tps = "video";
      this.onChange();
    },
    onChange() {
      this.$refs.uploads.onFile(this.tps);
    },
    onPath(e) {
      this.setMedia(e.url, e.type === "img" ? "image" : "video");
    },
  },
  mounted() {
    let _t = this;
    // eslint-disable-next-line
    this.editor = new Quill("#" + _t.ids, {
      //  富文本编辑器配置
      modules: {
        toolbar: {
          container: "#" + this.ids + "-header",
        },
      },
      theme: "snow", // 主题
      placeholder: "请输入正文",
    });
    this.init();
  },
};
</script>
<style lang='less' scoped>
.app_editor {
  overflow-y: scroll;
  height: 200px;
  .edit_header {
    font-size: 25px;
    height: 40px;
    line-height: 30px;
    text-align: center;
    box-sizing: border-box;
    padding: 5px;
    background-color: #ccc;
    color: #444;
    span {
      width: 40px;
    }
    .van-icon {
      line-height: 30px;
    }
  }
  .edit.header {
    height: calc(100% - 40px);
  }
}
</style>
