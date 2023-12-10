<template>
  <div class="share_view" @click="onclose">
    <img :src="top" alt="" class="top" />
    <div class="text">点击右上角进行分享</div>
    <div class="tool flex">
      <div class="a">
        <div class="logo">
          <van-icon name="wechat" color="#52d79c"></van-icon>
        </div>
        <p>点击微信右上角</p>
      </div>
      <div class="a">
        <div class="logo"><img :src="f" alt="" /></div>
        <p>转发给好友</p>
      </div>
      <div class="a">
        <div class="logo"><img :src="p" alt="" /></div>
        <p>分享朋友圈</p>
      </div>
      <div class="or">或者</div>
    </div>
  </div>
</template>

<script>
let icon = (name) => {
  return "https://jsxrk.jsxrk.xin/500/icon/share/" + name + ".png";
};
export default {
  data() {
    return {
      top: icon("wx"),
      f: icon("f"),
      p: icon("p"),
    };
  },
  methods: {
    onclose() {
      this.$emit("change");
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.share_view {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 86400;
  background-color: #707070;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 16px;
  box-sizing: border-box;
  padding: 130px 10px;
  .text {
    text-align: right;
    font-weight: 650;
    letter-spacing: 2px;
  }
  .top {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 80px;
    height: 120px;
    transition: all 0.3s;
    transform: scale(0.8);
  }
  .tool {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 30px;
    opacity: 0.8;
    .or {
      position: absolute;
      right: 105px;
      bottom: 30px;
      color: #fff;
      height: 15px;
      font-size: 12px;
      line-height: 15px;
    }
    .a {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .logo {
      border-radius: 20%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      color: #fff;
      width: 50px;
      height: 50px;
      background-color: #fff;
      margin-bottom: 10px;
      img {
        display: block;
        width: 100%;
        height: 100%;
        transform: scale(0.7);
      }
    }
    p {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
