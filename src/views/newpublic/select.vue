<template>
  <van-popup
    v-model="showPicker"
    position="bottom"
    :style="{ height: '50%' }"
    get-container="#app"
    close-on-popstate
    safe-area-inset-bottom
  >
    <van-picker
      show-toolbar
      :columns="lists"
      @cancel="showPicker = false"
      @confirm="onConfirm"
      :default-index="index"
      class="app_select"
    />
  </van-popup>
</template>

<script>
export default {
  props: {
    value: null,
    open: Boolean,
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    text: { type: String, default: "name" },
    keys: [String, Number],
    noselect: Boolean,
    type: String,
  },
  data() {
    return {
      showPicker: false,
      index: 0,
      lists: [],
    };
  },
  computed: {
    item: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  watch: {
    open() {
      this.showPicker = !this.showPicker;
    },
    item: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    list: {
      handler() {
        this.onList();
      },
      deep: true,
    },
  },
  methods: {
    onConfirm(e, v) {
      // eslint-disable-next-line
      let type = demo.$obj(this.item, 1);
      // eslint-disable-next-line
      let tp = demo.$obj(e, 1);
      if (tp !== type) {
        switch (+type) {
          case 6:
            this.item = {};
            break;
          case 4:
            this.item = [];
            break;
          default:
            this.item = "";
        }
      } else {
        this.item = e;
      }

      this.showPicker = false;
      if (this.noselect) {
        if (v.length) {
          let v1 = this.list[v[0]] || {};
          let v2 = (v1.children || [])[v[1]] || {};
          let v3 = (v2.children || [])[v[2]] || {};
          let arr = [v1, v2, v3];
          this.$emit("change", arr, { e, v }, this.type);
          return 0;
        }
      }
      this.$emit("change", v, e, this.type);
    },
    onList() {
      let n = JSON.parse(JSON.stringify(this.list));
      if (this.noselect) {
        return (this.lists = n);
      }
      this.index = n.length > 2 ? 2 : 0;
      if (this.keys !== "" && !isNaN(this.keys)) {
        this.index = this.keys;
      }
      let key = this.text;
      this.lists = [...n].map((s) => {
        if (key !== "text") {
          s.text = s[key];
          if (s.children && s.children.length) {
            s.children = s.children.map((r) => {
              r.text = r[key];
              if (r.children && r.children.length) {
                r.children = r.children.map((q) => {
                  q.text = q[key];
                  return q;
                });
              }
              return r;
            });
          }
        }
        return s;
      });
    },
  },
  mounted() {
    this.item = this.value;
    this.onList();
  },
};
</script>
<style lang='less'>
.app_select .van-picker__frame {
  border-top: 1px solid plum;
  border-bottom: 1px solid plum;
}
</style>
