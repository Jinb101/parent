<template>
  <div class="user_password">
    <v-tool-title></v-tool-title>
    <section>
      <van-field v-model="tel" type="tel" label="手机号" readonly />
    </section>
    <section>
      <van-field
        v-model="sms"
        center
        clearable
        label="验证码"
        placeholder="请输入短信验证码"
        maxlength="6"
      >
        <template #button>
          <van-button
            size="small"
            type="info"
            round
            @click="onSms"
            :disabled="nums > 0"
          >
            {{ nums > 0 ? nums + "s" : "获取验证码" }}
          </van-button>
        </template>
      </van-field>
    </section>
    <section>
      <van-field
        v-model="password"
        :type="t1"
        label="新密码"
        placeholder="请输入6-20位数字或字母密码"
        maxlength="20"
      >
        <template #button>
          <van-button size="small" color="#fff" @click="onT1">
            <van-icon
              :name="t1 === 'password' ? 'eye-o' : 'closed-eye'"
              size="15"
              color="orange"
            />
          </van-button>
        </template>
      </van-field>
    </section>
    <section>
      <van-field
        v-model="password2"
        :type="t2"
        label="确认密码"
        placeholder="请输入6-20位数字或字母密码"
        maxlength="20"
      >
        <template #button>
          <van-button size="small" color="#fff" @click="onT2">
            <van-icon
              :name="t2 === 'password' ? 'eye-o' : 'closed-eye'"
              size="15"
              color="orange"
            />
          </van-button>
        </template>
      </van-field>
    </section>
    <section class="send">
      <van-button block round :color="theme.bgc" @click="sub">修改</van-button>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tel: "",
      sms: "",
      password: "",
      password2: "",
      t1: "password",
      t2: "password",
      theme: {},
      nums: 0,
    };
  },
  inject: ["appGetTheme", "appGetInfo", "appPath"],
  methods: {
    onT1() {
      let val = this.t1;
      val = val === "password" ? "text" : "password";
      this.t1 = val;
    },
    onT2() {
      let val = this.t2;
      val = val === "password" ? "text" : "password";
      this.t2 = val;
    },
    onSms() {
      this.$api.http(
        "sms",
        { phone: this.tel, type: "forget_password" },
        () => {
          this.$demo.es6().downTime("", (e) => {
            this.nums = e.all;
          });
          this.$model.info("验证码发送成功!请注意查收", 2);
        }
      );
    },
    sub() {
      if (!this.sms) return this.$model.info("请输入验证码", 2);
      if (!this.password) return this.$model.info("请输入新密码", 2);
      if (!this.password2) return this.$model.info("请再次输入新密码", 2);
      if (this.password.length < 6) {
        return this.$model.info("请输入6-20位数字或字母密码", 2);
      }
      if (this.password !== this.password2) {
        return this.$model.info("两次密码输入不一致", 2);
      }
      let os = {
        phone: this.tel,
        code: this.sms,
        // eslint-disable-next-line
        repassword: md5(this.password2),
        // eslint-disable-next-line
        password: md5(this.password),
      };
      this.$api.http("resetPwd", os, () => {
        this.$model.info("重置成功", 2);
        this.$api.exit();
        this.appPath("/login");
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.appGetInfo((e) => {
      this.tel = e.phone;
    });
  },
};
</script>
<style lang='less' scoped>
.user_password {
  font-size: 16px;
  background-color: #f5f5f5;
  section {
    background-color: #fff;
  }
  .send {
    margin: 30px auto;
    width: 70%;
  }
}
</style>
