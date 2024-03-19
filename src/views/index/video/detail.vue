<template>
  <div class="work_baby_detail">
    <v-tool-title :text="title">
      <span @click="s = !s">{{ s ? "取消" : "" }}大屏</span>
    </v-tool-title>
    <iframe :src="src"
            frameborder="0"
            class="play"
            :class="{ auto: s }"
            allowfullscreen="allowfullscreen"
            mozallowfullscreen="mozallowfullscreen"
            msallowfullscreen="msallowfullscreen"
            oallowfullscreen="oallowfullscreen"
            webkitallowfullscreen="webkitallowfullscreen"
            ref="frame"></iframe>
    <div class="tops">
      <div>
        <h3 class="name">{{ detail.video_name }}</h3>
        <p class="time">
          开放时间：
          <b>
            {{ detail.morning_start }}~{{ detail.morning_end }}
            {{ detail.afternoon_start }}~{{ detail.afternoon_end }}
          </b>
        </p>
      </div>

      <!-- <div class=" watch_list"
           >
        <p class="watch_title">观看人员 :</p>
        <v-page ref="page"
                @on-page="onWachPage">
          <div v-for="(i, j) in list"
               :key="j">
            <div class="watch_box"
                 :class="i.status === 1 || user.id === i.id ? 'status_g' : 'status_gray'">
              <b class="view_name">{{ i.user.nickname }} </b>
              <b class="viewing">{{ i.viewing_duration }}秒
              </b>
            </div>
          </div>
        </v-page>
      </div> -->

      <!-- <span class="qr" @click="onshowqr = true"><van-icon name="qr" /></span> -->
    </div>
    <div class="view">
      <section v-for="(i, j) in item"
               :key="j + '-s'"
               class="van-hairline--bottom"
               @click="onDetail(i)">
        <p class="name">{{ i.video_name }}</p>
        <p>
          开放时间：<b>{{ i.morning_start }}~{{ i.morning_end }}
            {{ i.afternoon_start }}~{{ i.afternoon_end }}</b>
        </p>
        <van-icon name="arrow" />
      </section>
    </div>
    <transition name="van-fade">
      <div class="app_show_fixed top"
           style="z-index: 777"
           v-if="s">
        <div class="recturnc"
             @click="s = false">
          <van-icon name="arrow-up" />
        </div>
        <iframe :src="src"
                class="db_image c"
                :class="{ ios: isios }"
                frameborder="0"
                ref="frame"
                :style="styls"></iframe>
      </div>
    </transition>
    <!-- <van-popup v-model="onshowqr" round>
      <div class="qrcodebox">
        <v-q :urls="srcmax"></v-q>
      </div>
    </van-popup> -->
  </div>
</template>

<script>
/* eslint-disable */
import vQ from "./qr.vue";
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
      // srcmax: "",
      // onshowqr: false,
      styls: {},
      isios: false,
      timerID: null,
      isOntime: null,
    };
  },
  components: { vQ },
  watch: {
    s(n) {
      if (n) {
        demo.js('meta[name="viewport"]').attr("content", "");
        demo.js(".app_view").attr("style", "overflow:scroll");
        this.$nextTick(() => {
          if (!this.isios) {
            let rect = demo.js("body").square();
            this.styls = { width: rect.h + "px", height: rect.w + "px" };
          }
        });
      } else {
        this.styls = {};
        demo.js(".app_view").attr("style", "overflow:hidden");
        demo
          .js('meta[name="viewport"]')
          .attr(
            "content",
            "width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui, viewport-fit=cover"
          );
      }
    },
  },
  inject: ["appBack"],
  methods: {

    init() {
      this.$api.http("babyVideoCheck", { baby_id: this.id }, (e) => {
        if (+e.is_on === 1) {
          this.$model.info("抱歉，该宝贝在线未开启", 2);
          this.appBack(1);
          return 0;
        }
        this.onPage(1);
         // 定时 请求
         this.isOntime = setInterval(() => {
          this.getIson()
        }, 20000);
      });
    },
    getIson() {
      this.$api.http("babyVideoCheck", { baby_id: this.id }, (r) => {
        if (+r.is_on === 1) {
          clearInterval(this.timerID);
          clearInterval(this.isOntime);
          this.sendWatch(3)
          this.$model.info("抱歉，该宝贝在线未开启", 2);
          this.appBack(1);
          return 0;
        }
      });
    },
    onPage(e) {
      try {
        this.$api.http(
          "babyVideoDetail",
          { baby_id: this.id, page: e, limit: 20 },
          (r) => {
            this.detail = r.video;
            let type = +this.detail.device_type === 1;
            let definition = false;
            if (this.detail.device_type === undefined) {
              type = true;
            }
            let a = demo.$session.get("user");
            let h5 = this.$demo.es6().encrypt(
              {
                token: type ? this.detail.access_token : this.detail.getkit_token,
                url: this.detail.hd_address,
                time: [
                  this.detail.morning_start,
                  this.detail.morning_end,
                  this.detail.afternoon_start,
                  this.detail.afternoon_end,
                ],
                now: this.detail.server_time, // 当前时间 服务器返
                // width: this.$refs.frame.clientWidth,
                // height: this.$refs.frame.clientHeight,
                type,
                channid: this.detail.channeiid || 0,
                deviceid: this.detail.device_id || "",
                ooo: {
                  t: a.phone || "",
                  o: a.openid || "",
                  po: a.pay_openid || "",
                  b: this.id,
                  id: demo.$local.get("nid"),
                },
              },
              "baby",
              "web"
            );

            // let h5share =
            //   "definition=" +
            //   definition +
            //   "&id=" +
            //   this.id +
            //   "&n=" +
            //   demo.$local.get("nid", "") +
            //   "&t=" +
            //   demo.$local.get("token", "");
            this.title = this.detail.video_name;
            this.item = r.videos;

            if (this.$js.env) {
              this.src =
                this.$js.api.h5 +
                "h5/surveillance/?h5=" +
                h5 +
                "&definition=" +
                definition;
            }

            if (r.bind_is_expire !== 0) {
              this.$model.model(
                "你的可观看时间已到期，请点击确定去续费！",
                "无法查看宝贝在线",
                (res) => {
                  if (res) {
                    this.appPath("/pay_renew");
                  }
                }
              );
              return 0;
            }

            this.src =
              this.$js.api.h5 +
              "h5/surveillance/?h5=" +
              h5 +
              "&definition=" +
              definition;
         // 定时器 10s 发送一次观看记录
        this.timerID = setInterval(() => {
            this.sendWatch(2);
          }, 10000);
            // this.srcmax =
            //   this.$js.api.h5 + "h5/surveillance/view.html?" + h5share;
          }
        );
      } catch (error) {
        this.sendWatch(3);
      }
    },
    onDetail(e) {
      this.sendWatch(3)
      this.id = e.baby_id;
      this.onPage(1);
    },
    // onWachPage(page, f) {
    //   if (!f) {
    //     return this.$refs.page.onRefresh();
    //   }
    //   if (+page === 1) {
    //     this.list = [];
    //   }
    //   this.$api.http("babyWatchList", { baby_id: this.id, page: page }, (r) => {
    //     if (+page === 1) {
    //       this.list = [];
    //     }
    //     this.list = this.list.concat(r.list)
    //     this.$refs.page.onFinish(r.list.length < 20);
    //   });
    // },
    // 观看记录
    // getWatchList() {
    //   this.$api.http("babyWatchList", { baby_id: this.id, page: 1 }, (r) => {
    //     this.list = r.list;
    //   });
    // },
    sendWatch(type = 2) {
      // 2 观看中 3 观看结束
      this.$api.http("babywatch", { baby_id: this.id, type: type }, (r) => {
        // this.$emit("watch", r);
        console.log('观看记录', r);
      });
    },
  },
  mounted() {
    const user = demo.$session.get('user', {})
    this.user = user
    this.id = this.$route.params.id;
    this.title = this.$route.meta.title;
    this.init();
    // this.isios = demo.es6().mobile().system.toLowerCase().indexOf("android") < 0;
  },
  // 页面卸载时 清楚计时器
  // beforeDestroy() {
  //   clearInterval(this.timerID);
  //   this.sendWatch(3)
  // },
  destroyed() {
    clearInterval(this.timerID);
    clearInterval(this.isOntime);
    this.sendWatch(3)
  },
};
</script>

<style lang='less'
       scoped>
      .work_baby_detail {
        .play {
          height: 210px;
          display: block;
          width: 100%;
          background-color: #222;
          // &.auto {
          //   position: fixed;
          //   left: 0;
          //   top: 46px;
          //   width: 100%;
          //   height: calc(100% - 46px);
          //   z-index: 55;
          // }
        }

        .tops {
          border-bottom: 8px solid #f5f5f5;
          position: relative;
          z-index: 5;
          display: flex;
          justify-content: space-between;

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

          .qr {
            position: absolute;
            right: 10px;
            top: 0;
            width: 20px;
            height: 20px;
            font-size: 20px;
            color: #999;
            bottom: 0;
            margin: auto;
            z-index: 12;
            opacity: 0.6;
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

      .c {
        transition: all 0.3s;
        transform-origin: 0 0;
        transform: rotate(90deg) translateY(-100%);
        width: 667px;
        height: 375px;

        &.ios {
          width: 100%;
          height: 100%;
          transform: rotate(0deg) translateY(0);
        }
      }

      .recturnc {
        position: absolute;
        right: 10px;
        top: 10px;
        background-color: #fff;
        z-index: 999;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .qrcodebox {
        width: 300px;
      }

      .watch_list {
        width: 50%;
        max-height: 200px;
        padding: 10px 0;

        .watch_title {
          font-size: 14px;
          font-weight: 500;
          color: #999;
        }
      }

      .watch_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px !important;
        margin-top: 8px;

        .view_name {
          width: 60%;
          white-space: nowrap;
          /* 确保文本在一行内显示 */
          overflow: hidden;
          /* 隐藏溢出的内容 */
          text-overflow: ellipsis;
          /* 使用省略号表示溢出的文本 */
        }

        .viewing {
          margin-right: 10px;
        }
      }

      .status_g {
        color: chartreuse;
      }

      .status_gray {
        color: rgba(128, 128, 128, 0.699);
      }

      /deep/ .van-loading__text {
        font-size: 0.3rem !important;
      }

      /deep/ .van-list__finished-text {
        font-size: 0.3rem !important;
      }

      .app_top {
        border-bottom: 1px solid #f5f5f5;
      }
    </style>
