<template>
  <div class="new_index_history">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <x-content v-for="(i, j) in item" :key="j" class="c van-hairline--bottom">
        <div @click="onDetail(i)">
          <h5>{{ i.recipe_name }}</h5>
          <p>
            类型：{{ ["", "标准", "优选", "精致", "自定义"][+i.recipe_type] }}
          </p>
          <p>
            周期：{{ time(i.recipe_start_time) }} ~~
            {{ time(i.recipe_end_time) }}
          </p>
          <p>评语：{{ i.comment }}</p>
          <p>添加人：{{ i.staff.name }}</p>
        </div>
      </x-content>
    </v-tool-page>
    <transition name="van-slide-right">
      <div class="app_show_fixed top" style="z-index: 570" v-if="show">
        <v-tool-title text="详情" back @on-back="show = false"></v-tool-title>
        <div class="views">
          <v-d :fid="id"></v-d>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import vD from "./_detail.vue";
export default {
  data() {
    return { item: [], pageOpen: 0, pageEnd: false, show: false, id: "" };
  },
  components: { vD },
  methods: {
    time(v) {
      return this.$demo.timeout(v, "ymd");
    },
    onDetail(e) {
      this.id = e.recipes_id;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onPage(e) {
      this.$api.http("foodNewHistory", { page: e, limit: 20 }, (r) => {
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
.views {
  height: calc(100% - 46px);
  overflow-y: scroll;
}
.c {
  font-size: 15px;
  h5 {
    font-weight: 650;
    padding: 10px 0;
  }
  p {
    line-height: 1.2;
    padding: 5px 0;
  }
}
</style>
