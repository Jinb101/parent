<template>
  <v-view @on-view="onview" bar footbar>
    <div class="app_top">
      <van-tabs
        v-model="type"
        :color="theme.bgc"
        :title-active-color="theme.bgc"
      >
        <van-tab
          :title="i.t"
          :name="i.n"
          v-for="(i, j) in tab"
          :key="j + '-tab-s'"
        ></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length" description="暂无"> </van-empty>
      <section
        v-for="(i, j) in item"
        :key="j + '-s'"
        class="van-hairline--bottom"
        @click="onDetail(i)"
      >
        <h5>{{ i.name || i.courses }}</h5>
        <div class="ava">
          <div class="ico">
            <van-icon name="play" />
          </div>
          <van-image :src="i.cover" fit="cover"></van-image>
        </div>
        <div class="tool flex">
          <span class="count" v-if="i.pageview">{{ i.pageview }}浏览</span>
          <span class="time">
            {{ appTimeout(i.add_time || i.create_time, "ymd") }}
          </span>
        </div>
      </section>
    </v-page>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      theme: {},
      type: "",
      tab: [
        { t: "家长课堂", v: "storeParent", n: "0" },
        { t: "老师讲故事", v: "storeTeach", n: "1" },
        { t: "故事汇", v: "storeList", n: "2" },
      ],
      item: [],
    };
  },
  watch: {
    type() {
      this.onPage(1);
    },
  },
  inject: ["appGetTheme", "appTimeout", "appPath", "appGetBabyInfo"],
  methods: {
    onview(e) {},
    onDetail(i) {
      let fs = this.type === "0";
      let path =
        "/" +
        (fs ? "listen_watch" : "listen_detail") +
        "/" +
        i.id +
        (fs ? "" : "&" + this.type);
      this.appPath(path);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let api = this.tab[+this.type].v;
      this.$api.http(api, { page, limit: 20 }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.appGetBabyInfo(() => {
      this.type = this.tab[0].n;
    });
  },
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  margin-bottom: 2px;
  padding: 15px;
  font-size: 15px;
  h5 {
    font-weight: 650;
    padding: 5px 0;
  }
  .ava {
    height: 200px;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    .ico {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      font-size: 35px;
      text-align: center;
      z-index: 55;
      width: 40px;
      height: 40px;
      transform: scale(1.4);
      color: #f9f9f9;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      opacity: 0.8;
      box-shadow: 0 0 10px rgba(153, 153, 153, 0.3);
      .van-icon {
        line-height: 40px;
      }
    }
  }
  .tool {
    font-size: 12px;
    padding: 5px 0;
    color: #999;
    .time {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
