<template>
  <v-h title="重置密码" v-slot="{ item }">
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
          <van-button round @click="onGetSms" :disabled="nums > 0"
            ><b :style="'color:' + item.bgc">
              {{ nums > 0 ? nums + "s" : "获取验证码" }}
            </b></van-button
          >
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
        <router-link to="/login" class="r">登录</router-link>
      </section>
    </div>
    <div class="sub">
      <van-button size="normal" block round :color="item.bgc" @click="sub"
        >重置</van-button
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
    };
  },
  components: { vH },
  methods: {
    sub() {
      let x = this.$validate.forget({
        tel: this.tel,
        sms: this.sms,
        pwd: this.pwd,
      });
      if (!x.code) return this.$model.info(x.err);
      let os = x.data;
      this.$api.http(
        "resetPwd",
        {
          phone: os.tel,
          code: os.sms,
          // eslint-disable-next-line
          repassword: md5(os.pwd),
          // eslint-disable-next-line
          password: md5(os.pwd),
        },
        () => {
          this.$model.success("重置成功");
          this.$api.exit(true);
          this.$router.push("/login");
        }
      );
    },
    onGetSms() {
      let x = this.$validate.sms({ tel: this.tel });
      if (!x.code) return this.$model.info(x.err);
      let os = x.data;
      this.$api.http("sms", { phone: os.tel, type: "forget_password" }, () => {
        this.$demo.es6().downTime("", (e) => {
          this.nums = e.all;
        });
        this.$model.info("验证码发送成功!请注意查收", 2);
      });
    },
  },
  mounted() {},
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
