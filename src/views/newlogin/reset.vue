<template>
  <v-a title="重置密码">
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
        <span class="col_green" @click="onsms">
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
      type="password"
    />
    <div class="agree"></div>
    <van-button block round :color="$js.btnColor" @click="onsubmit"
      >重置</van-button
    >
    <div class="reg" @click="appPath('/login')">
      <b class="col_info">登录</b>
    </div>
  </v-a>
</template>

<script>
import vA from "./temp.vue";
export default {
  data() {
    return {
      acc: "",
      pwd: "",
      code: "",
      check: false,
      nums: 0,
    };
  },
  inject: ["appPath"],
  components: { vA },
  methods: {
    onsubmit() {
      if (this.acc === "") return this.$toast("请输入手机号");
      if (this.pwd === "") return this.$toast("请输入新密码");
      if (this.code === "") return this.$toast("请输入验证码");
      // eslint-disable-next-line
      let pwd = md5(this.pwd);
      let os = {
        phone: this.acc,
        code: this.code,
        repassword: pwd,
        password: pwd,
      };
      this.$api.http("resetPwd", os, () => {
        this.$toast("重置成功");
        this.$api.exit(true);
        // eslint-disable-next-line
        demo.$session.reset();
      });
    },
    onsms() {
      if (this.nums > 0) return 0;
      if (this.acc === "") return this.$toast("请输入手机号");
      this.$api.http(
        "sms",
        { phone: this.acc, type: "forget_password" },
        () => {
          // eslint-disable-next-line
          demo.es6().downTime("", (e) => {
            this.nums = e.all;
          });
          this.$toast("验证码发送成功!请注意查收");
        }
      );
    },
  },
  mounted() {},
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
