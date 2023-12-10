<template>
  <div
    class="x_header"
    ref="x-header"
    :style="styls"
    :class="[bgc, { pof: fixed }]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "XHeader",
  componentName: "XHeader",
  props: {
    auto: { type: Boolean, default: false },
    type: { type: String, default: "default" },
    color: {
      type: [Array, String],
    },
    tran: { type: Boolean, default: true }, // 渐变是否留白
    fixed: { type: Boolean, default: false },
  },
  data() {
    return {
      h: "",
    };
  },
  computed: {
    styls() {
      let os = {};
      if (this.h) {
        os["min-height"] = this.h + "px";
        os.height = "auto";
      }
      let type = Object.prototype.toString.call(this.color);
      let col =
        type === "[object String]" || type === "[object Undefined]"
          ? [this.color]
          : [...this.color];
      if (col.length) {
        let v = ["180deg", ...col];
        if (v.length === 2) {
          v.push("#fff");
        } else if (this.tran) {
          v.push("rgba(0,0,0,0)");
        }
        os.background = "linear-gradient(" + v.join(",") + ")";
      }
      return os;
    },
    bgc() {
      return "x_bgc_" + this.type;
    },
  },
  methods: {
    init() {
      if (this.auto) {
        let dom = this.$refs["x-header"];
        let w = dom.clientWidth;
        this.h = w / 1.78;
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
