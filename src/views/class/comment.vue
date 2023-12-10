<template>
  <div class="comment_class">
    <div class="van-cell van-cell--center van-field">
      <div class="van-cell__value van-cell__value--alone">
        <div class="van-field__body">
          <div class="emoji_input van-field__control"
               :id="ids"></div>
          <div class="van-field__button">
            <div class="flex">
              <span class="emoji_icon"
                    @click.stop="onEmoji">
                <i class="van-icon van-icon-smile-o"
                   v-if="!open"></i>
                <i class="van-icon van-icon-ascending"
                   v-else></i>
              </span>
              <button @click.stop="onSend"
                      class="
                  emoji_btn
                  van-button van-button--primary van-button--small
                "
                      :class="{ 'van-button--plain': !text }">
                <div class="van-button__content">
                  <span class="van-button__text">发送</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="emoji_change demo_scrollbar"
         v-if="open">
      <div class="emoji_line"
           v-for="(i, j) in icon"
           :key="j">
        <h5>{{ i.text }}</h5>
        <ul class="flex fw">
          <li v-for="x in i.count"
              :key="x + '-' + j"
              @click="getEmoji(i.name, x, i.suffix)">
            <van-image :src="toIcon(i.name, x, i.suffix)"></van-image>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    unauto: Boolean,
  },
  data() {
    return {
      text: "",
      // eslint-disable-next-line
      icon: siteConfig().text.emoji,
      open: false,
      tinymce: null,
      // eslint-disable-next-line
      ids: "class-comment-" + demo.$random.vars(6),
      autoindex: 0,
    };
  },
  computed: {
    message: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    message(n) {
      if (n !== this.text) {
        this.tinymce && this.tinymce.setContent(n);
        this.text = n;
        // eslint-disable-next-line
        this.end(demo.$.id(this.ids));
      }
      this.$emit("input", n);
    },
  },
  methods: {
    toIcon(name, index, suffix) {
      // eslint-disable-next-line
      return siteConfig().icon([name, index].join("/"), "emoji", suffix);
    },
    onSend() {
      let a = this.text.replace(/<p>/g, "<span>").replace(/<\/p>/g, "</span>");
      this.message = a;
      this.$emit("change", a);
      this.tinymce.setContent("");
      this.open = false;
    },
    onEmoji() {
      this.open = !this.open;
    },
    getEmoji(name, index, suffix) {
      let src = this.toIcon(name, index, suffix);
      let img = `<img src="${src}" style="width:0.53rem;height:0.53rem">`;
      if (!this.tinymce) return 0;
      this.tinymce.insertContent(img);
      // eslint-disable-next-line no-undef
      console.log(demo
        .js("#" + this.ids));
      // eslint-disable-next-line
      demo
        .js("#" + this.ids)
        .dom()
        .blur();
      this.$nextTick(() => {
        this.onInputs();
      });
    },
    onInputs() {
      this.text = this.tinymce.getContent();
    },
    end(obj) {
      if (window.getSelection) {
        // ie11 10 9 ff safari
        obj.focus(); // 解决ff不获取焦点无法定位问题
        var range = window.getSelection(); // 创建range
        range.selectAllChildren(obj); // range 选择obj下所有子内容
        range.collapseToEnd(); // 光标移至最后
      } else if (document.selection) {
        // ie10 9 8 7 6 5
        let range = document.selection.createRange(); // 创建选择对象
        range.moveToElementText(obj); // range定位到obj
        range.collapse(false); // 光标移至最后
        range.select();
      }
    },
  },
  mounted() {
    let that = this;
    this.message = that.value;
    console.log(this.unauto);
    this.$nextTick(() => {
      // eslint-disable-next-line
      tinymce.init({
        selector: "#" + this.ids,
        inline: true,
        toolbar: false,
        menubar: false,
        placeholder: "评论",
        auto_focus: true,
        plugins: "paste",
        init_instance_callback: function (editor) {
          that.tinymce = editor;
          if (that.message) {
            editor.setContent(that.message);
            that.text = that.message;
            // eslint-disable-next-line
            that.end(demo.$.id(that.ids));
          }
          editor.on("input", () => {
            that.onInputs();
          });
          editor.on("click", () => {
            that.open = false;
          });
        },
      });
    })
  },
  destroyed() {
    this.tinymce && this.tinymce.destroy();
  },
};
</script>
<style lang="less">
.comment_class {
  .van-cell {
    background: transparent;
  }

  .van-field__control {
    background-color: #fff;
    border-radius: 5px;
  }

  .van-field__body {
    align-items: end;
  }
}
</style>
<style lang='less' scoped>
.comment_class {
  position: fixed;
  z-index: 1000;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f7f7f7;
  transition: all 0.3s;

  .emoji_icon {
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: #999;
    cursor: pointer;
  }

  .emoji_btn {
    width: 60px;
    border-radius: 5px;
  }

  .emoji_input {
    min-height: 32px;
    outline: none;
    line-height: 1.5;
    vertical-align: bottom;
    width: calc(100% - 102px);
    max-height: 96px;
    overflow-y: scroll;
    padding-top: 6px;

    * {
      word-break: break-all;
    }
  }

  .emoji_change {
    max-height: 300px;
    padding-bottom: 10px;
    box-sizing: border-box;
  }

  .emoji_line {
    padding: 0 8px;

    h5 {
      font-size: 14px;
      padding: 5px;
      margin-bottom: 5px;
    }

    li {
      width: 30px;
      height: 30px;
      margin: 4px;
    }
  }
}

.mce-content-body:not([dir="rtl"])[data-mce-placeholder]:not(.mce-visualblocks)::before {
  top: 6px !important;
  font-size: 15px !important;
}
</style>
