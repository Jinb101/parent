<template>
  <v-view header bgc="#f8f8f8">
    <div class="app_top">
      <van-tabs v-model="type">
        <van-tab title="待支付" name="1"></van-tab>
        <van-tab title="赠送订单" name="0"></van-tab>
      </van-tabs>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section
        v-for="(i, j) in item"
        :key="j"
        class="sec"
        @click.stop="ondetail(i)"
      >
        <div class="head flex">
          <div class="no">订单号：{{ i.order_sn }}</div>
          <div class="status">{{ toStatus(i.status) }}</div>
        </div>
        <div class="mains flex van-hairline--top-bottom">
          <div class="logo" @click.stop="appShowImage(i.cover)">
            <van-image :src="i.cover" fit="cover"></van-image>
          </div>
          <div class="text">
            {{ i.title }}
          </div>
        </div>
        <div class="tool flex" v-if="+i.status === 1" @click.stop>
          <span
            >支付：<b class="col_danger">{{ i.price || 0 }}元</b></span
          >
          <div class="btn">
            <van-button
              size="small"
              type="danger"
              plain
              @click.stop="onsubmitpay(i)"
              >立即支付</van-button
            >
            <van-button
              size="small"
              type="default"
              plain
              @click.stop="oncancelpay(i)"
              >取消订单</van-button
            >
          </div>
        </div>
      </section>
    </v-page>
    <template #fixed>
      <v-fixed v-model="open" text="订单详情" cover :coverBgcs="bgc">
        <div class="detail_page">
          <div class="title flex">
            <span>{{ toStatus(detail.status) }}</span>
          </div>
          <x-content>
            <div class="box">
              <van-notice-bar
                color="#1989fa"
                background="#fff"
                left-icon="volume-o"
              >
                订单已经顺利生成了
              </van-notice-bar>
              <!-- 如果需要发快递 显示快递地址 -->
              <div
                class="address van-hairline--top"
                v-if="+detail.is_shipment === 1"
              >
                <p class="name flex">
                  <span>{{ detail.consignee }}</span>
                  <b>{{ detail.mobile }}</b>
                </p>
                <div class="url flex">
                  <van-icon name="location" />
                  <p>{{ toCity(detail) }}</p>
                </div>
              </div>
            </div>
          </x-content>
          <x-content>
            <div class="box">
              <van-field
                v-model="detail.order_sn"
                label="订单编号"
                readonly
                label-width="5em"
              />
              <van-field
                :value="appTimeout(detail.create_time)"
                label="下单时间"
                readonly
                label-width="5em"
              />
              <!-- <van-field v-model="detail.order_sn" label="订单备注" readonly label-width="5em" /> -->
              <van-field
                value="微信支付"
                label="支付方式"
                readonly
                label-width="5em"
              />
              <template v-if="+detail.is_shipment === 1">
                <van-field
                  value="快递配送"
                  label="配送方式"
                  readonly
                  label-width="5em"
                  v-if="!detail.express_name"
                />
                <template v-else>
                  <van-field
                    v-model="detail.express_name"
                    label="配送方式"
                    readonly
                    label-width="5em"
                  />
                  <van-cell
                    :title="detail.courier_number"
                    value="点击复制快递单号"
                    is-link
                  ></van-cell>
                </template>
              </template>
            </div>
          </x-content>
          <x-content>
            <div class="box flex">
              <div class="logo">
                <van-image :src="dets.cover_picture"></van-image>
              </div>
              <div class="text">
                <p>{{ dets.title }}</p>
                <p class="col_danger">￥{{ dets.price }}</p>
              </div>
            </div>
          </x-content>
          <x-content>
            <div class="box">
              <van-cell title="商品总额" :value="dets.price + '元'"></van-cell>
              <p class="pay">
                实付款：<b class="col_danger">{{ dets.price }}</b>
              </p>
            </div>
          </x-content>
          <div class="bottom_btn">
            <van-button
              size="small"
              type="default"
              plain
              @click="oncancelpay(detail)"
              >取消订单</van-button
            >
            <van-button
              size="small"
              type="danger"
              plain
              @click="onsubmitpay(detail)"
              >立即支付</van-button
            >
          </div>
        </div>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      type: "1",
      item: [],
      open: false,
      detail: {},
      bgc: {
        background: "linear-gradient(45deg, orange, tomato)",
        "border-radius": "0 0 1.1rem 1.1rem",
      },
      id: "",
    };
  },
  watch: {
    type() {
      this.onPage(1);
    },
    open(n) {
      if (!n) {
        this.$router.replace("/educationorder").catch(() => {});
      }
    },
  },
  computed: {
    dets() {
      return this.detail.home_education_curriculum || {};
    },
  },
  inject: ["appShowImage", "appTimeout"],
  methods: {
    toCity(i) {
      let a = [i.province_name, i.city_name, i.county_name, i.address];
      // eslint-disable-next-line
      return demo.array(a).unique().join("");
    },
    ondetail(e) {
      this.open = true;
      this.$router.replace("/educationorder/" + e.order_id).catch(() => {});
      this.$api.http("eduorderdet", { order_id: e.order_id }, (r) => {
        this.detail = r;
        this.id = e.order_id;
      });
    },
    onsubmitpay(e = {}) {
      let os = {
        no: e.order_sn,
        id: e.order_id,
        price: e.price,
        title: e.title,
        checkcode: true,
        pay: true,
        nid: this.$demo.$local.get("nid"),
        token: this.$demo.$local.get("token"),
      };
      if (e.home_education_curriculum) {
        os.price = e.home_education_curriculum.price;
        os.title = e.home_education_curriculum.title;
      }
      let user = this.$demo.$session.get("user", {});
      if (user.openid) {
        os.openid = user.openid;
      }
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = this.$js.api.h5 + "h5/poster/?type=order_pay&h5=" + a;
      if (!this.$demo.es6().isWx()) {
        console.log(url);
        return 0;
      }
      window.location.href = url;
    },
    oncancelpay(e) {
      this.$model.model("是否取消订单？", "取消订单", (r) => {
        if (r) {
          this.$api.http("educancel", { order_id: e.order_id }, () => {
            this.$toast("取消成功");
            this.item = this.item.filter((r) => {
              return r.order_id !== e.order_id;
            });
            this.open = false;
            this.detail = {};
          });
        }
      });
    },
    toStatus(e) {
      return ["赠送订单", "待支付", "已支付", "待收货", "已完成", "已取消"][e];
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "eduorderlist",
        { status: this.type, page, limit: 20 },
        (e) => {
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.ondetail({ order_id: this.id });
    }
  },
};
</script>
<style lang='less' scoped>
.box {
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  .logo {
    width: 85px;
    height: 85px;
  }
  .text {
    width: calc(100% - 85px);
    box-sizing: border-box;
    padding-left: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    p {
      font-weight: 650;
      line-height: 20px;
    }
    p:last-child {
      margin-top: 10px;
      font-weight: 400;
    }
  }
  .pay {
    text-align: right;
    padding: 10px;
    padding-right: 20px;
  }
}
.sec {
  font-size: 16px;
  box-sizing: border-box;
  background-color: #fff;
  margin: 10px;
  .head {
    padding: 10px;
    font-size: 14px;
    color: #999;
    .no {
      flex: 1;
    }
    .status {
      padding: 0 5px;
    }
  }
  .mains {
    padding: 15px 10px;
    .logo {
      width: 80px;
      height: 80px;
    }
    .text {
      box-sizing: border-box;
      padding: 10px;
      width: calc(100% - 80px);
    }
  }
  .tool {
    font-size: 15px;
    padding: 8px;
    align-items: center;
    b {
      font-weight: 650;
      padding: 0 3px;
    }
    .btn {
      flex: 1;
      flex-direction: row-reverse;
      display: flex;
      .van-button {
        margin-left: 10px;
      }
    }
  }
}
.bottom_btn {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  .van-button {
    margin-right: 8px;
  }
}
.detail_page {
  font-size: 15px;
  .title {
    padding: 20px 10px;
  }
  .address {
    padding: 10px;
    line-height: 20px;
    .name {
      margin-bottom: 10px;
      font-weight: 650;
      font-size: 17px;
      b {
        margin-left: 10px;
      }
    }
    .name,
    .url {
      align-items: center;
    }
    .van-icon {
      color: orange;
      font-size: 20px;
    }
  }
}
</style>
