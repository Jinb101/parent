<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model="loading"
      :finished="finished"
      :finished-text="ft"
      @load="onLoad"
    >
      <slot />
    </van-list>
  </van-pull-refresh>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      page: 0,
      ft: "没有更多了",
    };
  },
  methods: {
    onFinish(finish = false, page) {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.loading = false;
      if (finish) {
        this.finished = true;
        if (page) {
          this.ft = page === 1 ? "" : "没有更多了";
        }
      }
    },
    onLoad() {
      this.page++;
      this.$emit("on-page", this.page, true);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      this.page = 0;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
p {
  padding: 20px 0;
}
</style>
