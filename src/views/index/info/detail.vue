<template>
  <div class="index_article">
    <v-tool-title :text="title">
      <!-- <span @click="onShare">
        <van-icon name="wechat" size="22" color="yellowgreen" />
      </span> -->
    </v-tool-title>
    <h2 class="h1">{{ title }}</h2>
    <p class="time">{{ time }}</p>
    <div class="cont app_frame_content"
         v-html="content"></div>
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
      this.$vx({ title: this.title, logo: this.detail.image[0] });
      // this.$model.info("请打开右上角选择发送给朋友", 2);
    },
    async init() {
      await this.$api.http(
        "infoDetail",
        { teachers_id: this.$route.params.id },
        (e) => {
          this.title = e.title;
          this.time = this.$demo.timeout(e.create_time);
          this.content = e.content;
          this.detail = e;
          this.onShare();
          this.$nextTick(() => {
            var imgElements = document.querySelectorAll(".index_article img");
            for (var i = 0; i < imgElements.length; i++) {
              var src = imgElements[i].getAttribute("src");
              if (src) {
                var newSrc = src.replace(/\\/g, "");
                imgElements[i].setAttribute("src", '//images.weserv.nl/?url=' + newSrc);
              }
            }
          });
        }
      );
    },
  },
  mounted() {
    this.init()
  },
};
</script>
<style lang='less' scoped>
.index_article {
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
