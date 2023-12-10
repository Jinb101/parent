<template>
  <div class="class_add">
    <v-tool-title :text="title"></v-tool-title>
    <h6 class="h1">班级圈内容</h6>
    <div class="m van-hairline--bottom">
      <van-field
        v-model="message"
        rows="4"
        autosize
        type="textarea"
        maxlength="600"
        placeholder="请输入内容"
        show-word-limit
      />
    </div>
    <div class="image" v-if="+type === 1">
      <h6>添加图片</h6>
      <v-i @path="onImage" :size="1000"></v-i>
      <!-- 多个 -->
    </div>
    <div class="video" v-else-if="+type === 2">
      <h6>添加视频(横屏拍摄效果佳!视频最长30秒)</h6>
      <v-u type="video" @path="onVideo"></v-u>
      <!-- 单个 -->
    </div>
    <div class="send">
      <van-button :color="theme.bgc" block round @click="onSub"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import vU from "../../public/upload.vue";
import vI from "../../private/image.vue";
export default {
  data() {
    return {
      type: "1",
      message: "",
      theme: {},
      images: "",
      cid: "",
    };
  },
  components: { vU, vI },
  computed: {
    title() {
      return ["", "发布图文班级圈", "发布视频班级圈"][+this.type];
    },
  },
  inject: ["appGetTheme", "appBack"],
  methods: {
    onImage(e) {
      this.images = e
        .map((r) => {
          return r.path;
        })
        .join(",");
    },
    onVideo(e) {
      this.images = e.path;
    },
    onSub() {
      this.$api.http(
        "classAdd",
        {
          content: this.toText(this.message),
          imgs: this.images,
          title: "",
          class_id: this.cid,
          type: this.type,
        },
        () => {
          this.$model.info("发布成功", 2);
          this.appBack(1);
        }
      );
    },
    toText(v) {
      return v
        .replace(/\n/g, "<br/>")
        .replace(/↵/g, "<br/>")
        .replace(/decodeURI('%E2%86%B5')/g, "<br/>")
        .replace(/\r\n/g, "<br>");
    },
  },
  mounted() {
    this.type = this.$route.params.type;
    this.cid = this.$demo.$local.get("class-id", {}).id;
    this.theme = this.appGetTheme();
  },
};
</script>
<style lang='less' scoped>
.class_add {
  padding: 15px;
  font-size: 16px;
  overflow-y: scroll;
  h6:not(.h1) {
    color: #999;
    font-size: 14px;
    margin-bottom: 8px;
  }
  h6 {
    padding: 5px 0;
  }
  .send {
    padding: 35px;
  }
}
</style>
