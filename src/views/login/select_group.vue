<template>
  <div class="select_group">
    <template v-if="list">
      <slot />
    </template>
    <template v-else>
      <p class="label">选择园所</p>
      <van-cell
        :title="changetext"
        :label="changetext ? '' : '点击选择园所'"
        is-link
        @click="onc"
      ></van-cell>
    </template>
    <v-s text="label" v-model="os" :open="open" :list="groups"></v-s>
  </div>
</template>

<script>
import vS from "./select_select.vue";
export default {
  props: {
    value: null,
    list: Boolean,
  },
  data() {
    return {
      timer: null,
      groups: [],
      os: {},
      open: false,
    };
  },
  components: { vS },
  computed: {
    val: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    changetext() {
      return this.os.label ? this.os.label : "";
    },
  },
  watch: {
    val(n) {
      this.onTimer();
      this.$emit("input", n);
    },
    os: {
      handler(n) {
        this.$emit("change", n);
      },
      deep: true,
    },
  },
  methods: {
    onc() {
      if (this.list) return 0;
      if (!this.val) return this.$toast("请输入账号");
      if (this.groups.length) {
        this.open = !this.open;
      } else {
        this.$toast("该账号暂无园所可供选择");
      }
    },
    onTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.onGroups();
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    },
    // 获取手机号所有园所
    onGroups() {
      if (this.val === "") {
        this.groups = [];
        this.os = {};
        return 0;
      }
      if (this.list) return 0;
      this.$api.http("a1130", { phone: this.val }, (r) => {
        this.groups = r.map((s) => {
          return {
            label: (s.nursery || {}).name,
            value: s.n_id,
          };
        });
        if (this.groups.length) {
          this.os = this.groups[0];
        } else {
          this.os = {};
        }
      });
      // this.$api.http("", {}, (r) => {
      //   console.log(r);
      // });
    },
  },
  mounted() {
    this.val = this.value;
    this.onTimer();
  },
};
</script>
<style lang='less' scoped>
.label {
  font-size: 0.48rem;
  color: #222;
  font-weight: 700;
  width: 100%;
  line-height: 1;
  padding: 10px 0;
}
</style>
