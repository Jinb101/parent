<template>
  <div class="recom_detail">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无兑换记录" v-if="!item.length" />
      <section
        v-for="(i, j) in item"
        :key="j + '-s'"
        @click="appPath('/recommend_shop_details/' + i.id)"
      >
        <div class="head">
          <b class="num">兑换编号：{{ i.number }}</b>
          <span class="time">{{
            i.create_time ? appTimeout(i.create_time, "ymd") : ""
          }}</span>
        </div>
        <div class="main">
          <div class="thumb">
            <van-image :src="i.pictures"></van-image>
          </div>
          <section class="text">
            <p class="title van-multi-ellipsis--l2">{{ i.goods_name }}</p>
            <span class="tag" v-if="i.specs"
              >{{ i.specs }} x {{ i.quantity }}</span
            >
            <div class="total">{{ i.price * 1 }}积分</div>
          </section>
        </div>
        <div class="foot">
          <b class="count">共{{ i.quantity }}件商品</b>
          <b class="grade">{{ i.total_integral * 1 }}积分</b>
        </div>
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
  inject: ["appTimeout", "appPath"],
  methods: {
    onPage(e) {
      this.$api.http("recommendExList", { page: e, limit: 20 }, (r) => {
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
.recom_detail {
  background-color: #f7f7f7;
  section {
    background-color: #fff;
    margin-bottom: 8px;
    box-sizing: border-box;
    padding: 15px;
    .head {
      padding-bottom: 15px;
      border-bottom: 1px solid #ebebeb;
      font-size: 16px;
      color: #333;
      display: flex;
      .num {
        flex: 1;
        font-weight: 700;
      }
      .time {
        font-size: 12px;
        color: #999;
      }
    }
    .main {
      padding: 15px 0;
      display: flex;
      .thumb {
        width: 90px;
        height: 90px;
        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
      }
      .text {
        box-sizing: border-box;
        padding-left: 10px;
        padding-top: 5px;
        width: calc(~"100% - 90px");
        .title {
          color: #222;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .tag {
          color: #666;
          font-size: 13px;
          margin-bottom: 15px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .total {
          text-align: right;
          font-size: 13px;
          color: #fe573e;
        }
      }
    }
    .foot {
      height: 50px;
      color: #333;
      font-size: 14px;
      .count {
        float: left;
      }
      .grade {
        float: right;
      }
    }
  }
}
</style>
