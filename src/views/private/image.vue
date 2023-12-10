<template>
  <div class="pri_image flex fw">
    <div class="image" v-for="(i, j) in imglist" :key="j + '-image'">
      <span class="del" @click="onDel(i)"><van-icon name="clear" /></span>
      <van-image
        fit="cover"
        :src="i.url"
        @click="appShowImage(imglist, j, 'url')"
      ></van-image>
      <div class="btn flex" v-if="base && i.check">
        <van-button size="mini" type="info" @click="onRotate(i)"
          >旋转</van-button
        >
      </div>
    </div>
    <template v-if="images.length >= max && max > 0"> </template>
    <v-u
      :view="false"
      @path="onPath"
      more
      :size="size"
      :type="imageType"
      :base="base"
      @on-base="onBase"
      ref="uploads"
      v-else
    ></v-u>
  </div>
</template>

<script>
import vU from "../public/upload.vue";
import { Toast } from "vant";
export default {
  props: {
    len: { type: Number, default: 9 },
    tips: { type: Boolean, default: false },
    ext: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: { type: String, default: "" },
    size: { type: Number, default: 500 },
    imageType: { type: String, default: "img" },
    base: { type: Boolean, default: false },
    max: { type: [Number, String], default: 0 },
  },
  data() {
    return { images: [], baseimg: [], baseid: 1 };
  },
  computed: {
    imglist() {
      if (this.base) return this.baseimg;
      return this.images;
    },
    checkBase() {
      return this.baseimg
        .map((s) => {
          return s.check;
        })
        .filter((s) => {
          return !!s;
        }).length;
    },
  },
  watch: {
    ext: {
      handler() {
        this.setExt();
      },
      deep: true,
    },
  },
  inject: ["appShowImage"],
  components: { vU },
  methods: {
    onBase(e) {
      this.baseimg.push({
        base: e.src,
        url: e.src,
        file: e.file,
        check: true,
        id: this.baseid,
        index: 0,
      });
      this.baseid++;
    },
    onRotate(e) {
      e.index++;
      this.$demo.es6().imageRotate(e.base, { index: e.index }, (res) => {
        e.url = res.src;
        e.file = res.file;
      });
    },
    onBaseUpload() {
      let t = this.$refs.uploads;
      if (this.checkBase > 0) {
        Toast.loading({
          duration: 0,
          message: "上传图片中...",
          forbidClick: true,
        });
        this.baseimg.forEach((k) => {
          k.check && t.up(k.file, k.id);
        });
      } else {
        this.$emit("on-sub");
      }
    },
    setExt() {
      if (!this.ext.length) return 0;
      this.images = this.$demo.copy(this.ext);
      if (this.base) {
        this.baseimg = this.images.map((s, v) => {
          return { check: false, url: s.data, id: v + 3e3, path: s.path };
        });
      }
      this.$emit("path", this.images, this.type);
    },
    onPath(e) {
      if (e.tps >= 0 && this.baseimg.length) {
        let index =
          this.baseimg
            .map((s, v) => {
              return { v, c: s.id === e.tps };
            })
            .filter((c) => {
              return c.c;
            })[0] || {};

        if (index.v >= 0) {
          this.$set(this.baseimg[index.v], "check", false);
        }
        if (this.checkBase === 0) {
          Toast.clear();
          this.$nextTick(() => {
            this.$emit("on-sub");
          });
        }
      }
      this.images.push(e);
      if (this.max > 0) {
        this.images = this.images.splice(0, this.max);
      }
      this.$emit("path", this.images, this.type);
    },
    onDel(e) {
      if (this.tips) {
        this.$model.model("是否删除", "删除", (res) => {
          if (res) {
            this.base ? this.dels(e) : this.del(e);
          }
        });
      } else {
        this.base ? this.dels(e) : this.del(e);
      }
    },
    del(e) {
      this.images = this.images.filter((r) => {
        return r.path !== e.path;
      });
      this.$emit("path", this.images, this.type);
    },
    dels(e) {
      this.baseimg = this.baseimg.filter((r) => {
        return r.id !== e.id;
      });
      if (!e.check) {
        this.del(e);
      }
    },
  },
  mounted() {
    this.setExt();
  },
};
</script>
<style lang='less' scoped>
.pri_image {
  .image {
    width: 100px;
    height: 100px;
    margin: 0 15px 15px 0;
    position: relative;
    .del {
      position: absolute;
      width: 24px;
      height: 24px;
      right: -10px;
      top: -10px;
      z-index: 3;
      color: tomato;
      font-size: 20px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 3;
      width: 100%;
    }
  }
}
</style>
