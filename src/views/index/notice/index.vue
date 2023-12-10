<template>
  <div class="index_notice">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无" v-if="!item.length" />
      <ul>
        <li
          v-for="(i, j) in item"
          :key="j + '-s'"
          class="van-hairline--bottom"
          @click="appPath('/notice_detail/' + i.id)"
        >
          <p><i class="status" v-if="i.status === 0"></i>{{ i.title }}</p>
          <b>{{ appTimeout(i.time) }}</b>
          <span :class="{ s: i.status === 0 }">
            {{ i.status === 0 ? "未" : "已" }}读
          </span>
        </li>
      </ul>
    </v-tool-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: {},
      pageOpen: 0,
      pageEnd: false,
      item: [],
    };
  },
  inject: ["appGetTheme", "appPath", "appTimeout"],
  watch: {},
  methods: {
    onPage(e) {
      this.$api.http("notice", { page: e, limit: 20 }, (r) => {
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
    this.theme = this.appGetTheme();
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.index_notice {
  li {
    padding: 10px;
    font-size: 16px;
    position: relative;
    p {
      line-height: 30px;
      height: 30px;
      font-weight: 700;
    }
    .status {
      width: 3px;
      height: 3px;
      display: inline-block;
      background-color: tomato;
      vertical-align: middle;
      margin-right: 5px;
    }
    span {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 12px;
      color: #ccc;
      opacity: 0.5;
      &.s {
        color: tomato;
      }
    }
    b {
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
