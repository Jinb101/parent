<template>
  <van-popup
    v-model="show"
    position="bottom"
    :style="{ height: '50%' }"
    get-container="#app"
    close-on-popstate
    safe-area-inset-bottom
  >
    <van-datetime-picker
      v-model="currentDate"
      :type="type"
      :title="title"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      item-height="1.1733rem"
      @confirm="onChange"
      @cancel="onClose"
      class="app_time"
    />
  </van-popup>
</template>

<script>
// eslint-disable-next-line
const timeout = demo.timeout("", "array");
export default {
  props: {
    title: { type: String, default: "选择时间" },
    type: { type: String, default: "date" },
    open: Boolean,
    ymd: Boolean,
    value: null,
    max: String, // d_7 m_5 y_3
    min: String,
    once: [String, Number], // 静默获取 0当月 1下月 -1上月
  },
  data() {
    return {
      show: false,
      currentDate: new Date(),
      minDate: new Date(timeout[0] - 10, 0, 1),
      maxDate: new Date(timeout[0] + 5, 10, 1),
    };
  },
  watch: {
    open() {
      this.show = true;
    },
    times: {
      handler(n) {
        this.$emit("input", n);
      },
      deep: true,
    },
    max(n) {
      this.toSetMaxDate(n);
    },
    min(n) {
      this.toSetMinDate(n);
    },
    once() {
      this.toSetDate();
    },
  },
  computed: {
    times: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      },
    },
  },
  methods: {
    toSetDate() {
      let i = this.once;
      let day = new Date();
      if (typeof this.times === "object" && this.times.times !== undefined) {
        day = new Date(this.times.times);
      }
      switch (+i) {
        case 1:
          this.onChange(new Date(day.setMonth(day.getMonth() + 1)));
          break;
        case -1:
          this.onChange(new Date(day.setMonth(day.getMonth() - 1)));
          break;
        case 0:
          this.onChange(day);
          break;
        default:
      }
    },
    toSetMaxDate(n) {
      if (!n) return 0;
      let s = (n + "").split("_");
      let type = s[0];
      let index = +s[1];
      let day = 0;
      let y = timeout[0];
      let m = +timeout[1];
      let d = +timeout[2];
      switch (type) {
        case "m":
          day = m + index;
          if (day > 12) {
            y += Math.floor(day / 12);
            m = day % 12;
          } else if (day < 0) {
            y += Math.ceil(day / 12);
            m = Math.abs(day % 12);
          } else {
            m = day;
          }
          break;
        case "y":
          y += index;
          break;
        default:
          day = 864e5 * index;
          // eslint-disable-next-line
          let dx = demo.timeout(Date.now() + day, "array");
          y = dx[0];
          m = dx[1];
          d = dx[2];
      }
      this.maxDate = new Date([y, m, d].join("/"));
    },
    toSetMinDate(n) {
      if (!n) return 0;
      let s = (n + "").split("_");
      let type = s[0];
      let index = +s[1];
      let day = 0;
      let y = timeout[0];
      let m = +timeout[1];
      let d = +timeout[2];
      switch (type) {
        case "m":
          day = m + index;
          if (day > 12) {
            y -= Math.floor(day / 12);
            m = day % 12;
          } else if (day < 0) {
            y -= Math.ceil(day / 12);
            m = Math.abs(day % 12);
          } else {
            m = day;
          }
          break;
        case "y":
          y -= index;
          break;
        default:
          day = 865e4 * index;
          let tm = [timeout[0], timeout[1], timeout[2]].join("/");
          // eslint-disable-next-line
          let dx = demo.timeout(new Date(tm).getTime() - day, "array");
          y = dx[0];
          m = dx[1];
          d = dx[2];
      }
      this.minDate = new Date([y, m, d].join("/"));
    },
    toggle() {
      this.show = !this.show;
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
    onChange(e) {
      // eslint-disable-next-line
      let time = demo.timeout(e.getTime(), "object");
      let os = {
        time: time.default,
        times: e.getTime(),
        ymd: [time.y, time.m, time.d].join("-"),
        obj: time,
      };
      if (this.ymd) {
        this.times = os.ymd;
      } else {
        this.times = os;
      }
      this.show = false;
      return this.times;
    },
    onClose() {
      this.show = false;
      if (this.ymd) {
        this.times = "";
      } else {
        this.times = {};
      }
    },
  },
  mounted() {
    this.times = this.value;
    this.toSetMaxDate(this.max);
    this.toSetMinDate(this.min);
    this.toSetDate();
  },
};
</script>
<style lang='less'>
.app_time .van-picker__frame {
  border-top: 1px solid plum;
  border-bottom: 1px solid plum;
}
</style>
