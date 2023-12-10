<template>
  <div class="listen_detail">
    <v-tool-title :text="detail.name"></v-tool-title>
    <div class="head">
      <div class="up"></div>
      <div class="ava flex">
        <div class="ico play" @click="onPlay" v-if="!isPlay">
          <van-icon name="play" />
        </div>
        <div class="ico play" v-else @click="onPause">
          <van-icon name="pause" />
        </div>
        <van-image fit="cover" :src="detail.cover"></van-image>
      </div>
    </div>
    <div class="title">
      <p class="name">{{ detail.name }}</p>
      <div class="flex">
        <span class="count">{{ detail.pageview }}浏览</span>
        <span class="time">{{ appTimeout(detail.add_time, "ymd") }}</span>
      </div>
    </div>
    <div class="desc title">
      <h5 class="name">故事简介</h5>
      <van-empty description="暂无简介" v-if="!detail.content" />
      <div class="app_frame_content" v-html="detail.content"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apis: ["", "storeTeachDetail", "storeListDetail"],
      type: "0",
      id: "",
      detail: {},
      isPlay: false,
    };
  },
  watch: {
    type() {
      this.init();
    },
  },
  inject: ["appTimeout", "appShowMusic"],
  methods: {
    onPlay() {
      this.appShowMusic({
        type: "play",
        title: this.detail.name,
        url: this.detail.audio,
        pic: this.detail.cover,
        name: this.detail.name,
        rand: Date.now(),
      });
      this.isPlay = true;
    },
    onPause() {
      this.appShowMusic({ type: "pause" });
      this.isPlay = false;
    },
    init() {
      let api = this.apis[+this.type];
      this.$api.http(
        api,
        {
          story_id: this.id,
          routine_id: this.id,
        },
        (e) => {
          this.detail = e;
          let s = this.appShowMusic({}, true);
          this.isPlay = s.url === e.audio;
        }
      );
    },
  },
  mounted() {
    this.type = this.$route.params.type;
    this.id = this.$route.params.id;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.listen_detail {
  overflow-y: scroll;
  background-color: #f7f7f7;
  font-size: 15px;
  .head {
    height: 211px;
    position: relative;
    background-color: #fff;
    margin-bottom: 8px;
    .ava {
      height: 100%;
    }
    .up {
      position: absolute;
      z-index: 10;
      width: 100%;
      left: 0;
      top: 0;
      height: 54px;
      background: linear-gradient(
        rgba(34, 34, 34, 0.2),
        rgba(255, 255, 255, 0)
      );
      border-radius: 5px 5px 0 0;
    }
  }
  .title {
    background-color: #fff;
    padding: 15px;
    font-size: 12px;
    color: #999;
    margin-bottom: 2px;
    .name {
      color: #333;
      font-weight: 650;
      font-size: 15px;
      margin-bottom: 3px;
    }
    .time {
      flex: 1;
      text-align: right;
    }
  }
  .desc {
    color: #666;
  }

  .ava {
    height: 200px;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    .ico {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      font-size: 35px;
      text-align: center;
      z-index: 55;
      width: 40px;
      height: 40px;
      transform: scale(1.4);
      color: #f9f9f9;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(153, 153, 153, 0.3);
      .van-icon {
        line-height: 40px;
      }
    }
  }
}
</style>
