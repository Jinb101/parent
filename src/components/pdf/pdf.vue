<template>
  <div class="pdf">
    <iframe :src="url" frameborder="0" v-if="url"></iframe>
    <van-empty description="文件失效" v-else />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      url: "",
    };
  },
  watch: {
    src(n) {
      this.init();
    },
  },
  methods: {
    init() {
      if (!this.src) {
        this.url = "";
        return 0;
      }
      this.url = this.$js.api.pdf + encodeURIComponent(this.src);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.pdf {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 33;
  width: 100%;
  padding-top: 46px;
  iframe {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
