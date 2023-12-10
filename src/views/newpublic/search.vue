<template>
  <div class="search">
    <van-search
      v-model="name"
      :placeholder="plac"
      @input="onSearchOnce"
      @search="onSearch"
      show-action
      shape="round"
      :background="bgc"
      :autofocus="focus"
      @clear="onclear"
    >
      <template #action>
        <div @click="onSearch" class="btn">{{ text }}</div>
      </template>
    </van-search>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    text: { type: String, default: "搜索" },
    bgc: { type: String, default: "transparent" },
    timeout: [String, Number],
    plac: { type: String, default: "请输入搜索关键词" },
    focus: Boolean,
    unauto: Boolean,
  },
  data() {
    return { name: "", timer: null };
  },
  computed: {
    val: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    val(n) {
      if (n === "") {
        this.name = "";
      } else {
        if (this.name === "") {
          this.name = n;
        }
      }
      this.$emit("input", n);
    },
  },
  methods: {
    times(fn) {
      let num = this.timeout;
      if (!num || num < 200) {
        num = 500;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        fn();
        clearTimeout(this.timer);
        this.timer = null;
      }, num);
    },
    onSearch() {
      this.times(() => {
        this.val = this.name;
        this.$nextTick(() => {
          this.$emit("search", this.name);
        });
      });
    },
    onSearchOnce() {
      if (this.unauto) return 0;
      this.onSearch();
    },
    onclear() {
      this.val = "";
    },
  },
  mounted() {
    this.val = this.value;
    this.name = this.val;
  },
};
</script>
<style lang='less' scoped>
.btn {
  padding: 0 10px;
}
</style>
