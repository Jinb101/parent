<template>
  <v-h title="注册" v-slot="{ item }">
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
      </section>
      <section class="van-hairline--bottom">
        <p class="label">验证码</p>
        <article class="flex">
          <van-field
            v-model="sms"
            label
            type="number"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <van-button round @click="onGetSms" :disabled="nums > 0">
            <b :style="'color:' + item.bgc">
              {{ nums > 0 ? nums + "s" : "获取验证码" }}
            </b>
          </van-button>
        </article>
      </section>
      <section class="van-hairline--bottom">
        <p class="label">密码</p>
        <article>
          <van-field
            v-model="pwd"
            label
            type="password"
            placeholder="请输入6-20位数字或字母密码"
            maxlength="20"
            @keyup.13="sub"
          />
        </article>
      </section>
      <section>
        <article>
          <van-checkbox v-model="checked" icon-size="16px"
            >用户协议<b class="col_warning" @click.stop="onRead"
              >【阅读】</b
            ></van-checkbox
          >
        </article>
        <router-link to="/login" class="r">已有账号？去登录</router-link>
      </section>
    </div>
    <div class="sub">
      <van-button size="normal" block round :color="item.bgc" @click="sub"
        >注册</van-button
      >
    </div>
  </v-h>
</template>

<script>
import vH from "./_head.vue";
export default {
  data() {
    return {
      tel: "",
      pwd: "",
      sms: "",
      nums: 0,
      checked: false,
      code: "",
      openid: "",
    };
  },
  components: { vH },
  inject: ["appPath", "appGetParams", "appGetConfig"],
  methods: {
    sub() {
      let ts = this;
      let x = ts.$validate.reg({
        tel: ts.tel,
        sms: ts.sms,
        pwd: ts.pwd,
        checked: ts.checked,
      });
      if (!x.code) return ts.$model.info(x.err);
      let os = x.data;
      os.id = ""; // openid
      ts.$api.http("checkSms", { phone: os.tel, code: os.sms }, (res) => {
        // eslint-disable-next-line
        let pwd = md5(os.pwd);
        ts.$api.http(
          "reg",
          {
            repassword: pwd,
            password: pwd,
            phone: os.tel,
            // js_code: this.code,
            openid: this.openid,
          },
          (e) => {
            this.$demo.$session.set("app-time-user", 0);
            this.$demo.$local.set("token", e.access_token);
            this.$demo.$session.clear("user");
            // 记住密码
            this.$demo.pwd(
              { account: os.tel, password: os.pwd },
              () => {},
              this.$demo
            );
            // this.$demo.$cookie.set("loga", os.tel + "#-#" + os.pwd);
            this.$model.success("注册成功");
            this.appPath("/");
          }
        );
      });
    },
    onGetSms() {
      let x = this.$validate.sms({ tel: this.tel });
      if (!x.code) return this.$model.info(x.err);
      let os = x.data;
      this.$api.http("sms", { phone: os.tel, type: "register" }, () => {
        this.$demo.es6().downTime("", (e) => {
          this.nums = e.all;
        });
        this.$model.info("验证码发送成功!请注意查收", 2);
      });
    },
    onRead() {
      this.$store.dispatch("setFixed", {
        type: "frame",
        data: {
          name: "reg_agreement",
        },
        time: Date.now(),
      });
    },
  },
  mounted() {
    this.code = this.appGetParams("code") || "";
    if (this.code === "") {
      let v = this.$demo.toBindWx(
        this.appGetParams("id"),
        this.$route.path.replace("/", "")
      );
      if (!this.$js.env) {
        window.location.replace(v);
      }
    } else {
      if (this.code === "null") return 0;
      this.$api.http("getopenid", { type: 1, js_code: this.code }, (res) => {
        this.openid = res.openid;
      });
    }
  },
};
</script>
<style lang='less' scoped>
.flex {
  .van-cell {
    width: calc(100% - 80px);
  }
  .van-button {
    border: 0;
    padding: 0;
    width: 80px;
    margin-top: 9px;
  }
}
</style>
