<template>
  <div class="user_invite">
    <v-tool-title></v-tool-title>
    <van-field
      v-model="tel"
      label="手机号"
      placeholder="请输入对方手机号"
      maxlength="11"
      type="tel"
      required
    />
    <van-field
      v-model="sms"
      label="验证码"
      placeholder="请输入对方接收的验证码"
      maxlength="6"
      type="number"
      required
    >
      <template #button>
        <span class="col_green" @click="onSms">{{ times }}</span>
      </template>
    </van-field>
    <van-field
      v-model="r"
      label="关系"
      placeholder="请选择与宝宝的关系"
      readonly
      required
      right-icon="arrow"
      input-align="right"
      @click="open++"
      v-if="!sr"
    />
    <van-field
      v-model="r"
      label="关系"
      placeholder="请输入关系"
      required
      v-else
    />
    <div class="desc">
      <p>1.对方号码必须已经注册,否则无法邀请</p>
      <p>2.发出邀请后,对方收到一个验证码,输入验证码,即完成验证</p>
    </div>
    <div class="foot">
      <van-button block round :color="theme.linear" @click="onSub"
        >邀请</van-button
      >
    </div>
  </div>
</template>

<script>
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
      sms: "",
      theme: {},
      relation: [],
      open: 0,
      sr: "",
      r: "爸爸",
      time: 0,
    };
  },
  watch: {
    open() {
      this.opens("选择关系", "change_relation", this.relation);
    },
    childData: {
      handler(n) {
        let d = n.data;
        if (n.type === "change_relation") {
          this.sr = d.name === "其他";
          this.r = this.sr ? "" : d.name;
        }
      },
      deep: true,
    },
  },
  computed: {
    times() {
      return this.time > 0 ? this.time + "s" : "发送验证码";
    },
  },
  methods: {
    opens(title, types, item) {
      this.appOpenPopup({
        title,
        types,
        item,
      });
    },
    onSub() {
      if (!this.tel) return this.$model.info("请输入被邀请的联系方式", 2);
      if (!this.sms) return this.$model.info("请输入验证码", 2);
      if (!this.r) return this.$model.info("请输入对方与宝宝的关系", 2);
      let os = {
        phone: this.tel,
        code: this.sms,
        relevance: this.r,
      };
      this.$api.http("userInviteAdd", os, () => {
        this.$model.info("邀请成功", 2);
        this.appBack(true);
      });
    },
    onSms() {
      if (!this.tel) return this.$model.info("请输入被邀请的联系方式", 2);
      if (this.time > 0) return this.$model.info("请勿频繁发送验证码", 2);
      this.$api.http("sms", { type: "binding", phone: this.tel }, (e) => {
        this.$model.info("发送成功，请注意查收");
        this.$demo.es6().downTime(
          Date.now(),
          (s) => {
            this.time = s.all;
          },
          Date.now() + 6e4
        );
      });
    },
  },
  inject: ["appGetTheme", "appOpenPopup", "appBack"],
  mounted() {
    this.theme = this.appGetTheme();
    this.relation = this.$api.relation();
  },
};
</script>
<style lang='less' scoped>
.user_invite {
  .desc {
    padding: 20px 0;
    p {
      font-size: 12px;
      color: #ccc;
      line-height: 1.2;
      margin-bottom: 4px;
      box-sizing: border-box;
      padding: 0 5%;
    }
  }
  .foot {
    margin: 20px auto;
    width: 60%;
  }
}
</style>
