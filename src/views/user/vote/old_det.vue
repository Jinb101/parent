<template>
  <div>
    <div class="demo_scrollbar det">
      <div class="vote" @touchstart.stop="clicknum++">
        <div
          class="music_box"
          v-if="det.music"
          :class="[{ pause: !isplay }, { play: plays }]"
          @click="isplay = !isplay"
        >
          <van-icon name="music-o" />
        </div>
        <div class="vote_h1">
          <div class="screen_fixed">
            <!-- <div class="img" v-if="det.cover_image">
            <img :src="det.cover_image" alt="" class="db_image" />
          </div> -->
          </div>
          <div class="h2_name">
            <h2>“{{ votetitle[0] || "" }}”</h2>
            <p v-if="votetitle[1]">{{ votetitle[1] }}</p>
          </div>
          <div class="view_cont">
            <h6 class="no">活动内容</h6>
            <div class="content">
              {{ det.content }}
            </div>
            <div class="time">
              <h6>活动时间</h6>
              <p>{{ votetime.t }}</p>
            </div>
            <div class="rule">
              <h6>活动规则</h6>
              <p>
                每个微信号每天可投票点赞{{ det.number_votes }}次，每次{{
                  det.score_per_vote
                }}分
              </p>
              <p v-if="det.comment_score > 0">
                首次参与评论，得{{ det.comment_score }}分
              </p>
              <p v-if="det.completion_score > 0">
                首次观看作品时长超过 80% 时，得{{ det.completion_score }}分
              </p>
              <p>可发动亲朋好友积极参与点赞，但严禁采取技术手段刷票</p>
              <p>系统自带刷票监控，一经发现，即刻取消参赛资格</p>
            </div>
            <div class="time box flex" v-if="votetime.v === 2">
              <div class="ico"><van-icon name="underway" /></div>
              <div class="text">
                <p>距离投票结束还有：</p>
                <p class="n">
                  <b>{{ endtime[0] }}</b
                  >天<b>{{ endtime[1] }}</b
                  >时<b>{{ endtime[2] }}</b
                  >分<b>{{ endtime[3] }}</b
                  >秒
                </p>
              </div>
            </div>
          </div>
          <v-p ref="page" @on-page="onPage">
            <ul class="child_list">
              <li
                v-for="(i, j) in item"
                :key="j"
                @click.stop="ondet(i)"
                class="flex"
              >
                <div class="logo">
                  <van-image lazy-load fit="contain" :src="toimageshow(i)">
                    <template v-slot:loading>未设置封面</template>
                    <template v-slot:error>未设置封面</template>
                  </van-image>
                </div>
                <div class="text">
                  <div class="title">
                    {{ i.full_name }} <b>({{ i.score }}) 分</b>
                  </div>
                  <p class="rank">
                    排名{{ i.ranking }}
                    <b v-if="i.ranking > 1"
                      >距离上一名票数{{ i.from_previous_place }}分</b
                    >
                  </p>
                  <div class="status">去投票</div>
                </div>
              </li>
            </ul>
          </v-p>
        </div>
      </div>
      <transition name="van-fade">
        <div class="r_b_btn" v-if="det.number > 0" @click="open2 = true">
          排名
        </div>
      </transition>
      <v-f v-model="open" :text="childdet.full_name" index="600">
        <div class="vote_h3">
          <div class="player" v-if="childdet.video">
            <v-v
              :urls="childdet.video"
              @progress="onprogressvideo"
              progress="80"
            ></v-v>
          </div>
          <div
            class="swipe"
            v-else-if="childdet.picture && childdet.picture.length"
          >
            <van-swipe>
              <van-swipe-item v-for="(x, y) in childdet.picture" :key="y">
                <van-image
                  :src="x"
                  fit="contain"
                  @click.stop="appShowImage(childdet.picture, y)"
                ></van-image>
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="rank flex">
            <section>
              <b>{{ childdet.ranking }}</b>
              <p>排名</p>
            </section>
            <section v-if="+childdet.ranking > 1">
              <b>{{ childdet.from_previous_place }}</b>
              <p>距离上一名积分</p>
            </section>
            <section>
              <b>{{ childdet.score }}</b>
              <p>积分</p>
            </section>
          </div>
          <div class="content">
            <p>班级：{{ childdet.grade }} {{ childdet.nickname }}</p>
            <p>学号：{{ childdet.no }}</p>
            <p>作品说明：{{ childdet.content || "暂无" }}</p>
          </div>
          <template v-if="votetime.v === 2">
            <div class="goods" @click="onsavevote">
              <van-icon name="thumb-circle" />
              点赞
            </div>
          </template>
          <van-divider content-position="left"
            >评论 ({{ commentlen }})</van-divider
          >
          <ul class="comment_list">
            <li
              v-for="(i, j) in commentlist"
              :key="j"
              class="flex van-hairline--bottom"
              @click.stop="onwritewrite(i)"
            >
              <v-a class="logo" :src="i.avatar"></v-a>
              <div class="text">
                <h2>{{ i.name }}</h2>
                <p v-html="i.comment"></p>
              </div>
            </li>
          </ul>
          <v-c unfocus v-model="comment.msg" @change="onchangecomment"></v-c>
        </div>
      </v-f>
      <v-f v-model="open1" text="投票成功" index="610">
        <div class="vote_h4">
          <div class="status"><van-icon name="success" />投票成功</div>
          <p>你已投票，快去再给 TA 拉拉票吧</p>
          <div class="show_image" v-if="det.cover_image">
            <van-image :src="det.cover_image" fit="cover"></van-image>
          </div>
          <div class="box flex">
            <div class="names">
              <h2>
                <v-a class="ico"></v-a>
                {{ childdet.full_name }}
              </h2>
              <p>当前排名第{{ childdet.ranking }}</p>
            </div>
            <div class="btn" @click="onshare(childdet)">帮 TA 拉票</div>
          </div>
        </div>
      </v-f>
      <v-f v-model="open2" text="排名" index="620">
        <div class="vote_h5">
          <ul>
            <li v-for="(i, j) in rankitem" :key="j" class="flex">
              <v-a class="logo" :src="i.child.base_map"></v-a>
              <div class="text">
                <p>
                  No.{{ j + 1 }} {{ i.full_name }}
                  <b>{{ tonumvote(i.score) }}% ({{ i.score }}分)</b>
                </p>
                <div class="run">
                  <i :style="{ width: tonumvote(i.score) + '%' }"></i>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </v-f>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import vS from "../../newpublic/search.vue";
import vP from "../../newpublic/page.vue";
import vF from "../../newpublic/fixed.vue";
import vA from "../../newpublic/avatar.vue";
import vV from "./play.vue";
import vC from "../../class/comment.vue";
export default {
  data() {
    return {
      oid: "",
      id: "",
      did: "",
      det: {},
      ext: {},
      music: "",
      isplay: true,
      plays: false,
      clicknum: 0,
      clicknumdestory: false,
      audio: null,
      searchval: "",
      open: false,
      open1: false,
      open2: false,
      timer: false,
      endtime: [],
      item: [],
      childdet: {},
      rankitem: [],
      comment: {
        msg: "",
      },
      commentlist: [],
      commentlen: 0,
    };
  },
  components: { vS, vP, vF, vA, vV, vC },
  computed: {
    votetitle() {
      if (!this.det.activity_name) {
        return [""];
      }
      let t = (this.det.activity_name + "").split("/#br#/");
      return t;
    },
    votetime() {
      if (this.det.end_time && this.det.start_time) {
        let t = Math.floor(Date.now() / 1e3);
        if (t > this.det.end_time) {
          return { t: "活动已结束", v: 1 };
        }
        if (t < this.det.start_time) {
          return { t: "活动还未开始", v: 1 };
        }
        let s = demo.timeout(this.det.start_time, "object");
        let e = demo.timeout(this.det.end_time, "object");
        let r = [
          s.y,
          "年",
          s.m,
          "月",
          s.d,
          "日至",
          e.y,
          "年",
          e.m,
          "月",
          e.d,
          "日",
        ];
        return { t: r.join(""), v: 2 };
      }
      return { t: "活动已结束", v: 0 };
    },
    btnvotetext() {
      let n = this.votetime.v;
      if (n === 2) return "投票";
      return "查看";
    },
  },
  watch: {
    clicknum() {
      if (!this.isplay) {
        if (this.audio) {
          this.audio.pause();
        }
        return 0;
      }
      if (this.audio && !this.clicknumdestory) {
        if (this.plays) {
          this.audio.pause();
        } else {
          this.audio.play();
        }
      }
    },
    isplay(n) {
      demo.$session.set("votemusicstatus", n ? 1 : 0);
      this.clicknumdestory = false;
      this.clicknum++;
      this.$nextTick(() => {
        this.clicknumdestory = true;
      });
    },
    "votetime.v"() {
      this.ontimerend(this.det.end_time);
    },
    open2(n) {
      if (n && !this.rankitem.length) {
        this.onrank();
      }
    },
  },
  inject: ["appShare", "appShowImage"],
  methods: {
    // 生成 评论 配置
    onwritewrite(e) {
      this.comment = {
        msg: "@" + e.name + ":",
        parent_id: e.voters_comment_id,
        r_id: e.u_id,
        toname: e.name,
      };
    },
    // 获取评论 列表
    onwritelist(limit = 20) {
      this.$api.http(
        "a2023052308",
        { page: 1, limit, voters_id: this.childdet.voters_id },
        (r) => {
          this.commentlen = r.total;
          if (r.total > 20) {
            this.onwritelist(r.total + 1);
            return 0;
          }
          this.commentlist = r.list || [];
        }
      );
    },
    // 评论
    onchangecomment(e) {
      let comment = e;
      if (
        this.comment.toname &&
        e.indexOf("@" + this.comment.toname + ":") >= 0
      ) {
        comment = e.replace("@", "回复");
      }
      this.$api.http(
        "a2023052307",
        {
          voters_id: this.childdet.voters_id,
          comment,
          parent_id: this.comment.parent_id || "0",
          r_id: this.comment.r_id || "",
          reply_client: "1",
          open_id: this.oid,
        },
        (res) => {
          this.$toast("评论成功");
          this.comment = {
            msg: "",
          };
          this.commentlist.push(res);
          this.commentlen += 1;
        }
      );
    },
    // 完播率
    onprogressvideo(e) {
      if (this.votetime.v !== 2) {
        return 0;
      }
      this.$api.http(
        "a2023052306",
        {
          voters_id: this.childdet.voters_id,
          open_id: this.oid,
          viewing_duration: e,
        },
        () => {}
      );
    },
    // 计算排行榜
    tonumvote(num) {
      if (num < 1 || this.det.total_score < 1) return 0;
      let n = (num / this.det.total_score) * 100;
      return n.toFixed(2);
    },
    // 图片
    toimageshow(e) {
      let pic = (e.picture || [])[0] || "";
      return pic || (e.child || {}).base_map || "";
    },
    // 投票
    onsavevote() {
      if (this.votetime.v !== 2) {
        return 0;
      }
      this.$api.http(
        "a2023052305",
        { voters_id: this.childdet.voters_id, open_id: this.oid },
        () => {
          this.$toast("投票成功");
          this.ondet(this.childdet);
          this.$api.http(
            "a2023052302",
            { vote_id: this.did, open_id: this.oid },
            (r) => {
              this.det = r;
            }
          );
          this.onPage(1);
          this.open1 = true;
        }
      );
    },
    // 分享
    onshare(r, flag) {
      let n = ["请为", r.full_name, "投上一票！"].join("");
      let link = this.$js.wxshareh5("vote", {
        id: r.voters_id,
        did: r.vote_id,
        path: this.$route.path,
      });
      this.$vx({
        link,
        desc: n,
        logo: r.picture ? r.picture[0] || "" : "",
        title: (this.det.activity_name + "").replace("/#br#/", " "),
      });
      if (flag) return 0;
      this.$refs.view.$share();
    },
    // 首页数据
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (!this.det.vote_id) {
        setTimeout(() => {
          this.onPage(page);
        }, 1000);
        return 0;
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "a2023052303",
        { page, vote_id: this.det.vote_id, open_id: this.oid },
        (e) => {
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    // 倒计时
    ontimerend(num) {
      if (this.votetime.v === 2) {
        demo.es6().downTime(
          Date.now(),
          (e) => {
            this.endtime = e.arr || [0, 0, 0, 0];
          },
          num * 1e3
        );
      } else {
        this.$toast(this.votetime.t);
      }
      this.endtime = [0, 0, 0, 0];
    },
    // 详情
    ondet(e) {
      this.$api.http(
        "a2023052304",
        { voters_id: e.voters_id, open_id: this.oid },
        (r) => {
          this.childdet = r;
          this.open = true;
          this.onwritelist();
          this.onshare(r, true);
        }
      );
    },
    // 音乐
    onaudio() {
      let t = this;
      let a = demo._div("audio");
      a.setAttribute("autoplay", true);
      a.setAttribute("loop", "loop");
      a.src = this.det.music;
      a.addEventListener("canplaythrough", () => {
        console.log("加载完成可播放");
        try {
          if (t.isplay) {
            a.play();
          }
        } catch (err) {}
      });
      a.addEventListener("error", () => {
        console.log("加载失败");
        a.setAttribute("autoplay", false);
      });
      a.addEventListener("play", () => {
        console.log("正在播放");
        t.plays = true;
        t.clicknumdestory = true;
        if (!t.isplay) {
          a.pause();
        }
      });
      a.addEventListener("pause", () => {
        console.log("暂停");
        t.plays = false;
      });
      this.audio = a;
      document.body.appendChild(a);
    },
    // 初始化
    oninit() {
      this.oid = "";
      let p = this.$route.params;
      this.id = p.cid || "";
      this.did = p.id;
      let id = "";
      // 获取活动
      // 获取列表
      // 点击列表获取宝宝
      // 若 id 获取宝宝
      // id 作品 id
      // did 活动 id

      // 获取详情
      this.$api.http("a2023052302", { vote_id: this.did, open_id: id }, (r) => {
        this.det = r;
        let link = this.$js.wxshareh5("vote", {
          id: "",
          did: r.vote_id,
          path: this.$route.path,
        });
        this.$vx({
          link,
          desc: "您的好友分享给你为宝宝投票",
          logo: this.det.cover_image,
          title: (this.det.activity_name + "").replace("/#br#/", " "),
        });
        if (r.music) {
          this.onaudio();
        }
      });
      this.$nextTick(() => {
        if (this.id) {
          this.ondet({ voters_id: this.id });
        }
      });
    },
    // 排行榜
    onrank() {
      this.$api.http(
        "a2023052303",
        {
          page: 1,
          limit: this.det.number + 1,
          vote_id: this.det.vote_id,
          open_id: this.oid,
          type: "rank",
        },
        (v) => {
          this.rankitem = v;
        }
      );
    },
  },
  mounted() {
    this.isplay = demo.$session.get("votemusicstatus", 1) * 1 === 1;
    this.oninit();
  },
  destroyed() {
    if (this.audio) {
      document.body.removeChild(this.audio);
      this.audio = null;
    }
  },
};
</script>
<style lang='less' scoped>
@color: #62b290;
.det {
  height: 100%;
}
.vote {
  .music_box {
    position: fixed;
    right: 15px;
    top: 15px;
    z-index: 300;
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(34, 34, 34, 0.5);
    color: #fff;
    box-sizing: border-box;
    transform: scale(0.8);
    .van-icon {
      font-size: 45px;
    }
    border: 2px solid #fff;
    &.pause::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 150%;
      height: 4px;
      z-index: 301;
      background-color: #fff;
      transform: rotate(45deg);
      transform-origin: 0 100%;
    }
    &.play {
      animation: runrotate360 3s linear infinite;
    }
  }
  .screen_fixed {
    position: fixed;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100%;
    z-index: 1;
    background-color: @color;
    .img {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30%;
      img {
        object-fit: cover;
      }
    }
  }
  .h2_name {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 20px 0;
    font-weight: 650;
    line-height: 1.2;
    text-align: center;
    h2 {
      font-size: 24px;
      padding: 10px 0;
      box-sizing: border-box;
      max-width: 320px;
    }
    p {
      font-size: 18px;
      padding: 8px 15px;
      border-radius: 15px;
      background-color: #fff;
      color: @color;
      letter-spacing: 2px;
      max-width: 280px;
    }
  }
  .vote_h1 {
    > :not(.screen_fixed) {
      position: relative;
      z-index: 10;
    }
    .h2_name,
    .view_cont {
      position: relative;
      z-index: 12;
      color: #fff;
    }
    .view_cont {
      color: @color;
      margin: 0 auto;
      width: 90%;
      background-color: #fff;
      box-sizing: border-box;
      padding: 15px 15px 20px;
      font-size: 14px;
      &::after,
      &::before {
        content: "";
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 10px;
        height: 100%;
        background: radial-gradient(circle, #fff, #fff 4px, transparent 5px);
        background-size: 10px 10px;
      }
      &::after {
        left: -5px;
      }
      &::before {
        right: -5px;
      }
      .content {
        line-height: 1.5;
      }
      .btn {
        margin: 20px auto 0;
        width: 70%;
      }
      .time,
      .rule {
        line-height: 1.2;
      }
      h6 {
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        display: inline-block;
        font-weight: 600;
        letter-spacing: 1px;
        margin-top: 12px;
        &::before,
        &::after {
          position: absolute;
          content: "";
          top: 0;
          bottom: 0;
          margin: auto;
          height: 14px;
          background-color: @color;
          width: 2px;
        }
        &::before {
          left: 0;
        }
        &::after {
          right: 0;
        }
        &.no {
          margin-top: 0;
        }
      }
    }
    .box {
      @h: 80px;
      margin-top: 12px;
      background-color: darken(@color, 10%);
      height: @h;
      color: #fff;
      section {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        font-size: 13px;
        b {
          font-weight: 650;
          padding: 10px 0 0;
          font-size: 22px;
        }
      }
      .ico {
        width: @h;
        height: 100%;
        font-size: 40px;
        background-color: darken(@color, 15%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f5f5f5;
      }
      .text {
        box-sizing: border-box;
        padding-left: 10px;
        width: calc(100% - @h);
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-size: 13px;
        .n {
          padding: 5px 0;
          font-size: 16px;
          b {
            font-weight: 650;
            padding: 0 5px;
          }
        }
      }
    }
    .child_list {
      margin-top: 10px;
      box-sizing: border-box;
      padding: 0 10px 40px;
      li {
        box-sizing: border-box;
        position: relative;
        margin-bottom: 12px;
        background-color: #fff;
        border-radius: 8px 0 8px 8px;
        overflow: hidden;
        font-size: 14px;
        color: #999;
        // padding-bottom: 60px;
        .logo {
          width: 90px;
          height: 90px;
          margin-right: 10px;
        }
        .text {
          width: calc(100% - 100px);
          box-sizing: border-box;
          position: relative;
          padding-right: 50px;
        }
        .status {
          position: absolute;
          right: 5px;
          top: 0;
          bottom: 0;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          box-sizing: border-box;
          height: 50px;
          font-size: 14px;
          border: 1px solid #999;
          border-radius: 50%;
          transform: scale(0.8);
          opacity: 0.9;
        }
        // .van-button {
        // position: absolute;
        // right: 0;
        // bottom: 10px;
        // width: 80px;
        // }
        // .circle {
        //   position: absolute;
        //   left: 0;
        //   top: 0;
        //   width: 40px;
        //   height: 40px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   background-color: rgba(34, 34, 34, 0.4);
        //   z-index: 12;
        //   font-size: 16px;
        //   font-weight: 600;
        //   border-radius: 50%;
        //   color: #fff;
        //   transform: scale(0.8);
        // }
        // .image {
        //   height: 165px;
        // }
        .title {
          padding: 8px 5px;
          font-size: 14px;
        }
        .rank {
          padding: 5px;
          b {
            font-size: 12px;
          }
        }
      }
    }
  }
}
.r_b_btn {
  position: fixed;
  right: 8px;
  bottom: 8px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: darken(@color, 20%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  z-index: 300;
  transform: scale(0.8);
}
.vote_h4 {
  box-sizing: border-box;
  padding-bottom: 60px;
  color: @color;
  font-size: 14px;
  .status {
    padding: 30px 0 15px;
    text-align: center;
    font-size: 22px;
    letter-spacing: 2px;
    line-height: 20px;
    .van-icon {
      vertical-align: top;
    }
    & + p {
      text-align: center;
    }
  }
  .show_image {
    width: 90%;
    margin: 20px auto 0;
  }
  .box {
    @bg: #e0f8e7;
    width: 90%;
    margin: 20px auto 0;
    background-color: @bg;
    height: 60px;
    .names {
      width: calc(100% - 80px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 12px;
      h2 {
        line-height: 30px;
        font-size: 15px;
        margin-bottom: 2px;
        .ico {
          width: 30px;
          height: 30px;
          display: inline-block;
          margin-right: 4px;
          vertical-align: top;
          background-color: #fff;
          border-radius: 50%;
        }
      }
    }
    .btn {
      width: 80px;
      text-align: center;
      background: darken(@bg, 10%);
      line-height: 60px;
    }
  }
}
.vote_h3 {
  h1 {
    font-weight: 650;
    font-size: 18px;
    padding: 15px 10px;
    border: 1px dashed #eee;
  }
  .player,
  .swipe,
  .van-swipe {
    height: 210px;
  }
  .rank {
    padding: 10px 5px;
    section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 14px;
      b {
        font-size: 16px;
        font-weight: 650;
        padding: 5px 0;
        color: #38f;
      }
    }
  }
  .content {
    box-sizing: border-box;
    padding: 10px 20px;
    > p {
      font-size: 14px;
      padding: 0 10px;
      line-height: 1.2;
      margin-top: 8px;
      color: #999;
    }
  }
  .goods {
    margin: 0 auto;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    display: flex;
    font-size: 12px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    .van-icon {
      margin-bottom: 5px;
      font-size: 50px;
    }
  }
  .comment_list {
    box-sizing: border-box;
    padding: 0 10px 80px;
    li {
      padding: 10px 0;
      .logo {
        width: 40px;
        height: 40px;
        margin-right: 8px;
        transform: scale(0.9);
      }
      .text {
        width: calc(100% - 48px);
        font-size: 15px;
        h2 {
          font-weight: 650;
          padding: 5px 0;
        }
        > p {
          color: #999;
          line-height: 1.2;
        }
      }
    }
  }
}
.vote_h5 {
  li {
    padding: 10px 20px;
    box-sizing: border-box;
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      background-color: #f8f7fa;
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: calc(100% - 40px);
      p {
        font-size: 14px;
        position: relative;
        color: #999;
        line-height: 18px;
        b {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 12px;
        }
      }
      .run {
        margin-top: 8px;
        width: 100%;
        height: 2px;
        background-color: #eee;
        position: relative;
        i {
          position: absolute;
          height: 2px;
          left: 0;
          top: 0;
          background-color: #38f;
          transition: all 0.3s;
        }
      }
    }
  }
}
@keyframes runrotate360 {
  0% {
    transform: rotate(0) scale(0.8);
  }
  100% {
    transform: rotate(360deg) scale(0.8);
  }
}
</style>
