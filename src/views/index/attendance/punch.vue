<template>
  <div class="user_atten_punch">
    <v-tool-title>
      <span class="time col_ash" @click="openTime++">
        {{ time ? time : "时间选择" }}
      </span>
    </v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无打卡记录" v-if="!item.length" />
      <section
        class="van-hairline--bottom"
        v-for="(i, j) in item"
        :key="j + '-s'"
      >
        <p>{{ i.date }}</p>
        <p>入园时间：{{ appTimeout(i.enter_time) }}</p>
        <p>离园时间：{{ i.leave_time ? appTimeout(i.leave_time) : "" }}</p>
      </section>
    </v-tool-page>
    <v-popup type="date" :open="openTime">
      <v-t
        @on-close="openTime = 0"
        @on-change="onTimeChange"
        type="year-month"
      ></v-t>
    </v-popup>
  </div>
</template>

<script>
import vPopup from "../../private/popup.vue";
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      openTime: 0,
      time: "",
      date: [],
      item: [],
      pageOpen: 0,
      pageEnd: false,
    };
  },
  inject: ["appTimeout"],
  components: { vPopup, vT },
  watch: {
    date: {
      handler(n) {
        if (n.length > 1) {
          this.time = n[0] + "/" + n[1];
          this.onPage(1);
        }
      },
      deep: true,
    },
  },
  methods: {
    onTimeChange(e) {
      this.date = e.arr;
    },
    onPage(e) {
      this.$api.http(
        "attendancePunch",
        { page: e, limit: 20, year_month: this.time.replace("/", "-") },
        (r) => {
          this.pageOpen++;
          if (e === 1) {
            this.item = r;
            return 0;
          }
          this.item = this.item.concat(r);
          this.pageEnd = r.length !== 20;
        }
      );
    },
  },
  mounted() {
    this.date = this.$demo.timeout("", "array");
  },
};
</script>
<style lang='less' scoped>
.user_atten_punch {
  section {
    padding: 10px;
    p {
      font-size: 14px;
      line-height: 30px;
      height: 30px;
      &:first-child {
        font-weight: 650;
      }
    }
  }
}
</style>
