<template>
  <v-view header text="课程详情" ref="view">
    <div class="app_top" v-if="det.video">
      <div class="player">
        <v-v
          :item="{ url: det.video, cover: det.cover_picture }"
          @create="onvideoinit"
          @times="onvideotime"
          ref="video"
        ></v-v>
      </div>
    </div>
    <div class="head van-hairline--bottom">
      <div class="flex">
        <div class="title">{{ det.title }}</div>
        <div class="share" @click="onsharebtn">
          <van-icon name="share-o" />
          <b>送人</b>
        </div>
      </div>
      <p class="desc"></p>
      <div class="price flex">
        <template v-if="+det.viewing_type === 1"> </template>
        <template v-else-if="ispriceshow">
          <!-- <span class="p" :class="{ col_green: +prices.price <= 0 }">{{
            prices.price
          }}</span>
          <span class="o">{{ prices.original_price }}</span> -->
        </template>
        <template v-else-if="isshareshow > 0">
          <span class="s"
            >需转发成功<b>{{ isshareshow }}</b
            >人解锁完整视频</span
          >
        </template>
        <template v-else-if="islock">
          <span class="k col_green">已解锁</span>
        </template>
      </div>
    </div>
    <van-empty v-if="!contents" description="暂无详情"></van-empty>
    <div v-if="!isShow" class="app_frame_content auto" v-html="contents"  ></div>
    <div class="bottom" v-if="ispriceshow || fast">
      <van-button block type="danger" round @click="onsubmit"
        >购买（￥{{ prices.price }}）</van-button
      >
    </div>
    <template #fixed>
      <v-fixed v-model="open" text="下单">
        <h6>
          您正在购买<span>{{ det.title }}</span>
        </h6>
        <van-cell title="选择收货地址" is-link @click="open1 = true"></van-cell>
        <div class="address" v-if="address_id" @click="open1 = true">
          <div class="name">{{ address.consignee }} {{ address.mobile }}</div>
          <div class="text">
            {{ toCity(address) }}
          </div>
        </div>
        <div class="w80">
          <van-button
            block
            round
            type="danger"
            :disabled="!address_id"
            @click="onpay"
            >立即下单购买</van-button
          >
        </div>
      </v-fixed>
      <transition name="van-fade">
        <div class="app_show_fixed top" v-if="open1">
          <v-a
            change
            @close="open1 = false"
            @change="onselectaddress"
            :address_id="address_id"
          ></v-a>
        </div>
      </transition>
    </template>
  </v-view>
</template>

<script>
import vV from "../private/video4.vue";
import vA from "../address/index.vue";
export default {

  data() {
    return {
      id: "",
      det: {},
      player: null,
      times: 0,
      timer: null,
      open: false,
      open1: false,
      address_id: "",
      address: {},
      isShow: false
    };
  },
  components: { vV, vA },
  computed: {
    // 是否显示价格
    ispriceshow() {
      return +this.det.viewing_type === 3 && +this.det.is_purchase !== 1;
    },
    // 是否显示转发人数
    isshareshow() {
      return +this.det.viewing_type === 2
        ? this.det.number_forwards - this.det.share_number
        : 0;
    },
    islock() {
      return +this.det.is_purchase === 1;
    },
    // 价格
    prices() {
      let a = this.det.classify || {};
      if (+a.is_whether === 1) {
        return {
          price: a.price,
          original_price: a.original_price,
        };
      }
      return {
        price: this.det.price,
        original_price: this.det.original_price,
      };
    },
    // 快递
    fast() {
      let a = this.det.classify || {};
      return +a.is_shipment === 1;
    },
    contents() {
      let a = (this.det.classify || {}).bill || "";
      if (a) {
        return a;
      }
      return this.det.introduce || "";
    },
  },
  methods: {
    onshares() {
      let link = this.onshare("", true);
      if (!link) return 0;
      console.log("分享");
      console.log(link);
      console.log(this.det);
      this.$vx({ link, desc: this.det.title, logo: this.det.cover_picture });
    },
    onsharebtn() {
      this.onshares();
      // this.$toast("请点击微信右上角...进行分享");
      this.$refs.view.$share();
    },
    onshare(f, type) {
      let e = this.$demo.$session.get("user", {});
      let os = {
        type: "web",
        nid: this.$demo.$local.get("nid", ""),
        cid: e.id || "",
        path: this.$route.path,
        id: this.det.curriculum_id || this.id,
        time: Date.now(),
        m: e.openid || "", // openid
        share: this.isshareshow > 0,
      };
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = this.$js.api.h5 + "h5/poster/?type=home_pay&h5=" + a;
      // eslint-disable-next-line
      if (!demo.es6().isWx()) {
        console.log(url);
        this.$toast("请用微信打开");
        return "";
      }
      if (type) return url;
      window.location.href = url;
    },
    toCity(i) {
      let a = [i.province_name, i.city_name, i.county_name, i.address];
      // eslint-disable-next-line
      return demo.array(a).unique().join("");
    },
    onselectaddress(e, v) {
      this.address_id = e;
      this.address = v;
    },
    onlinkpay(e) {
      // 准备支付
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
    // 快递购买
    onpay() {
      this.$api.http(
        "eduorder",
        { curriculum_id: this.id, address_id: this.address_id },
        (r) => {
          this.$toast("下单成功，正在跳转支付，请稍后...");
          this.onlinkpay(r);
        }
      );
    },
    onsubmit() {
      if (this.fast) {
        this.open = true;
        // 快递购买 跳页面 open1 填写地址
        return 0;
      }
      this.$api.http("eduorder", { curriculum_id: this.id }, (r) => {
        this.$toast("下单成功，正在跳转支付，请稍后...");
        this.onlinkpay(r);
      });
    },
    onsettimer() {
      if (this.timer) {
        return 0;
      }
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
        this.onsettimes();
      }, 10000);
    },
    onsettimes() {
      if (this.times > 0) {
        this.$api.http(
          "eduvtime",
          {
            curriculum_id: this.id,
            duration: parseInt(this.times),
          },
          () => {}
        );
      }
    },
    onvideotime(e) {
      if (e.duration < 1) return 0;
      if (this.isshareshow > 0) {
        let n = e.duration > 300 ? 15 : e.duration / 10;
        if (n < e.currentTime) {
          if (this.player) {
            this.times = 0;
            this.$refs.video.reset();
          }
          return this.$toast("转发" + this.isshareshow + "人后观看后续");
        }
      }
      if (this.fast) {
      } else if (this.ispriceshow) {
        let n = this.det.free_time;
        if (n < e.currentTime) {
          if (this.player) {
            this.times = 0;
            this.$refs.video.reset();
          }
          return this.$toast("购买后观看后续");
        }
      }

      if (e.currentTime > 0) {
        this.times = e.currentTime;
        if (this.det.duration !== this.times) {
          this.onsettimer();
        }
      }
    },
    onvideoinit(e) {
      this.player = e;
      if (this.times > 0) {
        // 跳转至 n  秒
        this.$refs.video.seek(this.times);
      }
    },
    once() {
      this.onshares();
    },
    init() {
      this.$api.http("edudet", { curriculum_id: this.id, user_id: "" }, (r) => {
        this.det = r;
        this.times = r.duration || 0;
        if (this.player) {
          this.$refs.video.seek(this.times);
        }

        setTimeout(() => {
          this.once();
        }, 500);
      });
      // "viewing_type":"1免费看 2转发看 3付费看"
      // viewing_type === 1 全部解锁
      // viewing_type === 2 number_forwards < share_number 解锁
      // viewing_type === 3 is_purchase === 1 解锁
      // viewing_type > 1 free_time 免费时长
      // 若 video 存在 点击查看 判断类型是否解锁 未解锁时判断免费时长
      // 价格显示 is_purchase !== 1 && viewing_type === 3
    },

  },
  mounted() {
    let url = window.location.href;
    if (url.indexOf("&tulis") > -1) {
      this.isShow = true;
    }
    this.id = this.$route.params.id;
    this.init();
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.onsettimes();
  },
};
</script>
<style lang='less' scoped>
.player {
  height: 210px;
  background-color: #222;
  color: #fff;
}
.head {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  .share {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 20px;
    color: #858585;
    b {
      font-size: 12px;
      transform: scale(0.8);
    }
  }
  .title {
    margin-right: 10px;
    width: calc(100% - 50px);
    font-size: 16px;
    line-height: 20px;
  }
}
.price {
  .p,
  .o {
    position: relative;
    padding: 0 5px;
    margin-left: 8px;
    line-height: 24px;
    &::before {
      position: absolute;
      content: "￥";
      left: -8px;
      bottom: 0;
      font-size: 15px;
      height: 15px;
      line-height: 1;
    }
  }
  .p {
    font-weight: 650;
    font-size: 22px;
    color: tomato;
  }
  .o {
    color: #999;
    font-size: 14px;
    &::before {
      top: 0;
      margin: auto;
    }
    &::after {
      position: absolute;
      content: "";
      left: -8px;
      top: 0;
      bottom: 0;
      height: 1px;
      transform: scale(1, 0.5);
      width: calc(100% + 10px);
      background-color: #999;
      margin: auto;
    }
  }
  .k {
    font-size: 16px;
  }
  .s {
    color: rgb(201, 145, 42);
    font-size: 15px;
    b {
      font-size: 18px;
      padding: 0 3px;
      color: tomato;
    }
  }
}
pre {
  font-size: 18px;
}
.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
}
h6 {
  font-size: 15px;
  padding: 10px;
  span {
    padding: 0 5px;
    color: tomato;
    font-weight: 650;
  }
}
.address {
  background-color: #fff;
  padding: 15px 10px;
  box-sizing: border-box;
  margin: 10px;
  font-size: 15px;
  padding-right: 50px;
  position: relative;
  min-height: 60px;
  border: 1px dashed #38f;
  border-radius: 5px;
  .name {
    line-height: 22px;
    margin-bottom: 8px;
    font-size: 16px;
    span {
      vertical-align: top;
    }
  }
}
</style>
