<template>
  <div class="new_baby_pay">
    <v-tool-title path="/user">
      <span v-if="pays" @click="pays = false">
        <van-icon size="20" name="cross" />
      </span>
    </v-tool-title>
    <van-field
      v-model="os.name"
      label="宝宝姓名"
      placeholder="请输入宝宝姓名"
      input-align="right"
      maxlength="20"
      required
    />
    <van-field
      v-model="os.parent_name"
      label="主监护人"
      placeholder="请输入主监护人"
      input-align="right"
      maxlength="20"
      required
    />
    <van-field
      v-model="os.contact"
      label="联系电话"
      placeholder="请输入入学填写联系电话"
      input-align="right"
      maxlength="20"
      required
    />
    <van-field
      v-model="os.relevance"
      label="宝宝关系"
      placeholder="请输入与宝宝关系"
      input-align="right"
      maxlength="20"
      required
    />
    <van-field
      v-model="os.amount"
      label="金额"
      placeholder="请输入缴费金额"
      input-align="right"
      maxlength="20"
      required
    />
    <van-field
      v-model="name"
      label="缴费项"
      placeholder="请选择缴费项"
      input-align="right"
      maxlength="20"
      required
      readonly
      @click="a1++"
    />
    <van-field
      v-model="os.expire_date"
      label="到期时间"
      placeholder="请选择到期时间"
      input-align="right"
      maxlength="20"
      required
      readonly
      v-if="iss"
      @click="a2++"
    />
    <div class="send">
      <van-button block color="#99cc33" round @click="onSub">缴费</van-button>
    </div>
    <v-p :open="a2" type="time">
      <v-t @on-change="changeTime"></v-t>
    </v-p>
    <transition name="fade">
      <div class="app_show_fixed" v-if="pays">
        <div class="ava">
          <van-image :src="code" @click="appShowImage(code)"></van-image>
        </div>
        <div class="w80">
          <van-button block :color="theme.bgc" round @click="onCheckPay"
            >我已付款</van-button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import vP from "../../private/popup.vue";
import vT from "../../private/time.vue";
export default {
  props: {
    childData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      os: {
        name: "",
        parent_name: "",
        contact: "",
        relevance: "",
        amount: "",
        i_id: "",
        expire_date: "",
      },
      iss: false,
      name: "",
      a1: 0,
      a2: 0,
      code: "",
      pays: false,
      tp: "",
      theme: {},
    };
  },
  components: { vP, vT },
  watch: {
    childData: {
      handler(n) {
        let once = n.data;
        this.os.i_id = once.id;
        this.name = once.name;
        this.iss = +once.is_renewals === 1;
        if (!this.iss) {
          this.os.expire_date = "";
        }
      },
      deep: true,
    },
    a1() {
      this.c("选择缴费项", "pay_type", this.pay);
    },
  },
  inject: ["appOpenPopup", "appGetTheme", "appShowImage"],
  methods: {
    onCheckPay() {
      this.$model.model("请确认您已经付款", "", (res) => {
        if (res) {
          this.pays = false;
        }
      });
    },
    c(title, types, item) {
      this.appOpenPopup({
        title,
        types,
        item,
      });
    },
    onSub() {
      this.$api.http("payNewSend", this.os, (e) => {
        this.code = e.qr_code;
        this.pays = true;
      });
    },
    changeTime(e) {
      this.os.expire_date = e.time.replace(/\//g, "-");
      this.a2 = 0;
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.$api.http("payNewDetail", {}, (e) => {
      this.pay = e.map((r) => {
        r.text = r.name;
        return r;
      });
      let once =
        this.pay.filter((r) => {
          return +r.charge_type === 2;
        })[0] || {};
      if (once.id) {
        this.os.i_id = once.id;
        this.name = once.name;
        this.iss = +once.is_renewals === 1;
      }
    });
  },
};
</script>
<style lang='less' scoped>
.new_baby_pay {
  overflow-y: scroll;
  .send {
    width: 60%;
    margin: 30px auto 10px;
  }
}
</style>
