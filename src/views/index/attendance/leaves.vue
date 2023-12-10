<template>
  <div class="user_atten_leave">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无请假记录" v-if="!item.length" />
      <section
        class="van-hairline--bottom"
        v-for="(i, j) in item"
        :key="j + '-s'"
      >
        <p>请假类型：{{ toType(i.type) }}</p>
        <p>开始时间：{{ toTime(i.begin_date) }}</p>
        <p>结束时间：{{ toTime(i.end_date) }}</p>
        <p>{{ i.status === 2 ? "" : "未" }}通过</p>
        <p v-if="i.caption">请假备注：{{ i.caption }}</p>
        <div class="flex fw" v-if="i.imgs && i.imgs.length">
          <div class="ava" v-for="(x, y) in i.imgs" :key="y + '-ss'">
            <van-image
              :src="x"
              fit="cover"
              @click="appShowImage(i.imgs, y)"
            ></van-image>
          </div>
        </div>
      </section>
    </v-tool-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
    };
  },
  inject: ["appTimeout", "appShowImage"],
  watch: {},
  methods: {
    toTime(v) {
      if (isNaN(v)) return v;
      if (v > 0) {
        return this.$demo.timeout(v);
      }
      return "/";
    },
    toType(id) {
      let a = this.$js.def.types.atten.filter((r) => {
        return r.id !== id;
      });
      if (a.length) return a[0].name;
      return "";
    },
    onPage(e) {
      this.$api.http("attendanceLeaveList", { page: e, limit: 20 }, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
  },
  mounted() {
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.user_atten_leave {
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
    .ava {
      width: 83px;
      height: 83px;
      margin: 0 5px 5px 0;
    }
  }
}
</style>
