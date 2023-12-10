<template>
  <div class="child">
    <div class="heads">
      <h2>{{ ext.full_name }}</h2>
      <p>作品名称：{{ ext.name }}</p>
      <p>作品内容：{{ ext.content }}</p>
      <p>目前排名：{{ ext.ranking }}</p>
      <p>当前票数：{{ ext.number_votes }}</p>
      <p v-if="ext.ranking > 1">距上一名差{{ ext.from_previous_place }}票</p>
    </div>
    <div class="image" v-if="ext.picture && ext.picture.length">
      <van-image
        v-for="(i, j) in ext.picture"
        :key="j"
        @click="appShowImage(ext.picture, j)"
        :src="i"
      ></van-image>
    </div>
    <div class="video" v-if="ext.video">
      <iframe
        :src="tovideosrc(ext.video)"
        class="db_image"
        frameborder="0"
      ></iframe>
    </div>
    <div class="w60">
      <van-button block round type="info" @click="onsave">投票</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {};
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  inject: ["appShowImage"],
  watch: {
    ext: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    tovideosrc(src) {
      // eslint-disable-next-line
      return this.$js.api.h5 + "h5/player/?url=" + src;
    },
    onsave() {
      this.$api.http("a2023052305", { voters_id: this.ext.voters_id }, () => {
        this.$toast("投票成功");
        this.$set(this.ext, "number_votes", this.ext.number_votes + 1);
        this.$emit("end");
      });
    },
    init() {
      let link = this.$js.wxshareh5("vote", {
        id: this.ext.voters_id,
        did: this.ext.vote_id,
        path: this.$route.path,
      });
      this.$vx({ link, desc: "您的好友分享给你为宝宝投票" });
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.child {
  .heads {
    padding: 40px 10px 10px;
    h2 {
      font-weight: 650;
      text-align: center;
      line-height: 1.2;
    }
    p {
      font-size: 14px;
      color: #999;
      margin-top: 8px;
    }
  }
  .video {
    height: 195px;
    background-color: #222;
    overflow: hidden;
    border-radius: 5px;
    color: #fff;
    margin: 10px;
    box-sizing: border-box;
  }
}
</style>
