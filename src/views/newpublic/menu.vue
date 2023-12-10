<template>
  <ul class="flex fw">
    <li v-for="(i, j) in menu" :key="j" @click="onMenu(i, j)" :style="wid">
      <div
        class="logo"
        :class="[cls, { square: i.square }, { default: i.default }, toClass(i)]"
        :style="sty"
      >
        <van-image :src="i.icon" fit="cover" v-if="i.icon"></van-image>
        <!-- <template v-if="i.icon">
          <template v-if="i.square && i.theme > 0">
            <van-image :src="i.icon" fit="cover"></van-image>
          </template>
          <van-image :src="i.icon" fit="cover" v-else></van-image>
        </template> -->
      </div>
      <template v-if="i.num > 0">
        <van-badge :content="i.num" max="9">
          <p class="desc">{{ i.text }}</p>
        </van-badge>
      </template>
      <template v-else>
        <p class="desc">{{ i.text }}</p>
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    value: null,
    column: { type: [String, Number], default: 4 },
    cls: String,
    sty: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    menu: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    wid() {
      let l = 100 / this.column;
      return { width: l.toFixed(2) + "%" };
    },
  },
  watch: {
    menu: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    toClass(i) {
      let num = i.square ? i.theme : 0;
      if (+num === 0) return "";
      return (
        ["", "purple", "primary", "info", "purple", "orange"][num] + " invert"
      );
    },
    onMenu(e, index) {
      this.$emit("change", e, index);
    },
  },
  mounted() {
    this.menu = this.value;
  },
};
</script>
<style lang='less' scoped>
li {
  width: 25%;
  text-align: center;
  position: relative;
  margin-top: 8px;
  font-size: 12px;
  .logo {
    width: 50px;
    height: 50px;
    background-color: #f7f7f7;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    &.purple {
      background: linear-gradient(
        135deg,
        rgb(255, 255, 255),
        rgb(171, 149, 241),
        rgb(105, 67, 242)
      );
    }
    &.primary {
      background: linear-gradient(
        135deg,
        rgb(255, 255, 255),
        rgb(158, 204, 255),
        rgb(75, 161, 255)
      );
    }
    &.info {
      background: linear-gradient(
        135deg,
        rgb(255, 255, 255),
        rgb(180, 247, 185),
        rgb(89, 219, 176)
      );
    }
    &.orange {
      background: linear-gradient(
        135deg,
        rgb(255, 255, 255),
        rgb(248, 180, 119),
        rgb(255, 83, 1)
      );
    }
    &.square {
      border-radius: 0;
    }
    &.default {
      background-color: transparent;
      transform: scale(0.9);
    }
  }
  .desc {
    padding: 10px 0;
    font-weight: 650;
  }
  .invert {
    border-radius: 30% !important;
    transform: scale(1.05) !important;
    overflow: hidden;
    .van-image {
      transform: scale(0.6);
      filter: grayscale(100%) brightness(200%) invert(100%);
    }
  }
}
</style>
