<template>
  <section class="btn flex van-hairline--bottom" @click.stop="onBind">
    <van-icon :name="name" size="20" :color="color" />
    <b>{{ title }}</b>
    <span v-if="slots" :class="{ right: right }"><slot /></span>
    <span v-else class="van-ellipsis">{{ txt }}</span>
    <van-icon
      name="question-o"
      size="20"
      @click.stop="onMessage"
      v-if="question"
    />
  </section>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "" },
    msg: { type: String, default: "" },
    txt: { type: String, default: "" },
    question: { type: Boolean, default: true },
    color: { type: String, default: "#999" },
    name: { type: String, default: "plus" },
    title: { type: String, default: "添加" },
    slots: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  methods: {
    onBind() {
      this.$emit("on-bind", this.type);
    },
    onMessage() {
      if (!this.msg) return 0;
      this.$model.info(this.msg, 2);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.btn {
  line-height: 44px;
  position: relative;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 12;
  .van-icon {
    line-height: 44px;
    width: 30px;
    color: #999;
    text-align: center;
  }
  b {
    font-size: 15px;
    padding-left: 3px;
  }
  span {
    flex: 1;
    text-align: right;
    color: #999;
    &.right {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
