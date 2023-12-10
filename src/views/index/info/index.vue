<template>
  <div class="index_info">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <x-content>
        <v-list :item="item"></v-list>
      </x-content>
    </v-tool-page>
  </div>
</template>

<script>
import vList from "../../private/list.vue";
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
      showBtn: false,
    };
  },
  components: { vList },
  inject: ["appPath"],
  methods: {
    onPage(e) {
      this.init(e);
    },
    init(page) {
      this.$api.http("info", { type: 2, limit: 20, page }, (r) => {
        this.pageOpen++;
        if (page === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
  },
  mounted() {
    this.init(1);
  },
};
</script>
<style lang='less' scoped>
</style>
