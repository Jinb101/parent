<template>
  <div class="user_drugs">
    <v-tool-title>
      <span class="col_green" @click="appPath('/drugs_add')">添加喂药</span>
    </v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无喂药信息" v-if="!item.length" />
      <section
        v-for="(i, j) in item"
        :key="j + '-s'"
        class="flex van-hairline--bottom"
        @click="appPath('/drugs_detail/' + i.id)"
      >
        <p>{{ i.date }}</p>
        <span v-if="+i.status === 0" class="col_green">已完成</span>
        <span v-else class="col_danger">未完成</span>
        <van-icon
          name="arrow"
          :class="+i.status === 0 ? 'col_green' : 'col_danger'"
        />
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
  inject: ["appPath"],
  methods: {
    onPage(e) {
      this.$api.http("drugsList", { page: e, limit: 20 }, (r) => {
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
.user_drugs {
  section {
    padding: 15px;
    font-size: 15px;
    p {
      flex: 1;
    }
  }
}
</style>
