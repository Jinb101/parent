<template>
  <div class="recom_shop_detail">
    <v-tool-title></v-tool-title>
    <div class="line">
      <h5>商品信息</h5>
      <div class="result">
        <div class="thumb">
          <van-image :src="item.pic" fit="cover"></van-image>
        </div>
        <section class="text">
          <p class="title van-multi-ellipsis--l2">{{ item.name }}</p>
          <span class="tag" v-if="item.specs"
            >{{ item.specs }} x{{ item.q }}</span
          >
          <div class="total">{{ item.price * 1 }}积分</div>
        </section>
      </div>
      <div class="foot">
        <b class="count">共{{ item.q }}件商品</b>
        <b class="grade">{{ item.maxPrice * 1 }}积分</b>
      </div>
    </div>
    <div class="line">
      <h5>兑换信息</h5>
      <div class="result">
        <ul>
          <li>
            兑换编号：<span>{{ item.no }}</span>
          </li>
          <li>
            兑换时间：<span>{{ item.time ? appTimeout(item.time) : "" }}</span>
          </li>
          <li>
            兑换总积分：<span>{{ item.maxPrice * 1 }}积分</span>
          </li>
        </ul>
      </div>
      <div class="btn">
        <van-button color="#F0F0F0" round @click.stop="del"
          >删除订单</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { id: null, item: { price: 0, maxPrice: 0 } };
  },
  inject: ["appTimeout", "appBack"],
  methods: {
    getDetail() {
      this.$api.http("recommendShopEx", { id: this.id }, (e) => {
        this.item = {
          time: e.create_time,
          name: e.goods_name,
          id: e.id,
          no: e.number,
          pic: e.pictures,
          price: e.price || 0,
          q: e.quantity,
          specs: e.specs,
          maxPrice: e.total_integral || 0,
        };
      });
    },
    del() {
      this.$model.model("是否删除订单", "删除订单", (f) => {
        if (f) {
          this.$api.http("recommendShopExDel", { id: this.id }, (e) => {
            this.$model.info("删除成功", 2);
            this.appBack(true);
          });
        }
      });
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getDetail();
  },
};
</script>
<style lang='less' scoped>
.recom_shop_detail {
  background-color: #f8f8f8;
  .line {
    margin-bottom: 8px;
    background-color: #fff;
    box-sizing: border-box;
    h5 {
      position: relative;
      height: 50px;
      font-size: 14px;
      color: #666;
      line-height: 50px;
      text-indent: 25px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      &::before {
        position: absolute;
        content: "";
        width: 3px;
        height: 15px;
        background-color: #99cc33;
        left: 12px;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
    .result {
      box-sizing: border-box;
      padding: 15px;
      padding-bottom: 0;
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
      padding: 0 15px;
      line-height: 50px;
      box-sizing: border-box;
      .count {
        float: left;
      }
      .grade {
        float: right;
      }
    }
    ul {
      li {
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;
        span {
          font-size: 15px;
          color: #222;
        }
      }
    }
    .btn {
      text-align: right;
      padding-right: 15px;
      box-sizing: border-box;
    }
    .van-button {
      margin-top: 5px;
      width: 82px;
      height: 30px;
      font-size: 13px;
      color: #999999 !important;
      padding: 0;
      margin-bottom: 15px;
    }
  }
}
</style>
