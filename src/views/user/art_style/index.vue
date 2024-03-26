<template>
  <v-view header
          text="艺体中心"
          ref="view"
          bgc="#f8f7fa">
    <div class="card">
      <div class="card_header">
        <div class="header_box">
          <div class="header_box_left">
            <div>总积分&nbsp;:&nbsp; <span class="points">{{ userOptions.total_score }}</span> </div>
            <div>已使用&nbsp;:&nbsp; <span class="points">{{ userOptions.used_points }}</span> </div>
            <div>剩余分&nbsp;:&nbsp; <span class="points">{{ userOptions.integrated_card_points }}</span> </div>
          </div>
          <div class="header_box_right"
               @click="openShow">
            <van-button type="default">充值</van-button>
          </div>
        </div>
      </div>
      <div class="card_body">
        <van-tabs v-model="active"
                  :swipeable="true">
          <van-tab title="充值记录">
            <Purchase :isInfo="userInfo"
                      @init="userInfo = false"></Purchase>
          </van-tab>
          <!-- <van-tab title="消课记录">
          <Eliminate></Eliminate>
        </van-tab> -->
        </van-tabs>
      </div>
    </div>

    <van-popup v-model="showDarn"
               position="bottom"
               :title="handerText(5)"
               :style="{ height: '90%' }"
               :closeable="isArt ? false : true"
               round
               :close-on-click-overlay="false">
      <div class="popup_title">{{ handerText(5) }}</div>
      <div class="style_popup">
        <div class="full baby"
             v-if="!isArt && payIndex === 0">
          <div class="g_title">
            {{ handerText(1) }}
          </div>
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell clickable
                        @click="clickPanel(1, i.c_id)"
                        v-for="(  i, j  ) in   babyList  "
                        :key="i.c_id + 'b' + j">
                <template #title>
                  {{ i.child_name }}
                </template>
                <template #right-icon>
                  <van-radio :name="i.c_id" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>

        </div>
        <div class="full no_baby"
             v-if="payIndex === 1">
          <div class="g_title">
            {{ handerText(2) }}
          </div>
          <van-form validate-first>
            <van-field v-model="form.name"
                       label="家长名称"
                       placeholder="家长名称"
                       :rules="[{ required: true, message: '请输入家长名称' }]" />
            <van-field v-model="form.phone"
                       placeholder="手机号码"
                       label="手机号码"
                       :rules="[{ pattern: /^1\d{10}$/, message: '请输入手机号码' }]" />
            <van-field v-model="form.child_name"
                       placeholder="宝贝名称"
                       label="宝贝名称"
                       :rules="[{ required: true, message: '请输入宝贝名称' }]" />
            <van-field v-model="form.gender"
                       placeholder="宝贝性別"
                       label="宝贝性別"
                       @click.stop="sexOpen = true"
                       readonly
                       :rules="[{ required: true, message: '请输入宝贝名称' }]" />
            <van-field v-model="form.birthday"
                       placeholder="出生年月"
                       label="出生年月"
                       @click="openDate"
                       readonly
                       :rules="[{ required: true, message: '请输入宝贝名称' }]" />
            <van-field v-model="form.relevance"
                       placeholder="关系"
                       label="关系"
                       class="end_form"
                       @click.stop="openRele"
                       readonly
                       :rules="[{ required: true, message: '请选择关系' }]" />
          </van-form>
        </div>
        <div class="full skit">
          <div class="g_title">
            {{ handerText(3) }}
          </div>
          <van-radio-group v-model="skitRadio">
            <van-cell-group>
              <van-cell clickable
                        @click=" clickPanel(2, i.skill_id)"
                        v-for="(  i, j  ) in   skitList  "
                        :key="j + 'b'">
                <template #title>
                  {{ i.skill_name }}
                </template>
                <template #right-icon>
                  <van-radio :name="i.skill_id" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="full amount">
          <div class="g_title">
            {{ handerText(4) }}
          </div>
          <div class="amount_box">
            <van-cell-group>
              <van-field v-model="amount"
                         label="金额"
                         placeholder="请输入金额" />
            </van-cell-group>
          </div>
        </div>
        <div class="hang_btn">
          <van-button v-if="isArt"
                      type="default"
                      @click="goToLogin">登录</van-button>
          <van-button v-if="isArt"
                      type="default"
                      @click="openQrCode">关注公众号</van-button>
          <van-button v-if="!isArt && payIndex === 0"
                      @click="payIndex = 1">新增宝宝</van-button>
          <van-button v-if="!isArt && payIndex === 1"
                      @click="payIndex = 0">选择宝宝</van-button>
          <!-- <van-button v-if="showsyb()"
                      type="default"
                      @click="editPayIndex()">上一步</van-button> -->
          <!-- <van-button v-if="payIndex === 1"
                      type="default"
                      :disabled="disbleNext()"
                      @click="nextOne">下一步</van-button> -->
          <van-button type="primary"
                      round
                      :disabled="disbleNext()"
                      @click="topUp()">充值</van-button>

        </div>
      </div>
    </van-popup>

    <van-popup v-model="sexOpen"
               round
               position="bottom">
      <van-picker title="选择性别"
                  show-toolbar
                  :columns="sexList"
                  @confirm="sexConfirm"
                  @cancel="sexOpen = false" />
    </van-popup>

    <van-popup v-model="codeOpen"
               round
               :style="{ height: '40%' }"
               position="top">
      <div class="code_box">
        <img :src="offCode"
             alt=""
             srcset="">
      </div>
    </van-popup>

    <Vt :open="dateOpen"
        :ymd="true"
        @close="closeDate"
        @input="dateConfirm"></Vt>
  </v-view>
</template>

<script>
import form from '../../../assets/js/form';
import Purchase from './components/Purchase'
import Eliminate from '@/views/user/art_style/components/Eliminate'
import CashList from './components/CashList.vue'
// import pay from './pay.js'
import Vt from '../../newpublic/time.vue'

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
      active: 0,
      userOptions: {},
      showDarn: false,
      payIndex: 0,
      babyList: [],
      skitList: [],
      radio: null,
      skitRadio: null,
      amount: "",
      userInfo: false,
      form: {
        name: '',
        child_name: '',
        phone: '',
        relevance: '爸爸',
        birthday: null,
        gender: '男',
        genderVlaue: '1'
      },
      relationShow: false,
      dateOpen: false,
      sexOpen: false,
      relation: [],
      isArt: false,
      sexList: [
        {
          value: '',
          text: '男',
        },
        {
          value: '2',
          text: '女',
        },
      ],
      maxDate: new Date(2025, 10, 1),
      openid: '',
      codeOpen: false,
      offCode: ''
    };
  },
  inject: [
    "appGetTheme",
    "appOpenPopup",
    "appGetClass",
    "appBack",
    "appGetInfo",
    "appPath"
  ],
  components: { Purchase, Eliminate, Vt },
  watch: {
    childData: {
      handler(n) {
        let d = n.data;
        if (n.type === "change_relation") {
          this.form.relevance = d.name;
        }
      },
      deep: true,
    },
    payIndex(v) {
      if (v === 1) {
        this.radio = ""
      } else {
        this.form = {
          name: '',
          child_name: '',
          phone: '',
          relevance: '爸爸',
          birthday: null,
          gender: '男',
          genderVlaue: '1'
        }
      }
    },
    showDarn: function (v, o) {
      if (!v) {
        this.getUserInfo()
        this.userInfo = true
        this.payIndex = 0
        this.radio = ""
        this.skitRadio = ""
        this.amount = ""
        this.userInfo = true
        this.form = {
          name: '',
          child_name: '',
          phone: '',
          relevance: '爸爸',
          birthday: null,
          gender: '男',
          genderVlaue: '1'
        }
      }
    },
  },
  methods: {
    openDate(v) {
      this.dateOpen = true
    },
    closeDate(v) {
      this.dateOpen = v
    },
    dateConfirm(today) {
      this.form.birthday = today
      this.dateOpen = false
    },
    sexConfirm(e) {
      this.form.gender = e.text
      this.form.genderVlaue = e.value
      this.sexOpen = false
      console.log(e);
    },
    goToLogin() {
      window.location.hash = '#/login'
      window.location.reload()
    },
    openQrCode() {
      this.$api.http("getOffCode", {}, (r) => {
        this.offCode = r
        this.codeOpen = true
      });
    },
    overlayClick($event) {
      if (this.isArt) {
        this.showDarn = true
        return
      }
      this.showDarn = false
    },
    showsyb() {
      if (this.payIndex === 1 && this.isArt) {
        return false
      }
      return true
    },
    disbleNext() {
      let isPhone = this.validatePhoneNumber(this.form.phone)
      let conditions = [
        this.skitRadio !== '',
        this.amount !== ''
      ];
      if (!this.isArt) {
        conditions.push(this.radio !== '');
      }
      if (this.payIndex === 1) {
        conditions.push(
          isPhone,
          this.form.name !== '',
          this.form.phone !== '',
          this.form.child_name !== '',
          this.form.relevance !== '',
          this.form.birthday !== '',
          this.genderVlaue !== '');
      }
      console.log(!conditions.every(condition => condition));
      return !conditions.every(condition => condition);
    },
    addBaby() {
      this.payIndex = 1
      this.radio = 0
    },
    //  面板点击
    clickPanel(type, id) {
      console.log(id);
      if (type === 1) {
        this.radio = id
      } else if (type === 2) {
        this.skitRadio = id
      }
    },
    nextOne() {
      let isPhone = this.validatePhoneNumber(this.form.phone)
      if (!isPhone && this.payIndex === 1) {
        return this.$model.info("输入正确手机号", 2);
      }
      if (this.payIndex === 0) {
        this.payIndex = 2
        return
      }
      this.payIndex++
    },
    openRele() {
      this.appOpenPopup({
        title: '选择关系',
        types: 'change_relation',
        item: this.relation,
      });
    },
    validatePhoneNumber(phoneNumber) {
      var pattern = /^1\d{10}$/;
      return pattern.test(phoneNumber);
    },
    topUp() {
      // 提交充值
      try {
        if (+this.amount < 0.1) {
          return 0
        }
        let op = {
          amount: this.amount,
          child_id: this.radio,
          skill_id: this.skitRadio,
          openid: this.openid
        }
        if (form.phone !== "") {
          op = { ...op, ...this.form }
        }
        // 验证手机号
        this.$api.http("payFee", {
          ...op
        }, (r) => {
          let token = this.$demo.$local.get("token", "");
          let id = this.$demo.$local.get("nid", "");
          let href = encodeURIComponent(window.location.href);
          let suffix = ["?id=", id, "&n=", r.order_sn, "&t=", token, "&u=", href, "&is=art"].join("");
          let url = this.$js.api.pay + suffix;
          window.location.href = url;
        });
      } catch (error) {
        this.$model.error("错误，请重试", 2);
      }
      console.log(this.form);
      console.log('充值');
    },
    handerText(e) {
      switch (e) {
        case 1:
          return '   选择宝宝'
        case 2:
          return '   添加宝宝'
        case 3:
          return '   选择技能'
        case 4:
          return '   输入金额'
        case 5:
          // eslint-disable-next-line no-undef
          const { name } = demo.$local.get("appConfig", null)
          return name
        default:
          break;
      }
    },
    openShow() {
      this.showDarn = true
    },
    getUserInfo() {
      this.$api.http("userPoints", {}, (r) => {
        this.userOptions = r
      });
    },
    getBabyList() {
      this.$api.http("babyList", {}, (r) => {
        console.log(r);
        this.babyList = r
      });
    },
    getSkitList() {
      this.$api.http("skitList", {}, (r) => {
        this.skitList = r
      });
    },
    hasParameter(url, parameterName) {
      let urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.has(parameterName);
    },
    wxArtStyle() {
      this.$api.http("wx", {}, (e) => {
        this.$demo.$local.set("wxConfig", e);
      });
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    // 获取 url 中的 code
    let urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    // 获取今日数据
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero based, so +1 and pad with 0
    let dd = String(today.getDate()).padStart(2, '0'); // Pad with 0
    this.form.birthday = `${yyyy}-${mm}-${dd}`;
    // eslint-disable-next-line no-undef
    const source = demo.$local.get("source", false)
    // 查看 URL 中 是否拥有 参数 n_id 和 source
    let url = window.location.href;
    let hasNId = this.hasParameter(url, 'n_id');
    let hasSource = this.hasParameter(url, 'source');
    if (source) {
      this.isArt = true
      this.showDarn = true
      this.payIndex = 1
      if (hasNId) {
        // eslint-disable-next-line no-undef
        demo.$local.set('nid', hasNId)
      }
      if (code) {
        // 如果存在 code，发送到服务器获取 openid
        this.$api.http('getopenid', { type: 1, js_code: code }, (r) => {
          this.openid = r.openid;
        });
      } else {
        // eslint-disable-next-line no-undef
        // 本地存储 source=1 用于判断是否是艺体中心
        // eslint-disable-next-line no-undef
        demo.$local.set('source', 1)
        this.$js.wxArtcode("art_style");
      }
    } else {
      this.getUserInfo()
      this.getBabyList()
    }
    this.getSkitList()
    // this.openQrCode()
    this.relation = this.$api.relation();
    console.log('Has n_id:', hasNId);
    console.log('Has source:', hasSource);
  },
  // 页面离开前
  beforeDestroy() {
    // 清除
    // eslint-disable-next-line no-undef
    demo.$local.clear("source");
  }
};
</script>

<style lang="less"
       scoped>
      .card {
        height: calc(100% - 10px);
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background-color: #f7f8fa;

        .card_header {
          height: 25%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f7fa;

          .header_box {
            height: 90%;
            width: 90%;
            border-radius: 6px;
            box-shadow: 0 0 10px 0 rgba(119, 116, 116, 0.1);
            background: linear-gradient(135deg, #ff5301, #f8b477, #ff5301);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;

            .header_box_left {
              width: 64%;
              height: 60%;
              margin: 10px 0 10px 20px;
              font-size: 16px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: start;
            }

            .header_box_right {
              width: 34%;
              height: 90%;
              margin: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }

        .card_body {
          height: 75%;
          width: 90%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          box-shadow: 0 0 10px 0 rgba(119, 116, 116, 0.3);
          overflow: hidden;
        }
      }

      .van-tabs {
        width: 100%;
        height: 100%;
      }

      /deep/ .van-tabs__content {
        height: 92%;
        width: 100%;
      }

      .van-tab__pane {
        width: 100%;
        height: 100%;
        background: #fff;
        padding: 5px 25px;
        font-size: 14px;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .points {
        font-weight: 600;
      }

      /deep/ .van-button {
        border-radius: 12px !important;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-size: 14px !important;
      }

      .popup_title {
        height: 50px;
        width: 100%;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .style_popup {
        height: calc(100% - 50px);
        width: 100%;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        overflow-y: auto;
      }

      .full {
        width: 90%;
        margin: 10px 0;
        border-bottom: 1px solid rgba(128, 128, 128, 0.3);
      }

      .hang_text {
        width: 90%;
        height: 30px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
        color: rgba(128, 128, 128, 0.788);
        border-bottom: 1px solid rgba(128, 128, 128, 0.3);
      }

      .text_blu {
        color: rgba(0, 0, 255, 0.6);
      }

      .hang_btn {
        width: 90%;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: rgba(128, 128, 128, 0.788);
        margin: 20px 0;
      }

      .hang_btn .van-button--primary {
        min-width: 120px;
        color: white;
        border: none !important;
        background: linear-gradient(135deg, #ff5301, #f8b477, #ff5301);
      }

      /deep/ .van-cell__title {
        width: 50% !important;
      }

      /deep/ .van-radio {
        width: 50%;
        display: flex;
        justify-content: end;
      }

      .g_title {
        font-size: 14px;
        color: #fff;
        padding: 10px 0;
        width: 100%;
        text-align: center;
        border-radius: 6px;
        background: linear-gradient(135deg, #ff5301, #f8b477, #ff5301);
      }

      /deep/ .van-form :last-child::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0.42667rem;
        bottom: 0;
        left: 0.42667rem;
        border-bottom: 0.02667rem solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }

      .no_baby {
        height: auto;
      }

      .baby .van-cell-group {
        max-height: 340px;
        overflow-y: auto;
      }

      .skit .van-cell-group {
        max-height: 300px;
        overflow-y: auto;
      }

      .amount {
        min-height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .amount .amount_box {
        margin: auto 0;
      }

      .code_box {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center
      }

      .code_box img {
        height: 4rem;
        width: 4rem;
      }
    </style>
