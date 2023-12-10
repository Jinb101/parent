<template>
  <div class="x_box" :class="cls" @click.stop="onClick">
    <div class="header x_flex" v-if="header" @click.stop="onHeaderClick">
      <span class="icon" :class="clh" v-if="logo">
        <template v-if="$slots.icon">
          <slot name="icon" />
        </template>
      </span>
      <p class="title text_overflow">{{ title }}</p>
      <div class="btns">
        <template v-if="$slots.btn">
          <slot name="btn" />
        </template>
      </div>
    </div>
    <div class="view">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "XBox",
  componentName: "XBox",
  props: {
    size: { type: String, default: "middle" },
    header: { type: Boolean, default: true },
    title: { type: String, default: "Title" },
    icon: { type: String, default: "" },
    logo: { type: Boolean, default: true },
  },
  computed: {
    cls() {
      return "x_box_" + this.size;
    },
    clh() {
      if (this.$slots.icon) return "";
      return "x_icon_" + this.icon;
    },
  },
  data() {
    return {};
  },
  methods: {
    onHeaderClick() {
      this.$emit("on-click", this.title);
      this.$nextTick(() => {
        this.onClick();
      });
    },
    onClick() {
      this.$emit("click", this.title);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
