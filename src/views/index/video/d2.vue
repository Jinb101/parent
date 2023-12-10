<template>
  <div class="baby_video_detail">
    <v-tool-title :text="title">
      <span @click="onPage(1)"><van-icon name="replay" size="20" /></span>
    </v-tool-title>
    <div class="player">
      <v-v :item="{ src, pic }" class="play"></v-v>
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
        @click="onDetail(i.baby_id)"
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
      detail: {},
      item: [],
      src: "",
      pic: "",
      title: "",
      id: "",
    };
  },
  inject: ["appPath"],
  components: { vV },
  methods: {
    onPage(e) {
      this.$api.http(
        "babyVideoDetail",
        { page: e, limit: 20, baby_id: this.id },
        (e) => {
          this.detail = e.video;
          this.item = e.videos;
          this.pic = this.detail.video_img;
          this.src = this.detail.video_path;
          this.title = this.detail.video_name;
        }
      );
    },
    onDetail(baby_id) {
      this.$api.http("babyVideoCheck", { baby_id }, (e) => {
        if (e.is_on === 1) {
          return this.$model.info("该宝贝在线已被关闭", 2);
        }
        this.id = baby_id;
        this.onPage(1);
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.baby_video_detail {
  .player {
    height: 288px;
    position: relative;
    box-sizing: border-box;
    border-bottom: 8px solid #f5f5f5;
    .play {
      height: 210px;
    }
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
