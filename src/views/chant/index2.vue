<template>
  <v-view ref="views" index="500">
    <template v-if="!show">
      <van-empty description="未开通本学期内容">
        <van-button size="small" type="info" to="/chant" round class="r_btn"
          >返回</van-button
        >
      </van-empty>
    </template>
    <template v-else-if="id">
      <v-p v-model="ext">
        <div class="tolink">
          <van-button block round type="primary" @click="ondets"
            >查看详情</van-button
          >
        </div>
      </v-p>
    </template>
    <van-empty description="错误" v-else></van-empty>
  </v-view>
</template>

<script>
import vP from "./player_song.vue";
import vD from "./detail.vue";
export default {
  data() {
    return {
      id: "",
      ext: "",
      show: false,
      pid: "",
      cid: "",
    };
  },
  inject: ["appPath"],
  components: { vP, vD },
  methods: {
    ondets() {
      this.appPath("/chant/0&0&0&" + this.pid);
    },
    init() {
      this.$api.http("a2023042603", { country_study_id: this.id }, (r) => {
        if (r.status === 0) {
          this.$toast("功能未开通");
          return 0;
        }
        this.pid = r.class_schedule_country_id;
        this.cid = r.classify_id;
        let obj = r.country_study || {};
        let os = [
          { src: obj.audio, pic: obj.parent_cover_picture },
          {
            src: obj.parent_video,
            pic: obj.parent_cover_picture,
            type: "mp4",
          },
          { src: obj.read_aloud, pic: obj.read_aloud_cover },
        ].map((s) => {
          s.content = obj.content;
          return s;
        });
        this.show = true;
        this.ext = os[0];
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.$nextTick(() => {
      this.init();
    });
  },
};
</script>
<style lang='less' scoped>
.tolink {
  position: fixed;
  z-index: 66;
  padding: 20px 15%;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  width: 100%;
}
.r_btn {
  width: 100px;
}
</style>
