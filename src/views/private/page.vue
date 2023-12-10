<template>
  <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
    <van-empty :description="'暂无' + title" v-if="!item.length" />
    <section v-for="(i, j) in item" :key="j + '-s'" :class="cls">
      <slot :item="i" :index="j" name="list" />
    </section>
  </v-tool-page>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    bottom: { type: Boolean, default: false },
    api: { type: String, default: "" },
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
    limit: { type: [Number, String], default: 20 },
  },
  computed: {
    cls() {
      return this.bottom ? "van-hairline--bottom" : "";
    },
  },
  data() {
    return {
      pageOpen: 0,
      pageEnd: false,
      item: [],
    };
  },
  methods: {
    onPage(e) {
      let os = this.$demo.copy(
        Object.assign({ page: e, limit: this.limit }, this.ext)
      );
      this.$api.http(this.api, os, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== this.limit;
      });
    },
  },
  mounted() {
    if (this.api) {
      this.onPage(1);
    }
  },
};
</script>
<style lang='less' scoped>
</style>
