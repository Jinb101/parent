<template>
  <div class="recom_shop">
    <v-tool-title></v-tool-title>
    <van-tabs v-model="type" :color="theme.bgc" :title-active-color="theme.bgc">
      <van-tab
        v-for="(i, j) in tab"
        :key="j + '-s'"
        :title="i.name"
        :name="i.id"
      ></van-tab>
    </van-tabs>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage" class="view">
      <van-empty description="暂无兑换商品" v-if="!item.length" />
      <div class="flex fw">
        <section
          v-for="(i, j) in item"
          :key="j + '-s'"
          @click="appPath('/recommend_shop_detail/' + i.goods_id)"
        >
          <div class="ava">
            <van-image :src="i.pictures" fit="cover"></van-image>
          </div>
          <p class="name van-multi-ellipsis--l2">{{ i.goods_name }}</p>
          <p class="col_green van-ellipsis">{{ i.price }}积分</p>
        </section>
      </div>
    </v-tool-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: [],
      type: "",
      theme: {},
      item: [],
      pageOpen: 0,
      pageEnd: false,
    };
  },
  watch: {
    type() {
      this.onPage(1);
    },
  },
  inject: ["appGetTheme", "appPath"],
  methods: {
    onPage(e) {
      this.$api.http(
        "recommendShopList",
        { page: e, limit: 20, c_id: this.type },
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
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.$api.http("recommendShopTab", {}, (e) => {
      this.tab = e;
      this.type = this.tab[0].id;
    });
  },
};
</script>
<style lang='less' scoped>
.recom_shop {
  background-color: #fdfdfd;
  .view {
    height: calc(100% - 90px);
    section {
      width: 50%;
      padding: 15px;
      box-sizing: border-box;
      font-size: 15px;
      height: 245px;
      overflow: hidden;
      background-color: #fff;
      border-radius: 5px;
      p {
        line-height: 1.3;
      }
      .ava {
        height: 165px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
