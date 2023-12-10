<template>
  <div class="pub_title" :class="{ auto: auto }">
    <div class="t">
      <van-nav-bar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="onBack"
        @click-right="onEvent"
        :style="bgc"
        :class="{ bgc: background }"
      >
        <template #right>
          <slot />
        </template>
        <template #left>
          <van-icon name="arrow-left" :color="background ? '#fff' : '#999'" />
          <b>返回</b>
        </template>
      </van-nav-bar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    right: { type: Boolean, default: false },
    text: { type: String, default: "" },
    path: { type: String, default: "" },
    back: { type: Boolean, default: false },
    tran: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    styls: {
      type: Object,
      default: () => {
        return {};
      },
    },
    auto: { type: Boolean, default: false },
  },
  data() {
    return {
      title: "",
      theme: {},
    };
  },
  watch: {
    text(n) {
      this.title = n;
    },
  },
  computed: {
    bgc() {
      if (!this.background) return {};
      return Object.assign(
        {
          background: this.tran ? "transparent" : this.theme.linear,
          color: "#fff",
        },
        this.styls
      );
    },
  },
  inject: ["appGetTheme", "appPath"],
  methods: {
    onBack() {
      if (this.back) {
        this.$emit("on-back");
        return 0;
      }
      if (this.path) {
        this.$router.push(this.path);
        return 0;
      }
      // this.$store.dispatch("setTitle", {
      //   path: this.$route.path,
      //   rand: this.$demo.rand(5),
      // });
      this.$router.back();
      let p = this.$route.path;
      if (p !== "/" && p !== "/index") {
        setTimeout(() => {
          if (p === this.$route.path) {
            this.appPath("/");
          }
        }, 300);
      }
    },
    onEvent() {
      this.$emit("on-click");
    },
  },
  mounted() {
    this.title = this.text || this.$route.meta.title;
    this.theme = this.appGetTheme();
  },
};
</script>
<style lang="less">
.pub_title {
  .van-nav-bar__right {
    > span {
      font-weight: 600;
    }
  }
  .van-nav-bar__title {
    color: inherit;
  }
  .van-nav-bar.bgc::after {
    border-color: transparent;
  }
}
</style>
<style lang='less' scoped>
.pub_title {
  height: 46px;
  &.auto {
    height: auto;
  }
  .t {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 560;
  }
}
</style>
