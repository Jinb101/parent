<template>
  <div class="pay_renew">
    <v-tool-title></v-tool-title>
    <div class="flex fw">
      <section v-for="(i, j) in item" :key="j + '-s'" @click="id = i.id">
        <div class="box" :class="{ active: id === i.id }">
          <p class="day">{{ i.title }}</p>
          <p class="col_danger">￥{{ i.value }}</p>
        </div>
      </section>
    </div>
    <transition name="fade">
      <div class="foot" v-if="id">
        <van-button block :color="theme.bgc" @click="onSub">支付</van-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      id: "",
      theme: {},
      path: "/",
    };
  },
  inject: ["appGetTheme", "appGetConfig"],
  methods: {
    onSub() {
      // let wx = this.appGetConfig(true); // appId
      let token = this.$demo.$local.get("token", "");
      let id = this.$demo.$local.get("nid", "");
      let href = encodeURIComponent(window.location.href);
      this.$api.http("paySetBabyVip", { type: this.id }, (e) => {
        let suffix = ["?id=", id, "&n=", e, "&t=", token, "&u=", href].join("");
        let url = this.$js.api.pay + suffix;
        window.location.href = url;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    // let tc = ["180天", "1年", "2年", "3年"];
    // let tx = ["half", "one", "two", "three"].map((r) => {
    //   return "main_" + r + "_year";
    // });
    this.$api.http("payGetBabyVip2", {}, (e) => {
      // this.det = r
      let tp = +e.guardian === 1;
      if (tp) {
        // 主监护人
        if (e.daily_amount && e.expiration_time) {
          this.item = [
            {
              name: "day",
              value: e.daily_amount + "/天",
              title: e.expiration_time + "到期",
            },
          ];
        } else {
          this.item = [
            {
              name: "main_half_year",
              value: e.main_half_year,
              title: "学期费用",
              id: 1,
            },
            {
              name: "main_one_year",
              value: e.main_one_year,
              title: "学年费用",
              id: 2,
            },
            {
              name: "minor_half_year",
              value: e.minor_half_year,
              title: "两年费用",
              id: 3,
            },
            {
              name: "minor_one_year",
              value: e.minor_one_year,
              title: "三年费用",
              id: 4,
            },
          ];
        }
      } else {
        this.item = [
          {
            name: "day",
            value: e.price,
            title: (e.day || "0").replace("天", "") + "天",
            id: 1000,
          },
        ];
      }
    });
    // this.$api.http("payGetBabyVip", {}, (e) => {
    //   let tp = +e.guardian === 1;
    //   if (tp) {
    //     delete e.guardian;
    //     this.item = Object.keys(e).map((s) => {
    //       let ind = tx.indexOf(s);
    //       return { name: s, value: e[s], title: tc[ind], id: ind + 1 };
    //     });
    //   } else {
    //     this.item = [
    //       {
    //         name: "day",
    //         value: e.price || 0,
    //         title: (e.day || "0").replace("天", "") + "天",
    //         id: 1000,
    //       },
    //     ];
    //   }
    // });
  },
};
</script>
<style lang='less' scoped>
.pay_renew {
  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 44px;
    width: 100%;
    z-index: 33;
  }
  section {
    width: 25%;
    box-sizing: border-box;
    padding: 10px 5px;
    text-align: center;
    font-size: 15px;
    line-height: 16px;
    .box {
      padding: 10px 0;
      background-color: #f2f1f1;
      border-radius: 8px;
      &.active {
        background-color: #99cc33;
        color: #fff;
        p + p {
          color: #fff !important;
        }
      }
    }
    .day {
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
}
</style>
