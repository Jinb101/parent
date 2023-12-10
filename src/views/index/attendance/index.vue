<template>
  <div class="attendance">
    <v-tool-title>
      <span class="time col_ash" @click="openTime++">
        {{ time ? time : "时间选择" }}
      </span>
    </v-tool-title>
    <div class="days">
      <div class="head flex">
        <span v-for="(i, j) in tq" :key="j + '-d'">{{ i }}</span>
      </div>
      <div class="day flex fw">
        <section
          v-for="(i, j) in list"
          :key="j + '-li'"
          :class="[{ active: index === j }, { box: i.day }]"
          @click="onClickSpan(i, j)"
        >
          <b>{{ i.day }}</b>
          <span class="circle" :class="i.ext.enter"></span>
          <span class="circle c2" :class="i.ext.leave"></span>
        </section>
      </div>
    </div>
    <div class="texts flex van-hairline--top">
      <div class="num">
        <p>{{ detail.attendance }}<b>天</b></p>
        <span>本月出勤天数</span>
      </div>
      <div class="tag">
        <p>迟到：{{ detail.late }}次</p>
        <p>早退：{{ detail.leave_early }}次</p>
        <p>缺勤：{{ detail.absence }}次</p>
        <p>请假：{{ detail.leave }}次</p>
      </div>
    </div>
    <div class="tool flex">
      <span @click="appPath('/attendance_punch')">打卡记录</span>
      <span @click="appPath('/attendance_leave')">请假</span>
      <span @click="appPath('/attendance_leaves')">请假记录</span>
    </div>
    <transition name="fade">
      <div v-if="help">
        <div class="hp flex">
          <p><i class="bgc_purple"></i><b>迟到</b></p>
          <p><i class="bgc_warning"></i><b>早退</b></p>
          <p><i class="bgc_danger"></i><b>缺勤</b></p>
          <p><i class="bgc_info"></i><b>请假</b></p>
          <p><i class="bgc_green"></i><b>打卡</b></p>
        </div>
        <h6 class="desc">说明：不同考勤状态对应不同颜色的小点</h6>
      </div>
    </transition>
    <span class="help" @click="help = !help">
      <van-icon name="question-o" />
    </span>
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
      time: "",
      date: [],
      openTime: 0,
      days: [],
      tx: "日一二三四五六",
      list: [],
      index: 0,
      help: true,
      detail: {},
      info: {},
      vals: "",
    };
  },
  computed: {
    tq() {
      return this.tx.split("");
    },
  },
  inject: ["appPath"],
  components: { vPopup, vT },
  watch: {
    date: {
      handler(n) {
        if (n.length > 1) {
          this.time = n[0] + "/" + n[1];
          this.init();
        }
      },
      deep: true,
    },
    days: {
      handler(n) {
        if (n.length) {
          let v = n[0].week || "";
          v = v.replace("星期", "");
          let index = this.tq.indexOf(v);
          let o = [];
          if (index > 0) {
            for (let i = 0; i < index; i++) {
              o.push({ ext: {} });
            }
          }
          let ts = this;
          ts.list = o.concat(ts.days);
          ts.list = ts.list.map((t) => {
            if (ts.info[t.time]) {
              t.ext = ts.info[t.time];
            }
            return t;
          });
          let t = ts.$demo.timeout("", "ymd");
          let ind = ts.list.filter((r, v) => {
            r.index = v;
            return r.time === t;
          });
          ts.index = o.length;
          if (ind.length) {
            ts.index = ind[0].index;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    onClickSpan(i, j) {
      this.index = j;
    },
    onTimeChange(e) {
      this.date = e.arr;
      this.vals = e.val;
    },
    init() {
      // 1出勤 2 缺勤 3迟到 4早退 5请假 0当日未打卡
      this.$api.http(
        "attendance",
        { date: this.time.replace("/", "-") },
        (e) => {
          this.detail = e;
          let col = ["", "green", "danger", "purple", "warning", "info"];
          let s = {};
          Object.values(e.info).forEach((r, v) => {
            let time = r.specific_date.replace(/-/g, "/");
            s[time] = {
              time,
              index: v,
              enter: "bgc_" + col[+r.enter_status],
              leave: "bgc_" + col[+r.leave_status],
            };
          });
          this.info = s;
          this.days = this.$demo.month().month(this.vals);
        }
      );
    },
  },
  mounted() {
    this.date = this.$demo.timeout("", "array");
    // this.days = this.$demo.month().month();
  },
};
</script>
<style lang='less' scoped>
.attendance {
  overflow-y: scroll;
  .time {
    font-weight: 650;
  }
  .desc {
    font-size: 14px;
    padding: 0 10px;
    color: #999;
  }
  .help {
    z-index: 30;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 1px 1px #ccc;
    position: fixed;
    bottom: 10px;
    right: 10px;
    text-align: center;
    font-size: 20px;
    color: #999;
    .van-icon {
      line-height: 40px;
    }
  }
  .texts {
    font-size: 14px;
    padding-top: 5px;
    color: #888;
    .num,
    .tag {
      width: 50%;
      box-sizing: border-box;
      text-align: center;
    }
    .tag {
      text-align: right;
      padding-right: 30px;
      line-height: 1.5;
    }
    .num {
      padding-top: 10px;
      p {
        margin-bottom: 10px;
        font-size: 40px;
        color: #2ea875;
        b {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
  .tool {
    margin-bottom: 10px;
    span {
      border-bottom: 1px solid tomato;
      box-sizing: border-box;
      font-weight: 650;
      &:nth-child(2) {
        border-color: #2ea875;
        color: #666;
        border-top: 1px solid;
      }
    }
  }
  .hp,
  .tool {
    font-size: 14px;
    margin-top: 10px;
    span,
    p {
      color: #999;
      height: 40px;
      line-height: 40px;
      text-align: center;
      flex: 1;
    }
    p {
      i {
        width: 8px;
        height: 8px;
        display: inline-block;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 3px;
      }
      color: #333;
    }
  }
  .days {
    font-size: 14px;
    .head {
      background-color: #fff;
      box-shadow: 0 0 5px #999;
      height: 30px;
      padding: 0 2px;
      line-height: 30px;
      span {
        flex: 1;
        text-align: center;
      }
    }
    .day {
      padding: 8px 2px;
      section {
        width: 53px;
        text-align: center;
        height: 50px;
        position: relative;
        line-height: 50px;
        font-weight: 500;
        margin: 3px 0;
        &.active {
          background-color: #99cc33;
          border-radius: 50%;
          color: #fff;
        }
        &.box {
          .circle {
            position: absolute;
            left: 0;
            right: 10px;
            margin: auto;
            bottom: 5px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            &.c2 {
              right: -10px;
            }
          }
        }
      }
    }
  }
}
</style>
