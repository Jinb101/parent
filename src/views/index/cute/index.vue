<template>
  <div class="index_cute">
    <!-- 头部 -->
    <v-tool-title></v-tool-title>
    <!-- list -->
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <x-content>
        <v-video :item="item" @on-detail="onVideoDetail" goods></v-video>
      </x-content>
    </v-tool-page>
  </div>
</template>

<script>
import vVideo from "../../private/video.vue";
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
    };
  },
  components: { vVideo },
  inject: ["appPath"],
  methods: {
    onPage(e) {
      this.$api.http("cute", { page: e, limit: 20 }, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
    onVideoDetail(e) {
      this.appPath("/cute_detail/" + e.id);
    },
  },
  mounted() {
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.send_btn {
  position: fixed;
  right: 0;
  z-index: 3;
  width: 87px;
  height: 87px;
  bottom: 35px;
}
</style>
