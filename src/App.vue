<template>
  <div id="app">
    <div class="app_progress"
         :style="{ width: progress + '%' }"></div>
    <!-- 入口 -->
    <transition :name="transitionName">
      <router-view v-if="isRouterAlive"
                   :childData="childData"
                   :class="routeClass"
                   class="app_view"></router-view>
    </transition>
    <!-- 全局弹框盒子 -->
    <transition name="fade">
      <v-fixed></v-fixed>
    </transition>
    <!-- 底部 nav  -->
    <!-- 部分页面底部 tabbar -->
    <!-- <v-bar index fixed v-if="isFooter" :select="$route.name"></v-bar> -->
    <!-- 全局弹出层 -->
    <v-popup :open="popup.open"
             :title="popup.title"
             :keys="popup.keys"
             :item="popup.item"
             @on-change="onPopupChange"></v-popup>
    <!-- 上传按钮 隐藏 -->
    <button class="m_btn mini up"
            :id="btnId"></button>
    <!-- 分享 -->
    <v-share :open="share.open"
             :ext="share.ext"
             :item="share.item"
             :title="share.title"></v-share>
    <van-image-preview v-model="showImage"
                       :images="imageList"
                       :startPosition="imageIndex"></van-image-preview>
    <!-- 班级圈评论 -->
    <transition name="height">
      <div class="app_comment_class"
           v-if="showComment">
        <div class="cover"
             @click="onCloseComment(false)"></div>
        <div class="cin">
          <van-field center
                     clearable
                     placeholder="请输入"
                     v-model="comment">
            <template #button>
              <van-button size="small"
                          type="primary"
                          @click.stop="onSendComment">发送</van-button>
            </template>
          </van-field>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <v-music :music="music"
               :class="{ foot: isFooter }"
               @on-remove="showMusic = false"
               v-if="showMusic"></v-music>
    </transition>
    <transition name="fade">
      <div class="app_share_wx"
           v-if="share_open"
           @click="share_open = false">
        <div class="cover">
          <van-image :src="$js.def.icon.wx.icon"></van-image>
        </div>
      </div>
    </transition>
    <!-- <transition name="fade">
      <div
        class="app_show_fixed"
        style="top: 0; height: 100%"
        v-if="showBindWx"
      >
        <v-b :title="false">
          <p class="col_ddanger">绑定后可进入家长端</p>
        </v-b>
      </div>
    </transition> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import vPopup from "./views/private/popup.vue";
import vFixed from "./views/fixed/index.vue";
import vBar from "./views/private/tabbar.vue";
import vShare from "./views/private/share.vue";
import vMusic from "./views/private/audio.vue";
import vB from "./views/wx/bind.vue";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
      appObject: this.appObject,
      appSquare: this.appSquare,
      appUploadImage: this.appUploadImage,
      appShare: this.appShare,
      appGetParams: this.appGetParams,
      appGetConfig: this.appGetConfig,
      appGetInfo: this.appGetInfo,
      appGetTheme: this.appGetTheme,
      appPath: this.appPath,
      appBack: this.appBack,
      appWait: this.appWait,
      appOpenPopup: this.appOpenPopup,
      appTimeout: this.appTimeout,
      appCountNum: this.appCountNum,
      appGetSex: this.appGetSex,
      appShowImage: this.appShowImage,
      appShowComment: this.appShowComment,
      appIsLogin: this.appIsLogin,
      appGetClass: this.appGetClass,
      appShowMusic: this.appShowMusic,
      appGetBabyInfo: this.appGetBabyInfo,
      appisFoodShop: this.appisFoodShop,
    };
  },
  components: { vPopup, vFixed, vBar, vShare, vMusic, vB },
  data() {
    return {
      isRouterAlive: true,
      transitionName: "none",
      params: {},
      btnId: "app-upload",
      user: {},
      config: {},
      wxConfig: {},
      childData: {},
      popup: {
        open: 0,
      },
      share: {
        open: 0,
        item: [],
        ext: {},
        title: "",
      },
      types: {
        popup: "",
      },
      progress: 0,
      showImage: false,
      imageList: [],
      imageIndex: 0,
      showComment: false,
      comment: "",
      commentData: {},
      menu: [],
      music: {},
      showMusic: false,
      share_open: false,
      wxUpload: null,
      isWx: false,
      showBindWx: false,
      babytoken: "",
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        this.transitionName =
          toDepth < fromDepth ? "slide-right" : "slide-left";
        this.init();
      },
      deep: true,
    },
    params: {
      handler(n) {
        this.setParams(n);
      },
      deep: true,
    },
    vuex_progress(n) {
      this.progress = n;
    },
    vuex_share(n) {
      this.share_open = n !== 0;
    },
    wxConfig: {
      handler(n) {
        if (n && this.$demo.vx().version(5)) {
          this.wxUpload.init(n, (e) => {
            this.isWx = e.code;
          });
        }
      },
      deep: true,
    },
    user: {
      handler(n) {
        this.showBindWx = n.openid === "";
        // eslint-disable-next-line
        sdkerror.setConfig({
          id: n.id,
          nid: n.n_id,
          nick: n.nickname,
          phone: n.phone,
          type: "parent",
          openid: n.openid,
          ua: navigator.userAgent,
          // eslint-disable-next-line
          token: demo.$local.get("token"),
          integral: n.integral,
        });
      },
      deep: true,
    },
    showBindWx(n) {
      if (this.showBindWx) {
        this.$model.model("去绑定微信", "未绑定", (res) => {
          if (res) {
            this.appPath("/wx_bind");
          }
        });
      }
    },
  },
  computed: {
    ...mapState({
      vuex_progress: "progress",
      vuex_share: "shareWx",
    }),
    isFooter() {
      let a = (this.$route.path + "").split("/");
      return ["/listen", "/education"].indexOf("/" + a[1]) >= 0;
    },
    isHeader() {
      return 0;
    },
    routeClass() {
      if (this.isFooter && this.isHeader) {
        return "app_index3";
      } else if (this.isFooter) {
        return "app_index2";
      } else if (this.isHeader) {
        return "app_index1";
      }
      return "app_index";
    },
  },
  methods: {
    appisFoodShop(fn) {
      this.$api.http("supid", {}, (res) => {
        fn(!isNaN(res + ""));
      });
    },
    appGetBabyInfo(fn) {
      this.appIsLogin((e) => {
        let b = this.$demo.$session.get("baby-info", {});
        if (b.id && b.time > Date.now()) {
          fn(e, b);
          return 0;
        }
        this.$api.http("userBabyInfo", {}, (r) => {
          let os = r[0] || {};
          os.time = Date.now() + 12e4;
          this.$demo.$session.set("baby-info", os);
          fn(e, os);
        });
      });
    },
    appShowMusic(e, flag) {
      if (flag) return this.music;
      this.showMusic = true;
      this.$nextTick(() => {
        this.music = e;
      });
    },
    setParams(e) {
      // token 自动登录/覆盖登录
      if (e.token) {
        let tk = this.$demo.$local.get("token", "");
        if (tk !== e.token) {
          this.$demo.$session.set("app-time-user", 0);
          this.$demo.$session.set("login-status", 0);
          this.$demo.$session.set("work-dot-time", 0);
          this.$demo.$local.set("token", e.token);
          this.reload();
        }
      }
      if (e.u) {
        this.$demo.$session.set("app-time-user", 0);
        this.appGetInfo(() => { });
      }
    },
    // 发送评论
    onSendComment() {
      if (!this.comment) return this.$model.info("请输入评论", 2);
      this.$store.dispatch("setComment", {
        val: this.comment.replace(this.commentData.val, ""),
        time: Date.now(),
        type: "send",
        ext: this.commentData,
      });
      this.onCloseComment(true);
    },
    // 关闭评论
    onCloseComment(f) {
      if (!f) {
        this.$store.dispatch("setComment", {
          val: "",
          time: Date.now(),
          type: "close",
          ext: this.commentData,
        });
      }
      this.showComment = false;
      this.comment = "";
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    // 打开评论
    appShowComment(val = "", ext = {}) {
      this.comment = val;
      this.showComment = true;
      this.commentData = ext;
    },
    // 查看图片
    appShowImage(e, index, name) {
      if (e === undefined) return 0;
      this.showImage = true;
      let o = this.$demo.$obj(e, 1) === 4 ? e : [e];
      if (name) {
        o = o.map((s) => {
          return s[name];
        });
      }
      this.imageList = o;
      this.imageIndex = index || 0;
    },
    // 打开全局弹框
    appOpenPopup(e) {
      this.popup = this.appObject(e);
      this.popup.open = this.$demo.rand(6);
      this.types.popup = e.types;
    },
    // 深拷贝
    appObject(e = {}, o = {}) {
      return Object.assign({}, e, o);
    },
    // 宽高
    appSquare() {
      return this.$demo.js("#app").square();
    },
    // 文件上传
    appUploadImage(opt, fn) {
      let ts = this;
      opt = ts.appObject(
        {
          accept: {},
          id: "",
          w: 1080,
          h: 1920,
          type: "image",
        },
        opt
      );
      let accept = opt.accept || {};
      if (opt.type === "image") {
        if (this.isWx) {
          let num = accept.more ? 9 : 1;
          this.wxUpload.image(num).then((res) => {
            res.forEach((file) => {
              fn(file);
            });
          });
          return !0;
        }
      }
      ts.btnId = opt.id || "app-upload";
      let doms = ts.$demo.js("#" + ts.btnId);
      // console.log(doms);
      setTimeout(() => {
        doms.file((e) => {
          if (["img", "image"].indexOf(opt.type) >= 0) {
            let fls = [];
            if (e.files.length > 1) {
              fls = Array.from(e.files);
            } else {
              fls = [e.file];
            }
            fls.forEach((file) => {
              ts.$demo
                .es6()
                .imageCompress(
                  file,
                  { width: opt.w, height: opt.h, type: "file", num: 0.8 },
                  (res) => {
                    fn(res);
                  }
                );
            });
          } else {
            fn(e);
          }
        }, accept);
        setTimeout(() => {
          doms.find("label").click();
        }, 500);
      }, 200);
    },
    // 获取用户信息 10 分钟
    appGetInfo(fn) {
      let ts = this;
      let time = ts.$demo.$session.get("app-time-user", 0);
      if (time > Date.now()) {
        let os = ts.$demo.$session.get("user", {});
        this.user = os;
        fn(os);
        return 0;
      }
      let times = ts.params.timeout || 12e4; // 120s
      ts.$api.http("user", {}, (e) => {
        ts.$demo.$session.set("user", e);
        this.user = e;
        fn(e);
        ts.$demo.$session.set("app-time-user", Date.now() + times);
      });
      return {};
    },
    // 检测登录
    appIsLogin(fn, err) {
      let token = this.$demo.$local.get("token", "");
      let url = window.location.href;
      if (window.location.href.indexOf('tulis') > -1 && token) {
        let newUrl = window.location.href.replace(/&tulis=1/, '');
        history.replaceState(null, '', newUrl);
        return
      }
      if (url.indexOf("&tulis") > -1) {
        // eslint-disable-next-line no-undef
        // demo.$session.reset();
        // eslint-disable-next-line
        // demo.$local.clear("token");
        this.$nextTick(() => {
          this.appPath("/index");
        });
      }
      if (!token) {
        if (err) {
          return err();
        }
        this.appPath("/login");
        return this.$model.info("请先登录！", 2);
      }
      this.appGetInfo((e) => {
        fn(e);
      });
    },
    // 时间转换
    appTimeout(num, type, join) {
      return this.$demo.timeout(num, type, join || "-");
    },
    // 数字转换
    appCountNum(num, size = 1e4, text = "W") {
      return num > size ? (num / size).toFixed(2) + text : num;
    },
    // 分享
    appShare(item, data, type, title) {
      let ext = data;
      ext.share_type = type;
      console.log(data);
      this.share = {
        item,
        ext,
        open: Date.now(),
        title,
      };
    },
    // 获取 url 参数
    appGetParams(name) {
      return name ? this.params[name] : this.params;
    },
    // 获取班级
    appGetClass(g_id, fn) {
      this.$model.loading();
      this.$api.http("class", { g_id }, (e) => {
        fn(e);
        this.$model.clear();
      });
    },
    // 跳转
    appPath(v, f) {
      if (f) {
        this.$router.replace(v);
        return 0;
      }
      this.$router.push(v);
    },
    // 返回上一页
    appBack(code) {
      if (code) {
        setTimeout(() => {
          this.$router.back();
        }, 500);
      }
    },
    // 获取基础配置
    appGetConfig(type, bool) {
      if (bool) {
        return this.getconfigs();
      }
      let e = type ? this.wxConfig : this.config;
      return this.appObject(e);
    },
    // 内置主题
    appGetTheme() {
      return this.$demo.theme(this.params.theme);
    },
    // 等待
    appWait(fn) {
      setTimeout(() => {
        fn();
      }, 300);
    },
    // 性别图标
    appGetSex(n) {
      let icon = {
        boy: this.$js.def.icon.boy.icon,
        girl: this.$js.def.icon.girl.icon,
      };
      if (+n === 2) return icon.girl;
      return icon.boy;
    },
    // 初始化 10 分钟
    async init() {
      let ts = this;
      let nid = ts.$demo.$local.get("nid", "");
      if (nid > 0 && ts.params.id > 0 && +nid !== +ts.params.id) {
        // 更换园所
        // 清除所有登录缓存数据
        console.log("换园所", nid, ts.params.id);
        ts.$api.exit(true);
        // 调用退出登录
        ts.appPath("/index");
      }
      ts.setParams(ts.params);

      if (this.params.babyuserid > 0 && this.babytoken === "") {
        let token = await this.babymore(this.params.babyuserid);
        if (token) {
          this.$demo.$local.set("token", token);
          this.$demo.$session.clear("app-time-init");
          this.$demo.$session.clear("user");
          this.babytoken = token;
        }
      }

      let time = ts.$demo.$session.get("app-time-init", 0);
      if (time > Date.now()) {
        ts.config = ts.$demo.$local.get("appConfig", {});
        ts.wxConfig = ts.$demo.$local.get("wxConfig", {});
        ts.$vx();
        return 0;
      }
      if (ts.params.id) {
        ts.$demo.$local.set("nid", ts.params.id);
      }
      let times = ts.params.timeout || 3e4; // 30s
      ts.$demo.$session.set("app-time-init", Date.now() + times);
      if (ts.params.id > 0) {
        // 获取基本信息
        ts.getconfigs();
      }
      // 获取微信配置 5
      if (ts.$demo.es6().isWx()) {
        ts.$api.http("wx", {}, (e) => {
          ts.$demo.$local.set("wxConfig", e);
          ts.wxConfig = e;
          ts.$vx();
        });
      }
      // 获取新版 权限
      ts.$api.http("newmenulevel", {}, (r) => {
        // eslint-disable-next-line
        let res = siteConfig().menulevel(r);
        ts.$demo.$session.set("menulevel", res);
      });
    },
    getconfigs() {
      // 获取基本信息
      this.$api.http("config", {}, (e) => {
        this.$demo.$local.set("appConfig", e);
        this.config = e;
      });
    },
    onPopupChange(e) {
      this.childData = {
        type: this.types.popup,
        to: e.type,
        data: e.data,
        rand: this.$demo.rand(6),
      };
    },
    babymore(id) {
      let http = this.$api.http;
      return new Promise((resolve, reject) => {
        http("bindacc", {}, (r) => {
          let a = r.filter((s) => {
            return +s.id === +id;
          });
          let token = "";
          if (a.length && a[0]) {
            token = a[0].access_token;
          }
          resolve(token);
        });
      });
    },
  },
  mounted() {
    this.params = this.$demo.getUrl();
    this.wxUpload = this.$demo.upload();
    // console.log(this.params);
  },
};
</script>

<style lang="less">
html,
body {
  height: 100%;
}

body {
  background-color: #eee;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  // user-select: none;
  background-color: #fff;
}

.up {
  z-index: -1;
  position: fixed;
  left: -100vw;
  top: -100vh;
}

.van-search__action:active {
  background-color: transparent !important;
}

.app_top {
  position: sticky;
  z-index: 50;
  top: 0;

  &.bgc {
    background-color: #fff;
  }

  &.h44 {
    top: 44px;
  }

  &.h10 {
    top: 10px;
  }
}

.app_bottom {
  position: sticky;
  z-index: 50;
  bottom: 0;
  padding: 10px;
  background-color: #fff;

  &.tran {
    background-color: transparent;
  }
}

.app_view {
  box-sizing: border-box;
  font-size: 18px;
  z-index: 1;
  position: absolute;
  width: 100%;
  overflow: hidden;
  transition: all 0.75s cubic-bezier(0.55, 0, 0.1, 1);
}

.app_progress {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 2px;
  z-index: 800;
  background-color: #46c6f7;
}

.van-image {
  display: block;
  width: 100%;
  height: 100%;
}

.app_index {
  height: 100%;
}

.app_index2 {
  height: calc(100% - 50px);
}

.app_share_wx {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(34, 34, 34, 0.7);
  z-index: 88888;

  .cover {
    width: 50%;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.triangle {
  position: fixed;
  z-index: -1;
  width: 50%;
  height: 50%;

  &.triangle_top {
    top: 0;
    left: 0;
    transform: rotate(45deg) scale(2) translateX(-20%);
    background: linear-gradient(90deg,
        rgb(15, 252, 173),
        rgba(255, 255, 255, 0));
  }

  &.triangle_bottom {
    right: 0;
    bottom: 0;
    transform: rotate(45deg) scale(2) translateX(40%);
    background: linear-gradient(-90deg, #38f, rgba(255, 255, 255, 0));
  }
}

.app_btn_add {
  position: fixed;
  right: 10px;
  bottom: 60px;
  background-color: #a8d578;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px #a8d578;
  transform: scale(0.9);
  z-index: 50;

  i {
    font-size: 20px;
  }

  &.b20 {
    bottom: 20px;
  }
}

.app_comment_class {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3000;

  .cover {
    z-index: 3001;
    width: 100%;
    height: 100%;
  }

  .cin {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #fff;
    z-index: 3002;
  }
}

.app_frame_content {
  font-size: 14px;
  line-height: 1.5;
  padding: 0 8px;

  img,
  iframe,
  video {
    max-width: 100%;
    border-radius: 5px;
  }

  iframe,
  video {
    display: block;
    width: 100%;
  }

  &.auto {
    padding: 0;

    img {
      border-radius: 0;
    }
  }
}

.app_foot_btn {
  height: 44px;
  position: fixed;
  z-index: 30;
  bottom: 0;
  left: 0;
  width: 100%;
}

.app_show_fixed {
  position: fixed;
  top: 46px;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  height: calc(100% - 46px);
  left: 0;
  z-index: 50;

  .w60 {
    margin: 30px auto 10px;
    width: 60%;
  }

  .w80 {
    position: fixed;
    z-index: 55;
    left: 10%;
    bottom: 15px;
    width: 80%;

    .van-button+.van-button {
      margin-left: 10px;
    }
  }

  &.top {
    height: 100%;
    top: 0;
  }

  &.tran {
    background-color: transparent;
  }
}

.index .van-grid-item__content {
  padding: 8px;
}

.app_head_icon {
  .van-icon {
    vertical-align: middle;
  }
}

.app_approval_purchase {
  background-color: #f5f5f5;
  overflow-y: scroll;

  .show_search,
  .show_lists,
  .change_people {
    position: fixed;
    left: 0;
    top: 46px;
    width: 100%;
    height: calc(100% - 46px);
    z-index: 300;
    background-color: #fff;
    box-sizing: border-box;
    padding: 5px;
    overflow-y: scroll;
  }

  .show_foot {
    position: fixed;
    z-index: 299;
    left: 0;
    bottom: 0;
    height: 60px;
    background-color: #fff;
    width: 100%;

    .price {
      width: calc(100% - 60px);
      box-sizing: border-box;
      padding: 32px 5px 0 11px;
      font-size: 14px;
    }

    .van-button {
      height: 60px;
      width: 160px;
    }
  }

  .change_people {
    padding: 0;
  }

  .header {
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    padding: 0 15px;
    font-size: 15px;
    margin-bottom: 8px;

    b {
      flex: 1;
      font-weight: 700;
    }

    .van-icon {
      line-height: 44px;
      color: #999;
    }
  }

  .peo {
    background-color: #fff;
    padding: 17px 12px;
    font-size: 15px;

    h6 {
      margin-bottom: 15px;
    }
  }

  .h30 {
    margin-bottom: 15px;
  }

  .h10 {
    margin-bottom: 10px;
  }

  .inp {
    background-color: #fff;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    padding: 0 12px;

    >p {
      width: 80px;
    }
  }

  .descs {
    background-color: #fff;
    padding: 12px;
    margin-bottom: 70px;

    h6 {
      font-size: 15px;
      line-height: 35px;
      height: 35px;
    }
  }

  .show_lists {
    .van-button {
      width: 70%;
      margin: 30px auto;
    }

    li {
      height: 70px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 13px;

      .ava {
        height: 50px;
        width: 50px;
        margin-right: 10px;
      }

      .name {
        margin: 6px 0;
        font-size: 16px;
      }

      .text {
        width: calc(100% - 120px);
      }

      .close,
      .dire {
        width: 30px;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: tomato;
      }

      .dire {
        color: #988;
      }
    }
  }
}

.trigger_tag {
  padding: 10px;
  font-size: 15px;

  span {
    padding: 0 10px;
    line-height: 20px;
    display: flex;
    align-items: center;

    i {
      margin-right: 4px;
    }
  }
}

.pub_title+.pub_page {
  height: calc(100% - 46px) !important;
}

.van-nav-bar__text,
.van-nav-bar .van-icon {
  color: #999;
}

.moveleft-leave-active,
.moveright-leave-active,
.fade-enter-active,
.fade-leave-active,
.height-enter-active,
.moveleft-enter-active,
.moveright-enter-active,
.height-leave-active {
  transition: all 0.5s;
}

.slide-left-enter,
.slide-left-leave-active {
  opacity: 0;
  transform: .5 translateX(100%);
}

.slide-right-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: .5 translateX(-100%);
}

.height-enter,
.height-leave-to {
  opacity: 0;
  height: 0;
  transform: translateX(-50%);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}

.moveleft-enter,
.moveleft-leave-to {
  position: absolute;
  opacity: 0;
  transform: translateX(-100%);
}

.moveright-enter,
.moveright-leave-to {
  position: absolute;
  opacity: 0;
  transform: translateX(100%);
}

.van-image-preview__overlay {
  background: rgba(0, 0, 0, 0.4);
}

.db_image {
  display: block;
  width: 100%;
  height: 100%;
}

.van-progress__pivot,
.van-progress__portion {
  transition: all 0.5s;
}

.van-tabbar-item--active img {
  position: relative;
  animation: dropAndRecover 1.5s ease;
  transform: translate3d(0, 0, 0);
  /* 使用硬件加速 */
}

@keyframes dropAndRecover {
  0% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-15px) scale(1.4);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
