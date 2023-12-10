<template>
  <v-view header ref="view">
    <template #menu>
      <span @click="onbtnshare">送人</span>
    </template>
    <div class="poster">
      <!-- <v-tool-title>
      <span class="col_green" @click="onbtnshare">分享</span>
    </v-tool-title> -->
      <div class="player" v-if="ext.video">
        <v-v
          :item="[{ img: ext.video, cover: '' }]"
          :wh="wh"
          ids="video-player-s"
        ></v-v>
      </div>
      <div class="head">
        <h2>{{ ext.title }}</h2>
        <p class="price">{{ totype(ext) }}</p>
        <div class="content">{{ ext.content }}</div>
      </div>
      <div class="pic">
        <van-image
          v-for="(i, j) in ext.picture"
          :key="j"
          :src="i"
          fit="cover"
        ></van-image>
      </div>
      <div class="btn">
        <van-button block type="info" round @click="onshare">{{
          +isbtn === 1 ? "我的报名信息" : "点击报名"
        }}</van-button>
      </div>
    </div>
  </v-view>
</template>

<script>
import vV from "../../private/video2.vue";
export default {
  data() {
    return {
      ext: {},
      wh: { width: "100%", height: "5.3333rem" },
      isbtn: 0,
    };
  },
  components: { vV },
  methods: {
    totype(e) {
      if (!e.id) return "";
      if (+e.type === 1) return "";
      if (+e.type === 2) return +e.price + "元";
      // 邀请" + e.invite + "人
      return "";
    },
    onshares() {
      let link = this.onshare("", true);
      // console.log(link);
      this.$vx({ link, desc: this.ext.title });
    },
    onbtnshare() {
      this.onshares();
      // this.$toast("请点击微信右上角...进行分享");
      this.$refs.view.$share();
    },
    onshare(f, type) {
      let e = this.$demo.$session.get("user", {});
      let os = {
        type: "web",
        nid: this.$demo.$local.get("nid", ""),
        cid: e.id || "",
        path: this.$route.path,
        id: this.ext.id,
        name: "",
        event: +this.isbtn === 1 ? "info" : "sub",
        time: Date.now(),
        m: e.openid || "", // openid
      };
      if (+this.isbtn === 0) {
        delete os.event;
      }
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = this.$js.api.h5 + "h5/poster/?h5=" + a;
      if (type) return url;
      // eslint-disable-next-line
      if (!demo.es6().isWx()) {
        console.log(url);
        return this.$toast("请用微信打开");
      }
      window.location.href = url;
    },
  },
  mounted() {
    let user = this.$demo.$session.get("user", {});
    this.$api.http("poster", {}, (r) => {
      this.ext = r;
      user.openid = "2";
      this.onshares();
      if (user.openid) {
        this.$api.http(
          "postermy",
          { openid: user.openid },
          (s, c) => {
            this.isbtn = c === 200 ? 1 : 2;
            this.onshares();
          },
          "post",
          false,
          [200, 411]
        );
      } else {
        this.$toast("请绑定微信");
      }
    });
  },
};
</script>
<style lang='less' scoped>
.poster {
  overflow-y: scroll;
}
.player {
  height: 200px;
  background-color: #222;
  color: #fff;
}
.head {
  padding: 10px;
  font-weight: 650;
  line-height: 1.2;
  h2 {
    font-size: 18px;
  }
  .content {
    font-size: 14px;
  }
  .price {
    text-align: right;
    font-size: 16px;
    color: tomato;
    padding: 4px 0;
  }
}
.btn {
  position: sticky;
  bottom: 0;
  padding: 10px 28%;
  box-sizing: border-box;
}
</style>
