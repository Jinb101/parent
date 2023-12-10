<template>
  <div class="app_fixed">
    <transition name="fade">
      <div class="frame_child" v-if="frameOpen">
        <span class="close" @click="onCloseFrame"
          ><van-icon name="cross"
        /></span>
        <iframe :src="frameUrl" frameborder="0"></iframe>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      item: {},
      frameOpen: false,
      frame: "",
      frameUrl: "",
    };
  },
  watch: {
    vuex_fixed: {
      handler(n) {
        this.init(n);
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      vuex_fixed: "fixed",
    }),
  },
  methods: {
    init(n) {
      this.item = n.data;
      this.frameOpen = false;
      switch (n.type) {
        case "frame":
          this.frameOpen = true;
          this.frameUrl = this.$js.html(n.data.name);
          break;
        case "h5":
          this.frameOpen = true;
          this.frameUrl = n.data.src;
          break;
        case "close":
          this.item = {};
          break;
        default:
      }
      // console.log(n);
    },
    onCloseFrame() {
      this.$store.dispatch("setFixed", {
        type: "close",
        data: {},
      });
    },
  },
  mounted() {
    /**
      this.$store.dispatch('setFixed',{
        type:'add',data:{}
      })
     */
  },
};
</script>
<style lang='less' scoped>
.app_fixed {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  .frame_child {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    box-shadow: 0 0 20px #999;
    border-radius: 8px;
    overflow: hidden;
    iframe {
      display: block;
      width: 100%;
      height: 100%;
    }
    .close {
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
