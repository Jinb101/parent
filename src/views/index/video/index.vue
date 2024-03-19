<template>
  <div class="baby_video">
    <v-tool-title></v-tool-title>
    <van-tabs
      v-model="type"
      :color="theme.bgc"
      :title-active-color="theme.bgc"
      @click="onPage(1)"
    >
      <van-tab title="已开放" name="1"></van-tab>
      <van-tab title="未开放" name="2"></van-tab>
    </van-tabs>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage" class="view">
      <van-empty description="暂无" v-if="!item.length" />
      <section
        v-for="(i, j) in item"
        :key="j + 's'"
        class="van-hairline--bottom"
        @click="onDetail(i.baby_id)"
      >
        <h5>{{ i.video_name }}</h5>
        <p>
          开放时间：{{ i.morning_start }}~{{ i.morning_end }}
          {{ i.afternoon_start }}~{{ i.afternoon_end }}
        </p>
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
      type: "",
      theme: {},
    };
  },
  watch: {
    type() {
      this.onPage(1);
    },
  },
  inject: ["appGetTheme", "appPath"],
  methods: {
    onDetail(baby_id) {
      if (!this.ispay) {
        return this.pays();
      }
      this.$api.http("babyVideoCheck", { baby_id }, (e) => {
        if (e.is_on === 1) {
          return this.$model.info("该宝贝在线已被关闭", 2);
        }
        this.appPath("/baby_video_detail/" + baby_id);
      });
    },
    onPage(e) {
      this.$api.http(
        "babyVideo",
        { page: e, limit: 20, type: this.type },
        (r) => {
          this.ispay = r.bind_is_expire === 0;
          if (!this.ispay) {
            this.pays();
          }
          this.pageOpen++;
          if (e === 1) {
            this.item = r.data;
            return 0;
          }
          this.item = this.item.concat(r.data);
          this.pageEnd = r.data.length !== 20;
        }
      );
    },
    pays() {
      this.$model.model(
        "你的可观看时间已到期，请点击确定去续费！",
        "无法查看宝贝在线",
        (res) => {
          if (res) {
            this.appPath("/pay_renew");
          }
        }
      );
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.type = "1";
  },
};
</script>
<style lang='less' scoped>
.baby_video {
  .view {
    height: calc(100% - 90px);
    section {
      padding: 15px;
      font-size: 12px;
      color: #999;
      h5 {
        color: #444;
        font-size: 15px;
        font-weight: 650;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
