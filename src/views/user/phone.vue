<template>
  <div class="user_phone">
    <v-tool-title></v-tool-title>
    <section>
      <van-field v-model="phone" type="tel" label="当前手机号" readonly />
    </section>
    <section>
      <van-field
        v-model="tel"
        type="tel"
        label="新手机号"
        maxlength="13"
        placeholder="请输入手机号"
      />
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
    <section class="send">
      <van-button block round :color="theme.bgc" @click="sub">修改</van-button>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: "",
      tel: "",
      sms: "",
      nums: 0,
      theme: {},
    };
  },
  inject: ["appGetTheme", "appGetInfo", "appPath"],
  methods: {
    onSms() {
      if (!this.tel) return this.$model.info("请输入手机号", 2);
      this.$api.http("sms", { phone: this.tel, type: "register" }, () => {
        this.$demo.es6().downTime("", (e) => {
          this.nums = e.all;
        });
        this.$model.info("验证码发送成功!请注意查收", 2);
      });
    },
    sub() {
      if (!this.tel) return this.$model.info("请输入手机号", 2);
      if (!this.sms) return this.$model.info("请输入验证码", 2);
      this.$api.http(
        "checkSms",
        {
          phone: this.tel,
          code: this.sms,
        },
        () => {
          this.$api.http("userUpdatePhone", { phone: this.tel }, () => {
            this.$model.info("重置成功", 2);
            this.$api.exit();
            this.appPath("/login");
          });
        }
      );
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.appGetInfo((e) => {
      this.phone = e.phone;
    });
  },
};
</script>
<style lang='less' scoped>
.user_phone {
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
