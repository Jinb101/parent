<template>
  <v-a title="注册" ref="login">
    <template v-if="open1">
      <van-cell title="请选择注册园所" is-link @click="onopen2"></van-cell>
    </template>
    <template v-else>
      <van-cell
        v-if="t1.id"
        is-link
        :title="'您已选择：' + t1.text"
        @click="open2 = !open2"
      ></van-cell>
      <h6>手机号</h6>
      <van-field
        v-model="acc"
        label=""
        placeholder="请输入手机号"
        left-icon="phone"
        label-width="4em"
        maxlength="15"
      />
      <h6>验证码</h6>
      <van-field
        v-model="code"
        label=""
        placeholder="请输入验证码"
        left-icon="chat"
        label-width="4em"
        maxlength="6"
      >
        <template #button>
          <span class="col_green" @click="onGetSms">
            {{ nums > 0 ? nums + "s" : "获取验证码" }}
          </span>
        </template>
      </van-field>
      <h6>密码</h6>
      <van-field
        v-model="pwd"
        label=""
        placeholder="请输入密码"
        left-icon="lock"
        label-width="4em"
        maxlength="15"
      />
      <div class="agree">
        <van-checkbox icon-size="13" v-model="check"></van-checkbox>
        <b @click="check = !check">阅读并同意</b>
        <span class="col_green" @click="onOpenAgree">用户协议</span>
      </div>
      <van-button block round :color="$js.btnColor" @click="onsubmit"
        >注册</van-button
      >
    </template>
    <div class="reg" @click="appPath('/login1')">
      已有账号？<b class="col_info">去登录</b>
    </div>
    <v-s v-model="t1" :list="ys" :open="open2" noselect @change="ont1"></v-s>
  </v-a>
</template>

<script>
import vA from "./temp.vue";
import vS from "../newpublic/select.vue";
export default {
  data() {
    return {
      acc: "",
      pwd: "",
      code: "",
      check: false,
      nums: 0,
      openid: "",
      open1: false,
      open2: false,
      ys: [],
      t1: {},
    };
  },
  inject: ["appPath"],
  components: { vA, vS },
  methods: {
    onopen2() {
      if (!this.ys.length) return this.$toast("暂无可选园所");
      this.open2 = !this.open2;
    },
    checks() {
      let load = this.$toast.loading({ duration: 0 });
      this.$api.http("a1130", {}, (r) => {
        if (load) {
          load.clear();
          load = null;
        }
        this.ys = r.map((s) => {
          let a = s.nursery || {};
          return {
            id: a.id,
            text: a.name,
          };
        });
      });
      setTimeout(() => {
        if (load) {
          load.clear();
          load = null;
        }
      }, 8e3);
    },
    ont1() {
      this.open1 = false;
      // eslint-disable-next-line
      demo.$local.set("nid", this.t1.id);
      // eslint-disable-next-line
      demo.$local.clear("select-nid");
    },
    onOpenAgree() {
      this.$refs.login.open = true;
    },
    onsubmit() {
      if (this.acc === "") return this.$toast("请输入手机号");
      if (this.code === "") return this.$toast("请输入验证码");
      if (this.pwd === "") return this.$toast("请输入密码");
      this.$api.http("checkSms", { phone: this.acc, code: this.code }, () => {
        // eslint-disable-next-line
        let pwd = md5(this.pwd);
        this.$api.http(
          "reg",
          {
            repassword: pwd,
            password: pwd,
            phone: this.acc,
            openid: this.openid,
          },
          (e) => {
            // eslint-disable-next-line
            demo.$session.reset();
            // eslint-disable-next-line
            demo.$local.set("token", e.access_token);
            // 记住密码
            // eslint-disable-next-line
            demo.pwd({ account: this.acc, password: this.pwd }, () => {}, demo);
            this.$toast("注册成功");
            this.$nextTick(() => {
              this.appPath("/");
            });
          }
        );
      });
    },
    onGetSms() {
      if (this.nums > 0) return 0;
      if (this.acc === "") return this.$toast("请输入手机号");
      this.$api.http("sms", { phone: this.acc, type: "register" }, () => {
        // eslint-disable-next-line
        demo.es6().downTime("", (e) => {
          this.nums = e.all;
        });
        this.$toast("验证码发送成功！请注意查收");
      });
    },
    selectgroup() {
      this.checks();
      this.open1 = true;
    },
    getid() {
      // eslint-disable-next-line
      let code = demo.getUrlParam("code");
      if (code && code !== "null") {
        this.$api.http("getopenid", { type: 1, js_code: code }, (r) => {
          try {
            this.openid = r.openid;
          } catch (e) {
            console.log("err", e);
          }
        });
      } else {
        // eslint-disable-next-line
        if (demo.es6().isWx()) {
          let v = this.$demo.toBindWx(
            this.appGetParams("id"),
            this.$route.path.replace("/", "")
          );
          if (!this.$js.env) {
            window.location.replace(v);
          }
        }
      }
    },
  },
  mounted() {
    // eslint-disable-next-line
    let id = demo.getUrlParam("id");
    if (!id) {
      this.selectgroup();
    } else {
      this.getid();
    }
  },
};
</script>
<style lang='less' scoped>
.agree,
.reg {
  font-size: 13px;
  padding: 20px;
  display: flex;
  b {
    padding: 0 5px;
  }
}
.reg {
  margin-top: 10px;
  justify-content: center;
}
h6 {
  font-weight: 700;
  font-size: 17px;
  padding: 10px;
}
</style>
