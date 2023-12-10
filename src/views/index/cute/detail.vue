<template>
  <div class="cute_detail">
    <v-tool-title :text="title" path="/"> </v-tool-title>
    <!-- player -->
    <div class="player" id="player-video-cute"></div>
    <v-tool-scroll ids="cute_detail-scroll" class="cont">
      <!-- title -->
      <div class="title">
        <h6 class="van-multi-ellipsis--l2">{{ title }}</h6>
        <div class="tool flex">
          <span class="time">时间：{{ appTimeout(det.create_time) }}</span>
          <span class="count">浏览：{{ appCountNum(det.pageview) }}</span>
        </div>
        <span @click="onClickGoods" class="goods">
          <van-icon
            name="good-job"
            color="tomato"
            size="20"
            v-if="det.like === 1"
          />
          <van-icon name="good-job-o" color="#999" size="20" v-else />
          <b>{{ det.quantity }}</b>
        </span>
      </div>
      <!-- list  -->
      <div class="list">
        <h5>相关视频</h5>
        <section
          v-for="(i, j) in list"
          :key="j + '-list'"
          class="van-hairline--bottom flex"
          @click="appPath('/cute_detail/' + i.id)"
        >
          <div class="avatar">
            <van-image
              :src="i.cover.length ? i.cover[0] : ''"
              fit="cover"
              radius="5px"
            ></van-image>
          </div>
          <div class="text">
            <h6 class="van-multi-ellipsis--l2">{{ i.title || "精彩瞬间" }}</h6>
            <div class="tool flex">
              <span class="time">时间：{{ appTimeout(i.create_time) }}</span>
              <span class="count">浏览：{{ appCountNum(i.pageview) }}</span>
            </div>
          </div>
        </section>
      </div>
    </v-tool-scroll>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      det: {},
      list: [],
      player: null,
      id: "",
    };
  },
  watch: {
    "$route.params"(n) {
      if (n.id) {
        this.id = n.id;
      }
    },
    id() {
      this.init();
    },
  },
  inject: ["appTimeout", "appCountNum", "appBack", "appPath", "appIsLogin"],
  methods: {
    onClickGoods() {
      this.appIsLogin(() => {
        let f = this.det.like === 1;
        let text = f ? "已取消点赞" : "点赞成功";
        let val = this.det.quantity;
        this.$api.http("cuteLike", { lovable_id: this.id }, () => {
          this.$model.info(text, 2);
          this.det.like = f ? 2 : 1;
          this.det.quantity = f ? val - 1 : val + 1;
        });
      });
    },
    toDatas() {
      let tk = this.$demo.$local.all();
      let e = this.$demo.$local.get("wxConfig", {});
      let h5 = this.$demo.es6().encrypt(
        {
          id: this.id,
          nid: tk.nid,
          to: encodeURIComponent(
            window.location.href.replace(window.location.hash, "")
          ),
          name: "youeryuanweb" + tk.nid,
          api: encodeURIComponent(this.$js.api.http),
          version: this.$demo.version,
          type: "web",
        },
        "cute",
        "web"
      );
      return h5;
    },
    init() {
      this.$api.http(
        "cuteDetail",
        {
          lovable_id: this.id,
          page: 1,
          limit: 10,
        },
        (e) => {
          // console.log(e);
          this.title = e.details.title || "精彩瞬间";
          this.det = e.details;
          let id = this.det.id;
          this.list = e.list.filter((r) => {
            return r.id !== id;
          });
          if (!this.det.video) return this.$model.info("视频已删除", 2);
          this.$vx({
            name: this.det.title,
            logo: (this.det.cover || [])[0],
            link: this.$js.api.h5 + "h5/cute/?h5=" + this.toDatas(),
          });
          // eslint-disable-next-line
          this.player = new DPlayer({
            container: this.$demo.$.id("player-video-cute"),
            video: { url: this.det.video, pic: (this.det.cover || [])[0] },
          });
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id;
  },
};
</script>
<style lang='less' scoped>
.cute_detail {
  height: 100%;
  .player {
    height: 211px;
    background-color: #eee;
  }
  .cont {
    height: calc(100% - 257px);
  }
  .title {
    height: 96px;
    border-bottom: 8px solid #eee;
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px 10px 0;
    position: relative;
    .goods {
      min-width: 20px;
      height: 20px;
      right: 10px;
      top: 15px;
      cursor: pointer;
      position: absolute;
      .van-icon {
        vertical-align: middle;
      }
      b {
        font-weight: 400;
        font-size: 13px;
      }
    }
  }
  h6 {
    font-size: 15px;
    color: #222;
    margin-bottom: 10px;
    padding-right: 40px;
    line-height: 20px;
    height: 40px;
  }
  .tool {
    color: #666;
    font-size: 12px;
    .time {
      flex: 1;
    }
  }
  .list {
    h5 {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #eee;
      font-size: 15px;
      padding: 0 10px;
      color: #999;
    }
    section {
      padding: 10px;
      .avatar {
        width: 100px;
        height: 100px;
        margin-right: 17px;
      }
      h6 {
        border-bottom: 0;
      }
      .text {
        width: calc(100% - 117px);
      }
    }
  }
}
</style>
