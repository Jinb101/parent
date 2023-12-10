<template>
  <div class="v_view">
    <div class="cover" v-if="cover" :style="coverStyle"></div>
    <div class="header flex van-hairline--bottom" v-if="header">
      <transition name="van-slide-down">
        <div class="header_cover" v-if="headerCover" :style="headStyle"></div>
      </transition>
      <span class="return" @click="onBack">
        <van-icon name="arrow-left"></van-icon>
      </span>
      <p
        class="text text_overflow"
        :class="{ active: headerCover }"
        v-if="text"
      >
        {{ text }}
      </p>
      <p v-else class="text"><slot name="texts" /></p>
      <div
        class="tool"
        :class="[{ menu: $slots.menu }, { menu_cover: headerCover }]"
      >
        <template v-if="$slots.menu">
          <slot name="menu" />
        </template>
      </div>
    </div>
    <span
      class="return return_fixed"
      @click="onBack"
      v-if="retreat"
      :style="retreatStyle"
    >
      <van-icon name="arrow-left"></van-icon>
    </span>
    <div
      class="view"
      :class="[viewStyls, { overflow: overflow }]"
      :style="viewStyle"
      ref="view"
      @scroll="onViewScroll"
    >
      <div
        class="cover"
        v-if="cover && !header && bgc"
        :style="coverStyle"
      ></div>
      <slot />
    </div>
    <transition name="van-fade">
      <div class="footer" v-if="bar">
        <template v-if="footbar">
          <v-b index fixed :select="selectfootname" :noclass="noclass"></v-b>
        </template>
        <slot name="footer" />
      </div>
    </transition>
    <div class="fixed" :style="fixedIndex">
      <slot name="fixed" />
    </div>
    <v-s v-if="shareopen" @change="shareopen = false"></v-s>
  </div>
</template>

<script>
import vS from "./share.vue";
import vB from "../private/tabbar.vue";
export default {
  props: {
    cover: Boolean,
    header: Boolean,
    bar: Boolean,
    bgc: String,
    back: Boolean,
    text: String,
    overflow: Boolean,
    index: [String, Number],
    retreat: Boolean, // 在不开启header的情况下 显示 返回按钮
    retreatTop: { type: [Number, String], default: 0 },
    coverBgc: String,
    coverBgcs: {
      type: Object,
      default: () => {
        return {};
      },
    },
    nologin: Boolean,
    footbar: Boolean,
  },
  components: { vS, vB },
  computed: {
    coverStyle() {
      if (this.coverBgcs.background) {
        return this.coverBgcs;
      }
      if (this.coverBgc) {
        return { background: this.coverBgc };
      }
      return { background: "#fff" };
    },
    headStyle() {
      return { background: "#38f" };
    },
    viewStyls() {
      if (this.header && this.bar) return "a2";
      if (this.header || this.bar) return "a1";
      return "";
    },
    viewStyle() {
      if (this.bgc) {
        return { background: this.bgc };
      }
      return {};
    },
    fixedIndex() {
      if (this.index < 2) return {};
      return { "z-index": this.index };
    },
    retreatStyle() {
      let top = this.retreatTop;
      if ((this.retreatTop + "").indexOf("rem") > -1) {
        return { top };
      }
      if (!isNaN(top) && top > 0) {
        return { top: top + "px" };
      }
      return {};
    },
  },
  inject: ["appPath"],
  watch: {
    "views.rand"(n) {
      // this.$emit("on-view", this.views);
    },
    "views.user": {
      handler(n) {
        this.$emit("on-user", n);
        this.checkbaby();
        // eslint-disable-next-line
        sdkerror.setConfig({
          id: n.id,
          nid: n.n_id,
          nick: n.nickname,
          phone: n.phone,
          type: "新版parent",
          openid: n.openid,
          ua: navigator.userAgent,
          // eslint-disable-next-line
          token: demo.$local.get("token"),
          integral: n.integral,
        });
      },
      deep: true,
    },
    "views.dot": {
      handler(n) {
        this.ischeckdot(n);
        this.$emit("on-dot", n);
      },
      deep: true,
    },
    headerCover(n) {
      this.$emit("on-cover", n);
    },
    "views.validate": {
      handler(v) {
        // console.log(v);
        // console.log(this.views)
      //   let url = window.location.href;
      // if (url.indexOf("tulis") > -1) {
      //   this.active = 'home'
      //   // this.$model.info('游客不开放')
      //   this.$emit("on-view", this.views);
      //   // this.appPath("/index");
      //   return 0;
      // }
        this.$emit("on-view", this.views);
      },
      deep: true,
    },
  },
  data() {
    return {
      top: 0,
      headerCover: false,
      bar_active: "",
      bars: [],
      views: {
        config: {},
        wx: {},
        user: {},
        level: {},
        dot: {},
        baby: {},
        validate: [],
        state: "",
        rand: 0,
      },
      rect: { w: 0, h: 0 },
      shareopen: false,
      selectfootname: "",
      noclass: false,
      apinum: 0,
      apitimer: null,
      loadapis: false,
    };
  },
  methods: {
    $share() {
      this.shareopen = true;
    },
    onBack() {
      if (this.back) {
        this.$emit("on-back");
        return 0;
      }
      this.$router.back();
      let p = this.$route.path;
      if (p !== "/" && p !== "/index") {
        setTimeout(() => {
          if (p === this.$route.path) {
            this.$router.push("/");
          }
        }, 300);
      }
    },
    onViewScroll(v) {
      let a = this.$refs.view;
      try {
        this.top = a.scrollTop;
        if (this.header) {
          this.headerCover = this.top > a.offsetTop;
        }
      } catch (e) {
        console.warn(e + "");
      }
    },
    gotTop() {
      this.$emit("on-top", this.top);
    },
    init() {
      /* eslint-disable */
      this.loadapis = true;

      if (this.footbar) {
        this.selectfootname = this.$route.name;
      }

      // 获取配置
      let config = demo.$local.get("appConfig", {});
      let wx = demo.$local.get("wxConfig", {});
      let nid = demo.$local.get("nid", "");
      let time = Date.now();
      let len = 3e4; // 30s缓存
      if (!nid) {
        nid = demo.getUrlParam("id");
        if (!nid) {
          return 0;
        }
        demo.$local.set("nid", nid);
      }

      if (config.into_time && config.into_time > time) {
        this.apinum++;
        this.views.config = config;
      } else {
        this.$api.http("config", {}, (res) => {
          this.apinum++;
          demo.$local.set("appConfig", {
            into_time: Date.now() + len,
            ...res,
          });
          this.views.config = res;
        });
      }
      // 获取微信
      let wxurl = window.location.href.split("#")[0];

      if ((wx.into_time && wx.into_time > time) || wxurl === wx.url) {
        this.views.wx = wx;
        this.$vx();
        this.apinum++;
      } else {
        // 如果不是微信浏览器 就不获取
        if (demo.es6().isWx()) {
          this.$api.http("wx", {}, (res) => {
            this.apinum++;
            demo.$local.set("wxConfig", {
              into_time: Date.now() + len,
              ...res,
            });
            this.views.wx = res;
            this.$vx();
          });
        } else {
          this.apinum++;
        }
      }

      this.views.state = demo.$random.vars(8);

      // 获取功能开启权限
      let validate = demo.$session.get("validate-open", {});
      if (validate.into_time && validate.into_time > time) {
        this.views.validate = validate;
        this.noclass = !!validate.t15;
        this.apinum++;
      } else {
        this.$api.http("isIndexOpen", {}, (res) => {
          this.apinum++;
          let obj = {};
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              obj["t" + res[i].type] = res[i].is_show === 0;
            }
          }
          demo.$session.set("validate-open", {
            into_time: Date.now() + len,
            ...obj,
          });
          this.views.validate = obj;
          this.noclass = !!obj.t15;
        });
      }

      let token = demo.$local.get("token", "");
      if (token) {
        // 获取用户信息
        let user = demo.$session.get("user", {});
        if (user.into_time && user.into_time > time) {
          this.views.user = user;
          this.apinum++;
        } else {
          this.$api.http("user", {}, (res) => {
            this.apinum++;
            demo.$session.set("user", {
              into_time: Date.now() + len,
              ...res,
            });
            this.views.user = res;
          });
        }
      }
       if (!this.nologin  ) {
        if (!token && window.location.href.indexOf("tulis") == -1) {
        this.$toast("请先登录");
        this.$router.push("/login");
        }
      }
      let tnum = token ? 4 : 3;

      this.views.rand = Math.random();
      // if (this.apinum === 2) {
      //   this.apinum = 4;
      // }
      // this.waitfn(tnum);
    },
    waitfn(num) {
      console.log(this.apinum, num, this.apinums);
      if (this.apinum !== num) {
        // this.$toast.loading({ duration: 0 });
        setTimeout(() => {
          this.waitfn(num);
        }, 500);
        return 0;
      }
      this.$nextTick(() => {
        this.views.rand = Math.random();
      });
    },
    checkbaby() {
      let token = demo.$local.get("token", "");
      if (token) {
        let baby = demo.$session.get("baby-info", {});
        if (baby.into_time && baby.into_time > Date.now()) {
          this.views.baby = baby;
        } else {
          this.$api.http("userBabyInfo", {}, (res) => {
            let r = res[0] || {};
            demo.$session.set("baby-info", {
              into_time: Date.now() + 3e5,
              ...r,
            });
            this.views.baby = r;
          });
        }
      }
    },
  },
  mounted() {
    try {
      let a = this.$refs.view;
      this.rect = {
        w: a.clientWidth,
        h: a.clientHeight,
      };
    } catch (err) {}
    this.init();
  },
};
</script>
<style lang='less' scoped>
.v_view {
  width: 100%;
  height: 100%;
  background-color: #f7f8fa;
  // position: relative;
  .return {
    width: 40px;
    height: 40px;
    padding-right: 20px;
    cursor: pointer;
    box-sizing: border-box;
    padding: 5px;
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    &.return_fixed {
      position: fixed;
    }
  }
  .header {
    height: 50px;
    box-sizing: border-box;
    padding: 5px;
    .tool {
      position: absolute;
      z-index: 7;
      min-width: 40px;
      top: 5px;
      right: 5px;
      height: 40px;
      &.menu {
        span {
          line-height: 40px;
          font-size: 14px;
          padding: 0 5px;
          &.bold {
            font-weight: 650;
          }
        }
        &.menu_cover span {
          color: #fff;
        }
      }
    }
    .text {
      position: relative;
      text-align: center;
      line-height: 40px;
      max-width: 60%;
      font-size: 16px;
      font-weight: 650;
      z-index: 5;
      margin: 0 auto;
      &.active {
        color: #fff;
      }
    }
    .header_cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
    }
  }
  .view {
    height: 100%;
    overflow-y: scroll;
    &.a1 {
      height: calc(100% - 50px);
    }
    &.a2 {
      height: calc(100% - 100px);
    }
    &.overflow {
      overflow: hidden;
    }
  }
  .footer,
  .view,
  .header,
  .fixed {
    position: relative;
    z-index: 2;
  }
  .footer {
    height: 50px;
    box-sizing: border-box;
    z-index: 100;
  }
  .cover {
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 210px;
  }

}

</style>
