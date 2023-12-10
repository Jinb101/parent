<template>
  <div class="list">
    <div class="view">
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <van-cell
          v-for="(q, w) in item"
          :key="w + '-3'"
          :title="q.evaluation_time"
          is-link
          @click="ondetail(q)"
        ></van-cell>
      </v-page>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { item: [] };
  },
  inject: ["appPath"],
  methods: {
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("a2023041403", { page }, (e) => {
        let a = e.map((s) => {
          return s.list;
        });
        let b = [];
        a.forEach((k) => {
          b.push(...k);
        });
        this.item = this.item.concat(b);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondetail(e) {
      this.$emit("change", e.evaluation_records_id);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.help {
  .view {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
}
</style>
