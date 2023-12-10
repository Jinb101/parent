<template>
  <div class="x_line x_flex">
    <div class="text">
      <p v-for="(i, j) in item" :key="j + '-line'" @click="onClick(i, j)">
        {{ i.label }}：<b>{{ i.value }}</b>
      </p>
    </div>
    <div class="canvas" @click="onCanvas">
      <div :id="ids" style="height: 100%"></div>
    </div>
    <div class="logo" @click="onLogo">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <i v-else :class="ico" class="ico"></i>
    </div>
  </div>
</template>

<script>
import chart from "../../temp/chart/chart";
export default {
  name: "XLine",
  componentName: "XLine",
  props: {
    text: {
      type: Array,
      default: () => {
        return []; // label,value
      },
    },
    title: { type: String, default: "出勤率" },
    ids: { type: String, default: "line-canvas-chart" },
    icon: { type: String, default: "" },
    type: { type: String, default: "" },
    name: { type: String, default: "" },
  },
  computed: {
    ico() {
      return "x_icon_" + this.icon;
    },
  },
  data() {
    return {
      item: [],
      canvas: null,
      num: 0,
    };
  },
  watch: {
    text: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  methods: {
    onClick(i, j) {
      this.$emit("on-click", i, j, this.name);
    },
    onCanvas() {
      this.$emit("on-canvas", this.name);
    },
    onLogo() {
      this.$emit("on-logo", this.name);
    },
    init() {
      this.item = [...this.text];
      let a = this.item[0].value || 0; // 出勤
      let b = this.item[1].value || 0;
      if (a + b === 0) return 0;
      this.num = (a / (a + b)) * 100;
      // eslint-disable-next-line
      this.canvas = echarts.init(document.getElementById(this.ids));
      this.canvas.setOption(chart.bar(this.title, this.num, this.type));
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
