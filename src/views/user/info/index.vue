<template>
  <div class="user_info">
    <v-tool-title></v-tool-title>
    <v-line
      title="头像"
      name="photo-o"
      :color="theme.bgc"
      msg="点击修改头像"
      slots
      right
    >
      <v-u :logo="avatar" @path="onPath" round></v-u>
    </v-line>
    <v-line
      title="昵称"
      :color="theme.bgc"
      name="manager-o"
      msg="点击修改昵称"
      slots
    >
      <van-field
        v-model="name"
        placeholder="请输入昵称"
        @blur="sub"
        maxlength="12"
        input-align="right"
      />
    </v-line>
    <v-line
      type="phone"
      title="更换手机号"
      :color="theme.bgc"
      name="phone-o"
      msg="绑定另一个手机号"
      @on-bind="onBind"
      slots
    >
      <van-field v-model="tel" maxlength="12" input-align="right" readonly />
    </v-line>
    <v-line
      type="password"
      title="修改密码"
      :color="theme.bgc"
      name="edit"
      msg="修改账号密码"
      @on-bind="onBind"
    ></v-line>
    <br />
    <v-b></v-b>
  </div>
</template>

<script>
import vLine from "../../system/line.vue";
import vU from "../../public/upload.vue";
import vB from "./_b.vue";
export default {
  data() {
    return {
      user: {},
      avatar: "",
      name: "",
      theme: {},
      oldName: "",
      acc: "",
      tel: "",
    };
  },
  computed: {
    showBtn() {
      return this.oldName !== this.name;
    },
  },
  inject: ["appGetBabyInfo", "appPath", "appGetTheme"],
  components: { vU, vLine, vB },
  methods: {
    onPath(e) {
      this.$api.http("userUpdateLogo", { avatar: e.path }, () => {
        this.reset();
      });
    },
    onBind(e) {
      this.appPath("/user_" + e);
    },
    reset() {
      this.$model.info("修改成功", 2);
      this.$demo.$session.set("app-time-user", 0);
      this.init();
    },
    sub() {
      if (!this.name) return this.$model.info("请输入昵称", 2);
      if (!this.showBtn) return 0;
      this.$api.http("userUpdateNick", { nickname: this.name }, () => {
        this.reset();
      });
    },
    init() {
      this.appGetBabyInfo((e) => {
        this.user = e;
        this.avatar = e.avatar;
        this.oldName = this.name = e.nickname;
        this.acc = e.account;
        this.tel = e.phone;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.init();
  },
};
</script>
<style lang='less' scoped>
.user_info {
  font-size: 16px;
  background-color: #f5f5f5;
  overflow-y: scroll;
  .box {
    background-color: #fff;
    padding: 10px;
    font-size: 15px;
    p {
      line-height: 20px;
      margin-bottom: 5px;
      b {
        color: #999;
      }
    }
    .large {
      padding: 0 10px;
      font-weight: 650;
      font-size: 18px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      vertical-align: bottom;
    }
  }
  section {
    background-color: #fff;
    padding: 10px;
    display: flex;
    p {
      width: 100px;
      line-height: 40px;
    }
    article {
      width: calc(100% - 100px);
      text-align: right;
      .van-icon {
        line-height: 40px;
      }
    }
  }
}
</style>
