<template>
  <van-datetime-picker
    v-model="time"
    :type="type"
    :title="title"
    :min-date="minDate"
    :max-date="maxDate"
    item-height="1.17333rem"
    :formatter="formatter"
    @confirm="sub"
    @cancel="close"
  />
</template>

<script>
export default {
  props: {
    max: { type: [String, Number], default: 0 },
    min: { type: [String, Number], default: 0 },
    title: { type: String, default: "选择年月日" },
    type: { type: String, default: "date" },
    temp: { type: Boolean, default: false },
  },
  data() {
    return {
      time: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
    };
  },
  watch: {
    max() {
      this.setMax();
    },
    min() {
      this.setMin();
    },
  },
  methods: {
    formatter(type, val) {
      if (!this.temp) return val;
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      }
      return val;
    },
    setMax() {
      if (this.max) {
        this.maxDate = new Date(this.$demo.timeout(this.max, "zero"));

        if (this.time.getTime() > this.maxDate.getTime()) {
          this.time = this.maxDate;
        }
      }
    },
    setMin() {
      if (this.min) {
        this.minDate = new Date(this.$demo.timeout(this.min, "zero"));

        if (this.time.getTime() < this.minDate.getTime()) {
          this.time = this.minDate;
        }
      }
    },
    setDate() {
      let year = new Date().getFullYear();
      this.minDate = new Date(year - 8, 0, 1);
      this.maxDate = new Date(year + 8, 10, 1);
      this.setMax();
      this.setMin();
    },
    sub() {
      let val = this.time.getTime();
      let os = {
        obj: this.$demo.timeout(val, "object"),
        time: this.$demo.timeout(val, "ymd"),
        arr: this.$demo.timeout(val, "array"),
        val,
      };
      this.$emit("on-change", os);
      this.$emit("on-close");
    },
    close() {
      this.$emit("on-close");
      this.$emit("on-cancel");
    },
  },
  mounted() {
    this.setDate();
  },
};
</script>
<style lang='less' scoped>
</style>
