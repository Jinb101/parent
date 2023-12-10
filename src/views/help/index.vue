<template>
  <div class="help">
    <v-tool-title></v-tool-title
    ><van-search
      v-model="search"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <div class="view">
      <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
        <van-empty description="暂无帮助" v-if="!item.length" />
        <van-cell
          :title="i.problem"
          is-link
          v-for="(i, j) in item"
          :key="j"
          @click="onDetail(i)"
        ></van-cell>
      </v-tool-page>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { search: "", item: [], pageOpen: 0, pageEnd: false };
  },
  inject: ["appPath"],
  methods: {
    onPage(e) {
      this.$api.http(
        "help",
        { page: e, limit: 20, problem: this.search },
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
    onSearch() {
      this.onPage(1);
    },
    onDetail(e) {
      this.appPath("/helps/" + e.problem_id);
    },
  },
  mounted() {
    this.onPage(1);
    // {type:'image',text:'帮助1图文',url:''},{type:'video',text:'帮助2视频',url:''}
  },
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
