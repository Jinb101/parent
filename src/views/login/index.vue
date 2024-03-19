<template>
  <v-h v-slot="{ item }">
    <transition name="van-fade">
      <div class="hand_login" v-if="loginStatus">
        <div class="form">
          <section class="van-hairline--bottom">
            <p class="label">手机号</p>
            <article>
              <van-field
                v-model="tel"
                label
                type="tel"
                placeholder="请输入手机号"
                maxlength="11"
              />
            </article>
            <span class="down" v-if="remember.length" @click.stop="showRemeber"
              ><van-icon name="arrow-down"
            /></span>
          </section>
          <template v-if="!id">
            <v-l v-model="tel" @change="onToid"></v-l>
          </template>
          <section class="van-hairline--bottom">
            <p class="label">密码</p>
            <article>
              <van-field
                v-model="pwd"
                label
                type="password"
                placeholder="请输入 6-20 位数字或字母密码"
                maxlength="20"
                @keyup.13="sub"
              >
                <template #button>
                  <van-icon
                    name="closed-eye"
                    @click="showpwd = !showpwd"
                    v-if="showpwd"
                  />
                  <van-icon name="eye-o" @click="showpwd = !showpwd" v-else />
                </template>
              </van-field>
            </article>
            <div class="flex">
              <van-checkbox v-model="checked"
                >同意<b @click="a">用户协议</b></van-checkbox
              >
              <div class="f1"></div>
              <router-link to="/login_reset" class="r">忘记密码</router-link>
            </div>
          </section>
        </div>
        <div class="sub">
          <van-button size="normal" block round :color="item.bgc" @click="sub"
            >确定</van-button
          >
          <van-button size="normal" block round color="#fff" @click="reg"
            ><b class="c">注册</b></van-button
          >
          <van-button size="normal" block round color="#fff" @click="toIndex"
            ><b class="c">免登录</b></van-button
          >
        </div>
      </div>
    </transition>
    <div class="checks" v-if="!loginStatus">
      <!-- <van-button
        block
        color="#29b043"
        round
        icon="wechat"
        @click="onWxLogin"
        v-if="iswx"
        >微信一键登录</van-button -->
      <van-divider>Or</van-divider>
      <van-button
        block
        type="info"
        round
        icon="phone"
        @click="loginStatus = true"
        >账号登录</van-button
      >
      <van-divider>Or</van-divider>
      <van-button
        block
        color="linear-gradient(45deg, rgb(105, 67, 242), rgb(171, 149, 241), rgb(199, 181, 243))"
        round
        icon="wechat"
        @click="appPath('/login_reg')"
        >新用户注册</van-button
      >
    </div>
    <transition name="fade">
      <div
        class="app_show_fixed vx"
        style="height: 100%; top: 0; z-index: 580"
        v-if="cont"
      >
        <v-d @on-back="cont = false" auto></v-d>
      </div>
    </transition>
    <!-- <div class="login_wx" v-if="iswx && loginStatus">
      <div class="btns" @click="onWxLogin">
        <van-icon name="wechat" />
        <b>微信一键登录</b>
      </div>
    </div> -->
  </v-h>
</template>

<script>
import vH from "./_head.vue";
import vD from "../lib/agreement.vue";
import vL from "./select_group.vue";

export default {
  props: {
    childData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      tel: "",
      pwd: "",
      remember: [],
      checked: false,
      cont: false,
      iswx: false,
      loginStatus: false,
      id: "",
      showpwd: false,
    };
  },
  watch: {
    childData: {
      handler(n) {
        if (n.type === "login") {
          this.tel = n.data.account;
          this.pwd = window.atob(n.data.pwd);
          this.checked = true;
        }
      },
      deep: true,
    },
  },
  inject: ["appPath", "appOpenPopup", "appGetInfo"],
  components: { vH, vD, vL },
  methods: {
    onToid(e) {
      // console.log(e);
      this.$demo.$local.set("nid", e.value);
      this.$demo.$local.set("select-nid", e.value);
    },
    onWxLogin() {
      this.$js.wxlogin();
    },
    a() {
      this.cont = true;
    },
    sub() {
      if (!this.checked) return this.$model.info("请同意用户协议", 2);
      let x = this.$validate.login({ tel: this.tel, pwd: this.pwd });
      if (!x.code) return this.$model.info(x.err);
      let os = x.data;
      // eslint-disable-next-line
      this.$api.http("login", { phone: os.tel, password: md5(os.pwd) }, (e) => {
        this.$demo.$session.set("app-time-user", 0);
        this.$demo.$local.set("token", e.access_token);
        this.$demo.$session.set("login-status", 0);
        window.sessionStorage.setItem("tryloginnum", 0);
        this.$demo.$cookie.set("token", e.access_token);
        // 记住密码
        this.$demo.pwd(
          { account: os.tel, password: os.pwd },
          () => {},
          this.$demo
        );
        // this.$demo.$cookie.set("loga", os.tel + "#-#" + os.pwd);
        // 获取用户信息
        this.appGetInfo(() => {
          this.$model.success("登录成功");
          let bb = this.$demo.$local.get("babypay");
          if (bb > 0 && bb + 864e5 > Date.now()) {
            return this.appPath("/babypay");
          }
          let path = this.$demo.$local.get("login_path");
          if (path) {
            this.appPath(path.replace("#", ""));
            this.$demo.$local.clear("login_path");
          } else {
            this.$nextTick(() => {
              this.appPath("/start");
            });
          }
        });
      });
    },
    reg() {
      this.appPath("/login_reg");
    },
    toIndex() {
      this.$api.exit();
      this.appPath("/");
    },
    showRemeber() {
      this.appOpenPopup({
        title: "历史登录账号",
        item: this.remember,
        keys: "account",
        types: "login",
      });
    },
    init() {
      let token = this.$demo.$local.get("token", "");
      if (!token) return 0;
      this.$demo.$session.clear("app-time-user");
      this.$demo.$session.clear("user");
      this.appGetInfo((e) => {
        this.$model.model(
          "检测你已登录，账号为" + e.phone + ",是否跳转至首页",
          "温馨提示",
          (e) => {
            if (e) {
              this.appPath("/index");
            }
          }
        );
      });
    },
  },

  mounted() {
    this.remember = this.$demo.pwd({}, () => {}, this.$demo);
    // this.iswx = this.$demo.es6().isWx();
    // eslint-disable-next-line no-undef
    console.log(demo.$local.get('demo-login-pwd-1'));
    // eslint-disable-next-line no-undef
    if (demo.es6().isWx()) {
      // eslint-disable-next-line no-undef
      if (demo.$local.get('not_wx_admin') === '1') {
          this.wx = false;
      // eslint-disable-next-line no-undef
      } else {
        this.wx = true
      }
    } else {
      this.wx = false
    }
    // if (this.$js.env) {
    //   this.iswx = true;
    // }
    // let val = this.$demo.$cookie.get("loga").val;
    // if (val) {
    //   let s = val.split("#-#");
    //   if (!this.remember.length) {
    //     this.remember = [
    //       { account: s[0], pwd: window.btoa(s[1]), type: "cookie" },
    //     ];
    //   }
    // }
    this.init();
    // eslint-disable-next-line
    this.id = demo.getUrlParam("id");
  },
};
</script>
<style lang='less' scoped>
.van-button {
  margin-bottom: 8px;
  .c {
    color: #a5afac;
  }
}
.f1 {
  flex: 1;
}
.down {
  position: absolute;
  right: 0;
  bottom: 18px;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  &::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    transform: scale(1.5);
  }
}
.login_wx {
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 0 10% 40px;
  text-align: center;
  font-size: 28px;
  width: 100%;
  z-index: 4;
  .btns {
    color: #29b043;
    width: 40px;
    height: 40px;
    border: 1px solid #f9f9f9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    position: relative;
    b {
      position: absolute;
      bottom: -10px;
      left: -30px;
      font-size: 13px;
      width: 100px;
    }
  }
}
</style>
