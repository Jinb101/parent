<template>
  <div class="index_banner">
    <v-tool-title :text="title">
      <!-- <span @click="onShare">
        <van-icon name="wechat" size="22" color="yellowgreen" />
      </span> -->
    </v-tool-title>
    <h2 class="h1">{{ title }}</h2>
    <p class="time">{{ time }}</p>
    <div class="cont app_frame_content" v-html="content"></div>
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
    };
  },
  inject: ["appBack", "appPath"],
  methods: {
    onShare() {
      // console.log(this.detail);
    },
  },
  mounted() {
    this.$api.http(
      "bannerDetail",
      { banner_id: this.$route.params.id },
      (e) => {
        this.title = e.describe;
        this.time = this.$demo.timeout(e.create_time);
        this.content = e.content;
        this.detail = e;
      }
    );
  },
};
</script>
<style lang='less' scoped>
.index_banner {
  overflow-y: scroll;
  font-size: 14px;
  .h1 {
    font-size: 16px;
    padding: 10px;
    line-height: 20px;
  }
  .time {
    padding: 0 10px;
    color: #999;
  }
  .cont {
    padding-top: 10px;
  }
}
</style>
