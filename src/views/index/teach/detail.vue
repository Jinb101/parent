<template>
  <div class="index_article">
    <v-tool-title :text="title">
      <span @click="onShare">
        <van-icon name="wechat" size="22" color="yellowgreen" />
      </span>
    </v-tool-title>
    <h2 class="h1">{{ title }}</h2>
    <!-- <p class="time">{{ time }}</p> -->
    <div class="ava flex fw" v-if="detail.image && detail.image.length">
      <div
        class="img"
        v-for="(i, j) in detail.image"
        :key="j + '-i'"
        @click="appShowImage(detail.image, j)"
      >
        <van-image :src="i" fit="cover"></van-image>
      </div>
    </div>
    <template v-if="declaration">
      <h5>教育宣言</h5>
      <div class="cont app_frame_content" v-html="declaration"></div>
    </template>
    <template v-if="content">
      <h5>我的简介</h5>
      <div class="cont app_frame_content" v-html="content"></div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      time: "",
      content: "",
      detail: {},
      btn: false,
      declaration: "",
    };
  },
  inject: ["appBack", "appPath", "appShowImage"],
  methods: {
    onShare() {
      this.$model.info("请打开右上角选择发送给朋友", 2);
      this.$vx({
        name: this.detail.title,
        desc: this.declaration,
        logo: this.detail.image[0],
      });
    },
  },
  mounted() {
    this.$api.http(
      "infoDetail",
      { teachers_id: this.$route.params.id },
      (e) => {
        this.title = e.title;
        this.time = this.$demo.timeout(e.create_time);
        this.content = e.content || "";
        this.declaration = e.declaration || "";
        this.detail = e;
      }
    );
  },
};
</script>
<style lang='less' scoped>
.index_article {
  overflow-y: scroll;
  font-size: 15px;
  .h1 {
    font-size: 16px;
    padding: 10px;
    line-height: 20px;
  }
  h5 {
    font-weight: 650;
    padding: 0 10px;
    line-height: 35px;
    height: 35px;
  }
  .time {
    padding: 0 10px;
    color: #999;
  }
  .ava {
    padding: 10px;
  }
  .img {
    width: 100px;
    height: 100px;
    margin: 0 10px 10px 0;
  }
}
</style>
