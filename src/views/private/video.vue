<template>
  <div class="pri_video">
    <van-empty description="暂无"
               v-if="!item.length" />
    <section v-for="(i, j) in list"
             :key="j + '-video'">
      <h6 class="van-ellipsis"
          @click="onPath(i)">{{ i.title }}</h6>
      <div class="event"
           @click="onDetail(i)">
        <van-icon name="ellipsis" />
      </div>
      <div class="poster">
        <van-icon name="play"
                  v-if="!i.player"
                  class="aa"
                  @click="onPlayer(i, j)" />
        <van-image :src="i.pic"
                   radius="5px"
                   fit="cover"
                   v-if="!i.player"
                   @click="onPlayer(i, j)"></van-image>
        <div :id="i.playerId"
             v-show="i.player"
             class="video"></div>
      </div>
      <div class="tool flex"
           @click="onPath(i)">
        <span class="time">时间：{{ appTimeout(i.create_time, "ymd") }}</span>
        <span class="goods"
              @click.stop="onToggleGood(i, j)">
          <van-icon name="good-job-o"
                    v-if="i.like === 2" />
          <van-icon name="good-job"
                    v-else
                    color="tomato" />
          <b :class="{ col_danger: i.like !== 2 }">{{ i.quantity }}</b>
        </span>
        <span class="count"><van-icon name="eye-o" />{{ appCountNum(i.pageview) }}</span>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tps: { type: String, default: "index-video" },
    goods: { type: Boolean, default: false },
  },
  watch: {
    item: {
      handler() {
        this.setList();
      },
      deep: true,
    },
    vuex_share: {
      handler(n) {
        this.setEvent(n);
      },
      deep: true,
    },
  },
  data() {
    return {
      list: [],
      open: 0,
      played: [],
    };
  },
  computed: {
    ...mapState({ vuex_share: "share" }),
  },
  inject: ["appObject", "appTimeout", "appCountNum", "appShare", "appIsLogin"],
  methods: {
    onToggleGood(e, j) {
      let f = e.like === 1;
      let t = f ? "已取消点赞" : "点赞成功";
      this.appIsLogin(() => {
        let v = e.quantity;
        this.$api.http("cuteLike", { lovable_id: e.id }, () => {
          this.$model.info(t, 2);
          this.$set(this.list[j], "like", f ? 2 : 1);
          this.$set(this.list[j], "quantity", f ? v - 1 : v + 1);
        });
      });
    },
    setEvent(e) {
      if (e.type !== this.tps) return 0;
      let ev = this.onOnce(e.id);
      switch (e.event) {
        case "copy":
          this.$demo.$ctrl.c("", ev.video) &&
            this.$model.info("复制视频地址成功", 2);
          break;
        case "detail":
          this.$emit("on-detail", ev);
          break;
        case "share":
          this.$vx({ name: ev.title, logo: ev.pic });
          this.$model.info("请打开右上角选择发送给朋友", 2);
          break;
        case "ungood":
          this.appIsLogin(() => {
            this.$api.http("cuteLike", { lovable_id: e.id }, () => {
              this.$model.info("已取消点赞", 2);
              this.list[ev.sorts].like = 2;
            });
          });
          break;
        case "good":
          this.appIsLogin(() => {
            this.$api.http("cuteLike", { lovable_id: e.id }, () => {
              this.$model.info("点赞成功", 2);
              this.list[this.onOnce(e.id).sorts].like = 1;
            });
          });
          break;
        default:
      }
    },
    onPath(i) {
      this.$emit("on-detail", i);
    },
    onOnce(id) {
      return (
        this.list.filter((r) => {
          return r.id === id;
        })[0] || {}
      );
    },
    onDetail(e) {
      let a = this.$js.def.shareIcon;
      // 检测是否点赞
      let arr = [a.detail, a.copy, a.share];
      arr.push(e.like === 1 ? a.ungood : a.good);
      this.appShare(arr, e, this.tps, e.title);
    },
    onPlayer(i, j) {
      if (!i.video) return this.$model.info("视频失效", 2);
      let f = i.player;
      this.list = this.list.map((r) => {
        r.player = false;
        return r;
      });
      this.list[j].player = !f;
      if (!f) {
        if (this.played[j].play) {
          this.played[j].play();
        }
      } else {
        if (this.played[j].play) {
          this.played[j].pause();
        }
      }
    },
    setList() {
      let ts = this;
      let a = ts.appObject({ i: this.item });
      ts.list = a.i.map((r, index) => {
        r.title = r.title || "[精彩瞬间]";
        r.pic = ts.$demo.$obj(r.cover, 1) === 3 ? r.cover : r.cover[0];
        r.player = false;
        r.playerId = "player-video-" + index;
        r.play = null;
        r.sorts = index;
        return r;
      });
      ts.$nextTick(() => {
        ts.list.map((k, v) => {
          // eslint-disable-next-line
          ts.played[v] = new DPlayer({
            container: ts.$demo.$.id(k.playerId),
            video: { url: k.video, pic: k.pic },
            contextmenu: [{ text: "下载", link: k.video }],
            preload: "none",
          });
          return k;
        });
      });
    },
  },
  mounted() {
    this.setList();
  },
};
</script>
<style lang='less' scoped>
.pri_video {
  section {
    position: relative;
    padding: 0 8px;
    box-sizing: border-box;
  }

  h6 {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding-right: 40px;
  }

  .event {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #999;
  }

  .tool {
    font-size: 12px;
    color: #999;
    height: 30px;
    line-height: 30px;

    .time {
      flex: 1;
    }

    .goods {
      padding-right: 8px;
      min-width: 50px;
      box-sizing: border-box;
    }

    .van-icon {
      vertical-align: middle;
      font-size: 20px;
      margin-right: 5px;
    }
  }

  .poster {
    width: 100%;
    height: 175px;
    margin: 0 auto;
    position: relative;

    .aa {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 60px;
      height: 60px;
      z-index: 3;
      font-size: 40px;
      text-align: center;
      line-height: 60px;
      color: #fff;
      box-shadow: 0 0 10px rgba(204, 204, 204, 0.3);
      border-radius: 50%;
    }

    .video {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}</style>
