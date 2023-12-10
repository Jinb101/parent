<template>
  <v-view @on-view="onView" @on-init="onInit" ref="viewPage" nologin>
    <div class="login" ref="logins">
      <div class="h1 flex">
        <h5>{{ title }}</h5>
        <!-- <div class="logo">
          <van-image :src="src" fit="cover"></van-image>
        </div> -->
      </div>
      <div class="views">
        <slot />
      </div>
    </div>
    <template #fixed>
      <transition name="van-slide-left">
        <div class="app_show_fixed top" v-if="open">
          <v-view
            header
            back
            @on-back="open = false"
            text="用户登录协议"
            nologin
          >
            <x-content>
              <div class="app_frame_content" v-html="agrees"></div>
            </x-content>
          </v-view>
        </div>
      </transition>
      <slot name="footer" />
    </template>
    <div class="copy" v-if="hname">
      <van-divider :style="{ color: '#ccc' }">{{ hname }} 家长端</van-divider>
    </div>
  </v-view>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    title: String,
  },
  data() {
    return {
      open: false,
      agrees: "",
      coverHtml: "",
      size: {},
      open1: false,
      timer: null,
      isios: demo.$web !== 1,
      hname: "",
    };
  },
  watch: {
    open(n) {
      if (n && this.agrees === "") {
        this.$api.http("agreeinfo", {}, (e) => {
          this.agrees = e;
        });
      }
    },
    open1() {
      this.cleartimer();
    },
  },
  inject: ["appPath"],
  methods: {
    cleartimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    onView(e) {
      // eslint-disable-next-line
      this.$emit("user", e.user || {});
      this.hname = (e.config || {}).name || "";
    },
    onInit(e) {},
    wxreg() {
      demo.$local.reset();
      demo.$session.reset();
      this.$js.wxcode("login_reg");
    },
    wxlogin() {
      this.$js.wxcode("wxlogin");
    },
  },
  mounted() {
    let v = this.$refs.logins.clientHeight;
    let w = this.$refs.viewPage.$el.clientHeight;
    this.size = {
      all: w,
      used: v,
      unused: w - v,
    };
    this.$emit("on-size", this.size);
    // eslint-disable-next-line
    let a = demo.getUrl().id;
    if (!a) {
      this.$emit("chengeid");
    }
  },
  destroyed() {
    this.open = false;
    this.open1 = false;
  },
};
</script>
<style lang='less' scoped>
.login {
  position: relative;
  font-size: 18px;
  box-sizing: border-box;
  z-index: 5;
}
.covers,
.cover_ios {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 200px;
  z-index: -1;
}
.qr {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 50;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  opacity: 0.5;
  cursor: pointer;
}
.h1 {
  height: 80px;
  // margin: 30px 0 90px;
  margin: 30px 0;
  box-sizing: border-box;
  padding: 17.5px 32px;
  display: flex;
  h5 {
    font-size: 24px;
    color: #222;
    font-weight: 700;
    width: calc(~"100% - 53px");
    height: 53px;
    line-height: 53px;
    letter-spacing: 1px;
  }
  .logo {
    width: 53px;
    height: 53px;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: rgba(238, 238, 238, 0.4);
    overflow: hidden;
    object-fit: cover;
  }
  i.logo {
    background-color: #99cc33;
    opacity: 0.1;
  }
}
.views {
  box-sizing: border-box;
  padding: 20px;
}
.foot_cover {
  position: absolute;
  top: 200px;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -5px 10px #e7e7e7;
}
.qrs {
  width: 200px;
  margin: 20px auto;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
}
.qr_desc {
  padding: 10px;
  text-align: center;
  font-size: 13px;
  color: #999;
}
.copy {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0.6;
}
</style>
