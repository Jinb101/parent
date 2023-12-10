<template>
  <div class="user_pay">
    <v-tool-title>
      <span v-if="pays" @click="pays = false">
        <van-icon size="20" name="cross" />
      </span>
    </v-tool-title>
    <van-tabs v-model="type" :color="theme.bgc" :title-active-color="theme.bgc">
      <van-tab
        :title="i.t"
        v-for="(i, j) in tab"
        :key="j + '-s'"
        :name="i.n"
      ></van-tab>
    </van-tabs>
    <div class="view">
      <van-empty description="暂无缴费项" v-if="!item.length" />
      <section
        v-for="(i, j) in item"
        :key="j + '-s'"
        class="flex van-hairline--bottom"
        @click="onDetail(i)"
      >
        {{ i.name || i.item_name }}
        <span class="money" :class="{ c: +type === 1 }">
          {{ i.amount || i.charge_amount }}
        </span>
        <van-icon name="arrow" color="#999" v-if="+type !== 1" />
        <van-icon name="success" v-else color="#99cc33" />
      </section>
    </div>
    <transition name="fade">
      <div class="app_show_fixed" v-if="pays">
        <!-- <van-tabs
          v-model="tp"
          :color="theme.bgc"
          :title-active-color="theme.bgc"
          @click="onGetPay"
        >
          <van-tab title="微信" name="1"></van-tab>
          <van-tab title="支付宝" name="0"></van-tab>
        </van-tabs> -->
        <p class="desc">缴费后请等待园所确认，确认后该缴费项自动完成</p>
        <div class="ava">
          <van-image :src="code" @click="appShowImage(code)"></van-image>
        </div>
        <p class="text">请长按识别二维码缴费</p>
        <div class="texts">
          <p>{{ det.nursery_name }}</p>
          <p>班级：{{ det.class_name }}</p>
          <p>宝宝名字：{{ det.child_name }}</p>
          <p>费用项：{{ det.item_name }}</p>
          <p>
            付款金额：<b class="col_danger"
              >{{ det.amount || det.charge_amount }}元</b
            >
          </p>
        </div>
        <div class="w80">
          <van-button block :color="theme.bgc" round @click="onCheckPay"
            >我已付款</van-button
          >
        </div>
      </div>
    </transition>
    <transition name="van-slide-left">
      <div
        class="app_show_fixed top"
        style="z-index: 570"
        v-if="vor.voucher_id"
      >
        <v-tool-title text="凭证" back @on-back="vor = {}"></v-tool-title>
        <iframe :src="framesrc + '?h5=' + vorDetail" frameborder="0"></iframe>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: [
        { t: "待缴费", v: "payWaitList", n: "0" },
        { t: "缴费记录", v: "payListRecord", n: "1" },
        { t: "新生缴费", v: "", n: "2" },
      ],
      theme: {},
      type: "",
      item: [],
      pageOpen: 0,
      pageEnd: false,
      pays: false,
      ext: {},
      tp: "1",
      code: "",
      det: {},
      vor: {},
      vorDetail: "",
    };
  },
  watch: {
    type() {
      this.item = [];
      this.onPage();
    },
    "vor.voucher_id"(n) {
      if (!n) {
        this.$router.replace("/pay");
        this.vorDetail = "";
      }
    },
  },
  computed: {
    framesrc() {
      return this.$js.api.h5 + "h5/receipt/";
    },
  },
  inject: ["appGetTheme", "appPath", "appShowImage"],
  methods: {
    onCheckPay() {
      this.$model.model("请确认您已经付款", "", (res) => {
        if (res) {
          // let i_id = this.ext.i_id;
          this.ext = {};
          this.pays = false;

          // this.$api.http("payDetail", { i_id }, (r) => {
          //   console.log(r);
          // });
          this.onPage();
        }
      });
    },
    // onGetPay() {
    //   this.code = "";
    //   this.onDetail(this.ext);
    // },
    onDetail(e) {
      this.ext = e;
      if (+this.type === 1) {
        this.$api.http("payVor", { charge_id: e.id }, (res) => {
          this.vor = res;
          // 加密字符串
          let os = {
            // res,
            type: "web",
            data: res,
            url: this.framesrc, // 生成地址
          };
          let key = this.$demo.$random.vars();
          let cc = this.$demo.es6().md5(key, JSON.stringify(os), 0);
          let data = [encodeURIComponent(cc), key].join("_____");
          this.$router.replace("/pay/" + data);
          this.vorDetail = data;
        });
      }
      if (+this.type !== 0) return 0;
      this.$api.http(
        "payPlaceOrder",
        { i_id: e.id, pay_type: this.tp },
        (r, code, edata) => {
          if (code === 444) {
            return this.$model.model(edata.msg, () => {});
          }
          this.pays = true;
          this.code = r.qr_code;
          this.det = r;
        },
        "post",
        false,
        [200, 444]
      );
    },
    onPage() {
      if (this.type === "2") {
        this.appPath("/pay_new");
        return 0;
      }
      let api = this.tab[+this.type].v;
      this.$api.http(api, {}, (r) => {
        this.item = r;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.type = this.tab[0].n;
  },
};
</script>
<style lang='less' scoped>
.user_pay {
  .view {
    height: calc(100% - 90px);
  }
  .texts {
    border-top: 1px solid #ccc;
    padding: 10px 20px;
    font-size: 14px;
    margin: 20px auto 0;
    p {
      padding: 5px 0;
      color: #666;
      &:first-child {
        font-weight: 650;
      }
      b {
        font-size: 18px;
      }
    }
  }
  .ava {
    width: 200px;
    height: 200px;
    margin: 10px auto;
  }
  .text {
    text-align: center;
    padding: 8px;
    font-size: 16px;
  }
  section {
    padding: 15px;
    font-size: 15px;
    .money {
      flex: 1;
      text-align: right;
      color: tomato;
      &.c {
        color: #99cc33;
      }
    }
  }
}
iframe {
  display: block;
  width: 100%;
  height: calc(100% - 46px);
}
.desc {
  font-size: 14px;
  color: #999;
  text-align: center;
  padding: 16px 5% 0;
  color: tomato;
  line-height: 1.5;
}
</style>
