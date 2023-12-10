<template>
  <v-a ref="login" qr title="登录" @user="onuser">
    <template v-if="wx">
      <!-- 若您有登录账号且绑定微信的 -->
      <van-divider content-position="left"></van-divider>
      <van-button
        block
        round
        type="primary"
        icon="wechat"
        @click="onevent('wx')"
        >微信一键登录</van-button>
    </template>
    <!-- 若您有登录账号 -->
    <van-divider content-position="left"></van-divider>
    <van-button block round type="info" icon="phone" @click="onevent('login')"
      >账号登录</van-button
    >
    <!-- 若您是第一次进入 -->
    <van-divider content-position="left"></van-divider>
    <van-button
      block
      round
      :color="$js.btnColor"
      icon="manager"
      @click="onevent('reg')"
      >新用户注册</van-button
    >
    <van-divider content-position="left"></van-divider>
    <van-button
      block
      round
      plain
      type="default"
      icon="user-o"
      @click="onevent('yk')"
      >游客访问</van-button
    >
  </v-a>
</template>

<script>
import vA from "./temp.vue";
export default {
  data() {
    return {
      wx: false,
    };
  },
  inject: ["appPath"],
  components: { vA },
  methods: {
    onevent(e) {
      switch (e) {
        case "wx":
          //  this.redirection()
          this.$refs.login.wxlogin();
          break;
        case "login":
          this.appPath("/login1");
          break;
        case "reg":
          if (this.wx) {
            this.$refs.login.wxreg();
          } else {
            this.appPath("/login_reg");
          }
          break;
        default:
          // eslint-disable-next-line no-undef
          demo.$session.reset();
          // eslint-disable-next-line
          demo.$local.clear("token");
          // eslint-disable-next-line
          this.redirection()
          // eslint-disable-next-line no-undef
      }
    },
    redirection(isTo = false) {
          let currentUrl = window.location.href;
          let baseUrl = currentUrl.split('#')[0];
          let hash = currentUrl.split('#')[1];
          let newUrl = baseUrl.includes("?") ? baseUrl + "&tulis=1" : baseUrl + "?tulis=1";
          newUrl = newUrl + (hash ? '#' + hash : '');
          history.replaceState(null, '', newUrl);
          if (!isTo) {
            this.$nextTick(() => {
            this.appPath("/index");
          });
          }
    },
    onuser(e) {
      if (e.phone) {
        this.$model.model(
          "检测你已登录，账号为" + e.phone + ",是否跳转至首页",
          "温馨提示",
          (res) => {
            if (res) {
              this.appPath("/index");
            }
          }
        );
      }
    },
  },
  mounted() {
    let url = window.location.href
    if (url.indexOf('tulis') > -1) {
      let newUrl = window.location.href.replace(/&tulis=1/, '');
        history.replaceState(null, '', newUrl);
    }
    // eslint-disable-next-line no-undef
    console.log(demo.es6().isWx());
    // eslint-disable-next-line
    if (demo.es6().isWx()) {
      // eslint-disable-next-line no-undef
      if (demo.$local.get('not_wx_admin') === '1') {
          this.wx = false;
      // eslint-disable-next-line no-undef
      } else {
        this.wx = true
      }
    } else {
      this.wx = false;
    }
  },
};
</script>
<style lang='less' scoped>
.van-button {
  max-width: 190px;
  margin: 0 auto;
}
</style>
