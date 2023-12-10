<template>
  <transition name="van-slide-left">
    <div class="app_show_fixed top" :style="sty" v-if="open">
      <template v-if="customize">
        <slot name="custom" />
      </template>
      <v-view
        :text="text"
        :header="header"
        back
        @on-back="open = false"
        ref="view"
        :overflow="overflow"
        :bgc="bgc"
        :bar="footer"
        :cover="cover"
        :coverBgc="coverBgc"
        :coverBgcs="coverBgcs"
        :retreat="retreat"
        @on-cover="oncover"
      >
        <slot :scope="rect" />
        <template #fixed>
          <slot name="fixed" />
        </template>
        <template #menu>
          <slot name="menu" />
        </template>
      </v-view>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: String,
    index: [String, Number],
    value: null,
    overflow: Boolean,
    bgc: String,
    footer: Boolean,
    cover: Boolean,
    customize: Boolean,
    header: { type: Boolean, default: true },
    coverBgc: String,
    coverBgcs: {
      type: Object,
      default: () => {
        return {};
      },
    },
    retreat: Boolean,
  },
  computed: {
    sty() {
      return { "z-index": this.index };
    },
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
      if (n) {
        this.$nextTick(() => {
          let a = this.$refs.view;
          try {
            this.rect = a.rect;
          } catch (err) {}
        });
      }
    },
  },
  data() {
    return {
      rect: {},
    };
  },
  methods: {
    oncover(e) {
      this.$emit("on-cover", e);
    },
  },
  mounted() {
    this.open = this.value;
  },
};
</script>
<style lang='less' scoped>
</style>
