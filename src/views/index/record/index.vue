<template>
  <v-view header>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <van-cell
        v-for="(i, j) in item"
        :key="j"
        is-link
        :label="i.staff_name + '老师填写'"
        center
        value="点击查看"
        @click="ondet(i)"
      >
        <template #title>
          <span>{{ appTimeout(i.record_date, "ymd") }}</span>
          <van-tag v-if="+i.state === 1">未读</van-tag>
        </template>
      </van-cell>
    </v-page>
    <template #fixed>
      <v-fixed v-model="open" text="在园记录">
        <v-d v-model="ext"></v-d>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vD from "./det.vue";
export default {
  data() {
    return {
      item: [],
      open: false,
      ext: {},
      show: false,
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.ext = {};
      }
    },
  },
  components: { vD },
  inject: ["appTimeout", "appGetParams"],
  methods: {
    ondet(e) {
      let obj = {
        record_date: this.appTimeout(e.record_date, "ymd"),
      };
      this.$api.http("a2023030802", obj, (r) => {
        this.ext = r;
        this.open = true;
      });
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("a2023030801", { page }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.open = false;
    let tps = this.appGetParams("tps");
    this.show = tps === "";
    if (!this.show) {
      this.ondet({
        record_date: this.$demo.timeout(
          this.appGetParams("timeout") || "",
          "zero"
        ),
      });
    }
  },
};
</script>
<style lang='less' scoped>
</style>
