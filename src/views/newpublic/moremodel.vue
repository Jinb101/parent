<template>
  <div class="moremodel" :class="{ tag: tag }" @click.stop="">
    <van-popover v-model="open" trigger="click" :placement="dire" theme="dark">
      <div class="trigger_tag flex" :class="{ fw: item.length > 3 }">
        <template v-if="item.length">
          <span v-for="(i, j) in item" :key="j" @click="onTag(i, j)">
            <van-icon :name="i.icon" />{{ i.text }}
          </span>
        </template>
        <template v-if="$slots.default"><slot /> </template>
      </div>
      <template #reference>
        <van-icon name="ellipsis" />
      </template>
    </van-popover>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    dire: { type: String, default: "left" },
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tag: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    open: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    open(n) {
      this.$emit("input", n);
    },
  },
  methods: {
    onTag(e, $index) {
      this.$emit("change", { ...e, $index });
      this.open = false;
    },
  },
  mounted() {
    this.open = this.value;
  },
};
</script>
<style lang='less' scoped>
.moremodel {
  font-size: 20px;
  position: relative;
  &::before {
    position: absolute;
    content: "";
    width: 150%;
    height: 150%;
    left: -25%;
    top: -25%;
  }
}
.tag {
  position: absolute;
  padding: 0 8px 0 15px;
  right: 0;
  top: 0;
}
.trigger_tag {
  max-width: 280px;
  span {
    margin-bottom: 3px;
  }
}
</style>
