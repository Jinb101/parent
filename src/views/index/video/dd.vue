<template>
  <div class="work_baby_detail">
    <v-tool-title :text="title">
      <span @click="s = !s">{{ s ? "取消" : "" }}大屏</span>
    </v-tool-title>
    <iframe
      :src="src"
      frameborder="0"
      class="play"
      :class="{ auto: s }"
      allowfullscreen="allowfullscreen"
      mozallowfullscreen="mozallowfullscreen"
      msallowfullscreen="msallowfullscreen"
      oallowfullscreen="oallowfullscreen"
      webkitallowfullscreen="webkitallowfullscreen"
      ref="frame"
    ></iframe>
    <div class="tops">
      <h3 class="name">{{ detail.video_name }}</h3>
      <p class="time">
        开放时间：<b>
          {{ detail.morning_start }}~{{ detail.morning_end }}
          {{ detail.afternoon_start }}~{{ detail.afternoon_end }}
        </b>
      </p>
    </div>
    <div class="view">
      <section
        v-for="(i, j) in item"
        :key="j + '-s'"
        class="van-hairline--bottom"
        @click="onDetail(i)"
      >
        <p class="name">{{ i.video_name }}</p>
        <p>
          开放时间：<b
            >{{ i.morning_start }}~{{ i.morning_end }}
            {{ i.afternoon_start }}~{{ i.afternoon_end }}</b
          >
        </p>
        <van-icon name="arrow" />
      </section>
    </div>
  </div>
</template>

<script>
import vV from "../../private/video3.vue";
export default {
  data() {
    return {
      id: "",
      title: "",
      open: false,
      src: "",
      pic: "",
      detail: {},
      item: [],
      s: false,
    };
  },
  components: { vV },
  inject: ["appBack"],
  methods: {
    init() {
      this.$api.http("babyVideoCheck", { baby_id: this.id }, (e) => {
        if (+e.is_on === 1) {
          this.$model.info("抱歉,该宝贝在线未开启", 2);
          this.appBack(1);
          return 0;
        }
        this.onPage(1);
      });
    },
    onPage(e) {
      this.$api.http(
        "babyVideoDetail",
        { baby_id: this.id, page: e, limit: 20 },
        (r) => {
          // console.log(r);
          this.detail = r.video;
          this.pic = this.detail.video_img;
          let h5 = this.$demo.es6().encrypt(
            {
              token: this.detail.access_token,
              url: this.detail.hd_address,
              time: [
                this.detail.morning_start,
                this.detail.morning_end,
                this.detail.afternoon_start,
                this.detail.afternoon_end,
              ],
              now: this.detail.server_time, // 当前时间 服务器返
              width: this.$refs.frame.clientWidth,
              height: this.$refs.frame.clientHeight,
            },
            "baby",
            "admin"
          );
          this.src = this.$js.api.h5 + "h5/surveillance/?h5=" + h5;
          // this.src = this.detail.video_path;
          this.title = this.detail.video_name;
          this.item = r.videos;
        }
      );
    },
    onDetail(e) {
      this.id = e.baby_id;
      this.onPage(1);
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.title = this.$route.meta.title;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.work_baby_detail {
  .play {
    height: 210px;
    display: block;
    width: 100%;
    background-color: #fff;
    &.auto {
      position: fixed;
      left: 0;
      top: 46px;
      width: 100%;
      height: calc(100% - 46px);
      z-index: 55;
    }
  }
  .tops {
    border-bottom: 8px solid #f5f5f5;
    position: relative;
    z-index: 5;
    .name {
      padding: 15px 10px 10px;
      font-size: 15px;
      font-weight: 650;
      line-height: 20px;
    }
    .time {
      font-size: 13px;
      color: #999;
      padding: 0 10px;
      line-height: 15px;
    }
  }
  .view {
    position: relative;
    z-index: 5;
    height: calc(100% - 334px);
    overflow-y: scroll;
    section {
      padding: 15px;
      position: relative;
      color: #999;
      .name {
        font-weight: 650;
        margin-bottom: 5px;
        font-size: 15px;
        color: #888;
      }
      p {
        font-size: 13px;
        line-height: 1.2;
      }
      .van-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 15px;
        height: 20px;
        color: #ccc;
      }
    }
  }
}
</style>
