<template>
  <van-popup
    v-model="show"
    :position="dire"
    :style="{ height: h }"
    :closeable="close"
    :round="round"
    get-container="#app"
    safe-area-inset-bottom
  >
    <van-picker
      :title="title"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
      :value-key="keys"
      v-if="type === 'picker'"
      item-height="1.17333rem"
    />
    <slot v-else />
  </van-popup>
</template>

<script>
export default {
  props: {
    dire: { type: String, default: "bottom" },
    h: { type: String, default: "50%" },
    close: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    type: { type: String, default: "picker" },
    open: { type: [Number, String], default: 0 },
    title: { type: String, default: "" },
    keys: { type: String, default: "name" },
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      show: false,
      columns: [],
    };
  },
  watch: {
    open(n) {
      this.show = n > 0;
    },
    item: {
      handler(n) {
        this.columns = n;
      },
      deep: true,
    },
  },
  methods: {
    onConfirm(e, index) {
      this.$emit("on-change", { type: this.type, data: e, index });
      this.show = false;
    },
    onCancel() {
      this.$emit("on-reset", { type: this.type });
      this.show = false;
    },
    onChange() {},
  },
  mounted() {
    this.columns = this.item;
  },
};
</script>
<style lang='less' scoped>
</style>
