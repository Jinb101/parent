<template>
  <div class="grow_integral">
    <v-tool-title :text="title">
      <span v-if="child" @click="child = false">
        <van-icon name="cross" size="20" color="tomato" />
      </span>
      <span class="col_green" @click="open++" v-else>选择学年:{{ year }}</span>
    </v-tool-title>
    <div class="tab">
      <van-tabs
        v-model="type"
        :color="theme.bgc"
        :title-active-color="theme.bgc"
      >
        <van-tab
          :title="i.t"
          v-for="(i, j) in tab"
          :key="j + '-tab'"
          :name="i.v"
        ></van-tab>
      </van-tabs>
    </div>
    <div class="view">
      <div v-if="type === '1'">
        <section
          v-for="(i, j) in list"
          :key="j + '-l'"
          class="flex van-hairline--bottom"
          @click="onDetail(i)"
        >
          <p>{{ i.year }}</p>
          <p>{{ i.val }}分</p>
          <p class="r"><span class="col_green">详情</span></p>
        </section>
      </div>
      <div v-else-if="type === '2'">
        <section
          class="flex van-hairline--bottom"
          @click="onDetail(last, true)"
        >
          <p>{{ last.describe }}</p>
          <p>{{ last.integral }}分</p>
          <p class="r"><span class="col_green">详情</span></p>
        </section>
        <section class="flex" @click="onDetail(lower)">
          <p>{{ lower.describe }}</p>
          <p>{{ lower.integral }}分</p>
          <p class="r"><span class="col_green">详情</span></p>
        </section>
      </div>
      <div v-else>
        <section class="flex" @click="onDetail(last)">
          <p>{{ last.describe }}</p>
          <p>{{ last.integral }}分</p>
          <p class="r"><span class="col_green">详情</span></p>
        </section>
      </div>
    </div>
    <v-p :open="open" :item="years" @on-change="onTimed"></v-p>
    <transition name="fade">
      <div class="app_show_fixed" v-if="child">
        <van-tabs
          v-model="ct"
          :color="theme.bgc"
          :title-active-color="theme.bgc"
        >
          <van-tab
            :title="i.t"
            v-for="(i, j) in bar"
            :key="j + '-tab'"
            :name="i.v"
          ></van-tab>
        </van-tabs>
        <v-tool-page
          class="child_view"
          :open="pageOpen"
          :end="pageEnd"
          @on-page="onPage"
        >
          <van-empty description="暂无积分" v-if="!item.length" />
          <section
            v-for="(i, j) in item"
            :key="j + '-se'"
            class="van-hairline--bottom"
          >
            <p>
              奖分：<b class="col_info">{{ i.integral }}分</b>
            </p>
            <p>备注：{{ i.describe }}</p>
            <p v-if="i.photograph">附件：</p>
            <div class="ava" v-if="i.photograph">
              <van-image :src="i.photograph" fit="cover"></van-image>
            </div>
          </section>
        </v-tool-page>
      </div>
    </transition>
  </div>
</template>

<script>
import vP from "../../private/popup.vue";
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      year: "",
      type: "",
      tab: [
        { t: "月积分", v: "1" },
        { t: "学期积分", v: "2" },
        { t: "学年积分", v: "3" },
      ],
      bar: [
        { t: "出勤积分", v: "1" },
        { t: "成长任务", v: "2" },
        { t: "老师奖励", v: "4" },
      ],
      theme: {},
      item: [],
      pageOpen: 0,
      pageEnd: false,
      list: [],
      last: {},
      lower: {},
      open: 0,
      years: [],
      child: false,
      ct: "1",
      semester: "",
      month: "",
    };
  },
  watch: {
    type() {
      this.init();
    },
    ct() {
      this.onPage(1);
    },
  },
  computed: {
    title() {
      if (this.child) {
        let tp = this.type;
        let v = this.tab.filter((s) => {
          return s.v === tp;
        })[0].t;
        return "宝宝" + v;
      }
      return "";
    },
  },
  components: { vP, vT },
  inject: ["appGetTheme"],
  methods: {
    onPage(e) {
      let os = this.$demo.copy(
        Object.assign(
          {},
          { page: e, limit: 20 },
          {
            type: this.ct,
            year: this.year,
            month: this.month,
            semester: this.semester,
          }
        )
      );
      this.$api.http("growIntegralDetail", os, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
    onTimed(e) {
      this.year = e.data.value;
      this.init();
    },
    onDetail(e, f) {
      this.semester = "";
      this.month = "";
      if (+this.type === 1) {
        this.month = e.year.split("-")[1];
      } else if (+this.type === 2) {
        this.semester = f ? 1 : 2;
      }
      this.child = true;
      this.onPage(1);
    },
    init() {
      this.$api.http(
        "growIntegral",
        { type: this.type, year: this.year },
        (r) => {
          if (this.type === "1") {
            this.list = Object.keys(r).map((s) => {
              return { year: s, val: r[s] };
            });
          } else {
            this.last = r.last;
            this.lower = r.lower;
          }
        }
      );
    },
  },
  mounted() {
    let yy = (this.year = new Date().getFullYear());
    let a = [];
    for (let i = 0; i < 10; i++) {
      a.push({ name: yy - i + "年", value: yy - i });
    }
    this.years = a;
    this.theme = this.appGetTheme();
    this.type = "1";
  },
};
</script>
<style lang='less' scoped>
.grow_integral {
  .child_view {
    height: calc(100% - 44px);
    section {
      padding: 15px;
      font-size: 15px;
      p {
        line-height: 1.2;
        padding: 5px 0;
        b {
          font-weight: 650;
        }
      }
      .ava {
        width: 120px;
        height: 120px;
      }
    }
  }
  .view {
    height: calc(100% - 90px);
    overflow-y: scroll;
    section {
      padding: 10px;
      font-size: 15px;
      line-height: 22px;
      p {
        flex: 1;
        &:first-child {
          flex: 2;
        }
        &.r {
          text-align: right;
        }
      }
    }
  }
}
</style>
