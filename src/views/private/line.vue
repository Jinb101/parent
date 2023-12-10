<template>
  <div class="lines">
    <div class="flex head">
      <div class="h1">{{ title }}</div>
      <div class="btn" v-if="btn" :style="bgc" @click="onBtn">
        {{ btnText }}
      </div>
      <span class="more" v-if="more" @click="onMore">
        {{ moreText }}
        <van-icon name="arrow" />
      </span>
    </div>
    <div class="list"><slot /></div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    more: { type: Boolean, default: false },
    moreText: { type: String, default: "查看更多" },
    btn: { type: Boolean, default: false },
    btnText: { type: String, default: "发布" },
  },
  inject: ["appGetTheme"],
  data() {
    return {
      theme: {},
    };
  },
  computed: {
    bgc() {
      return { background: this.theme.bgc };
    },
  },
  methods: {
    onBtn() {
      this.$emit("on-btn");
    },
    onMore() {
      this.$emit("on-more");
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
  },
};
</script>
<style lang='less' scoped>
.lines {
  background-color: #fff;
  padding-bottom: 8px;
  & + .lines {
    border-top: 10px solid #f7f7f7;
  }
  .head {
    padding: 14px;
    height: 18px;
    line-height: 18px;
  }
  .h1 {
    font-size: 17px;
    color: #222;
    font-weight: 700;
    flex: 1;
  }
  .more {
    font-size: 14px;
    color: #999;
    margin-left: 5px;
  }
  .btn {
    font-size: 14px;
    padding: 0 8px;
    border-radius: 3px;
    color: #eee;
  }
  .list {
    position: relative;
  }
}
</style>
