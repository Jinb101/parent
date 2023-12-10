<template>
  <div class="garden">
    <v-tool-title></v-tool-title>
    <van-tabs
      v-model="active"
      :title-active-color="$theme.color[0]"
      :color="$theme.color[0]"
    >
      <van-tab
        :name="i.s"
        :title="i.t"
        v-for="(i, j) in nav"
        :key="j"
      ></van-tab>
    </van-tabs>
    <div class="view">
      <transition name="moveleft">
        <v-d v-if="+active === 1"></v-d>
      </transition>
      <transition name="moveleft">
        <v-h v-if="+active === 2"></v-h>
      </transition>
      <transition name="moveleft">
        <v-v v-if="+active === 3" :url="qrurl"></v-v>
      </transition>
      <transition name="moveleft">
        <v-t v-if="+active === 4"></v-t>
      </transition>
    </div>
    <!-- <van-field
      :label="i.t"
      :left-icon="i.i"
      right-icon="arrow"
      readonly
      v-for="(i, j) in nav"
      :key="j"
      @click="appPath(i.p)"
    /> -->
  </div>
</template>
<script>
import vD from "./detail.vue";
import vH from "./honor.vue";
import vV from "./vr.vue";
import vT from "./teach.vue";
export default {
  data() {
    return {
      nav: [
        { t: "园所简介", p: "/garden_detail", i: "smile-comment-o", s: 1 },
        { t: "教师风采", p: "/teach", i: "", s: 4 },
        { t: "园所荣誉", p: "/garden_honor", i: "medal-o", s: 2 },
        { t: "VR校园", p: "/garden_vr", i: "eye-o", s: 3 },
      ],
      active: "",
      qrurl: "",
    };
  },
  watch: {
    active(n) {
      this.appPath("/garden/" + n, true);
    },
  },
  inject: ["appPath", "appGetConfig"],
  components: { vD, vH, vV, vT },
  methods: {
    init() {
      this.$api.http("config", {}, (r) => {
        this.setqrs(r);
      });
    },
    setqrs(a) {
      this.qrurl = a.vr_campus || "";
      if (!a.vr_campus) {
        this.nav = this.nav.filter((r) => {
          return r.s !== 3;
        });
      }
    },
  },
  mounted() {
    let id = this.$route.params.id;
    if (id > 0) {
      this.active = +id;
    }
    // 检测是否有vr
    let a = this.appGetConfig();
    if (a.id > 0) {
      this.setqrs(a);
    } else {
      setTimeout(() => {
        this.init();
      }, 500);
    }
  },
};
</script>
<style lang='less' scoped>
.view {
  height: calc(100% - 90px);
  background-color: rgb(255, 255, 255);
  overflow-y: scroll;
}
</style>
