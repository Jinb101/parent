<template>
  <div class="login">
    <div class="h1">
      <h5>{{ title }}</h5>
      <!-- <img :src="logo" v-if="logo" class="logo" alt="" />
      <i v-else class="logo"></i> -->
    </div>
    <div class="cont">
      <slot :item="item" />
    </div>
    <div class="copy" v-if="hname">
      <van-divider :style="{ color: '#ccc' }">{{ hname }} 家长端</van-divider>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "登录" },
  },
  inject: ["appGetConfig", "appWait", "appGetTheme"],
  data() {
    return {
      logo: "",
      obj: {},
      item: {},
      hname: "",
    };
  },
  methods: {},
  mounted() {
    this.appWait(() => {
      this.obj = this.appGetConfig();
      this.item = this.appGetTheme();
      if (this.obj.logo) {
        this.logo = this.obj.logo;
      }
    });
  },
};
</script>
<style lang="less" scope>
.login {
  input::placeholder {
    font-size: 17px;
  }
  .van-cell {
    padding: 18px 0;
  }
  .img-icon {
    width: 12px;
    height: 12px;
    margin-top: 1.5px;
  }
  .van-checkbox__label {
    margin-left: 9px;
    line-height: 20px;
    font-size: 14px;
    color: #444;
  }
  .sub {
    padding: 20px 10% 0;
  }
  .form {
    margin-bottom: 50px;
    section {
      box-sizing: border-box;
      position: relative;
      margin-bottom: 12px;
      .label {
        font-size: 18px;
        color: #222;
        font-weight: 700;
        width: 100%;
        line-height: 1;
      }
      .r {
        float: right;
        font-size: 14px;
        padding: 10px 0;
        color: #888;
      }
    }
  }
}
</style>
<style lang='less' scoped>
.login {
  height: 100vh;
  position: relative;
  font-size: 18px;
  box-sizing: border-box;
  padding: 0 32px;
  .h1 {
    height: 80px;
    margin-bottom: 30px;
    box-sizing: border-box;
    padding: 17.5px 0;
    display: flex;
    h5 {
      font-size: 24px;
      color: #222;
      font-weight: 700;
      width: calc(~"100% - 53px");
      height: 53px;
      line-height: 53px;
      letter-spacing: 1px;
    }
    .logo {
      width: 53px;
      height: 53px;
      box-sizing: border-box;
      border-radius: 50%;
      background-color: #eee;
      overflow: hidden;
      object-fit: cover;
    }
    i.logo {
      background-color: #99cc33;
      opacity: 0.1;
    }
  }
  .cont {
    height: calc(100% - 110px);
  }
}
.copy {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0.6;
}
</style>
