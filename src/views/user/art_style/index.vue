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
               :style="{ height: '80%' }"
               closeable
               round
               :text="'1'">
      <div class="style_popup">
        <div class="hang_text">
          {{ handerText() }}
        </div>
        <div class="full baby"
             v-if="payIndex === 0">
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell clickable
                        @click="radio = i.id"
                        v-for="(i, j) in babyList"
                        :key="j + 'b'">
                <template #title>
                  {{ i.child_name }}
                </template>
                <template #right-icon>
                  <van-radio :name="i.id"
                             @click="payIndex = 2" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="full no_baby"
             v-if="payIndex === 1">
          <van-form validate-first
                    >
            <van-field v-model="form.name"
            label="家长名称"
                       placeholder="家长名称"
                       :rules="[{ required:true, message: '请输入家长名称' }]" />
            <van-field v-model="form.phone"
                       placeholder="手机号码"
                       label="手机号码"
                       :rules="[{ required:true, message: '请输入手机号码' }]" />
            <van-field v-model="form.child_name"
                       placeholder="宝贝名称"
                       label="宝贝名称"
                       :rules="[{ required:true,  message: '请输入宝贝名称' }]" />
            <van-field v-model="form.relevance"
                       placeholder="关系"
                       label="关系"
                       class="end_form"
                       @click.stop="openRele"
                       readonly
                       :rules="[{ required:true,  message: '请选择关系' }]" />
          </van-form>
        </div>
        <div class="full skit"
             v-if="payIndex === 2">
          <van-radio-group v-model="skitRadio">
            <van-cell-group>
              <van-cell clickable
                        @click="skitRadio = i.skill_id"
                        v-for="(i, j) in skitList"
                        :key="j + 'b'">
                <template #title>
                  {{ i.skill_name }}
                </template>
                <template #right-icon>
                  <van-radio :name="i.skill_id"
                             @click.stop="payIndex = 3" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <div class="full amount"
             v-if="payIndex === 3">
          <van-cell-group>
            <van-field v-model="amount"
                       label="金额"
                       placeholder="请输入金额" />
          </van-cell-group>
        </div>
        <div class="hang_btn">
          <van-button v-if="payIndex > 0"
                      type="default"
                      @click="editPayIndex()">上一步</van-button>
          <van-button :disabled="amount === '' || +amount < 1"
                      v-if="payIndex === 3"
                      type="default"
                      @click="topUp()">充值</van-button>
        </div>
      </div>
    </van-popup>

    <!-- <van-picker
    title="请选择关系"
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
  /> -->

  </v-view>
</template>

<script>
import Purchase from './components/Purchase'
import Eliminate from '@/views/user/art_style/components/Eliminate'
// import CashList from './components/CashList.vue'

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
      payIndex: 1,
      babyList: [],
      skitList: [],
      radio: "",
      skitRadio: "",
      amount: "",
      userInfo: false,
      form: {
        name: '',
        child_name: '',
        phone: '',
        relevance: '爸爸'
      },
      relationShow: false,
      relation: [],
    };
  },
  inject: [
    "appGetTheme",
    "appOpenPopup",
    "appGetClass",
    "appBack",
    "appGetInfo",
  ],
  components: { Purchase, Eliminate },
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
    showDarn: function (v, o) {
      if (!v) {
        this.getUserInfo()
        this.userInfo = true
        this.payIndex = 0
        this.radio = ""
        this.skitRadio = ""
        this.amount = ""
        this.userInfo = true
      }
    },
  },
  methods: {
    openRele() {
      this.appOpenPopup({
        title: '选择关系',
        types: 'change_relation',
        item: this.relation,
      });
    },
    topUp() {
      // 提交充值
      if (+this.amount < 1) {
        return 0
      }
      console.log('充值');
    },
    editPayIndex() {
      if (this.babyList.length > 0 && this.payIndex === 2) {
        this.payIndex = 0
        this.radio = ''
        return
      }
      if (this.payIndex === 1) {
        this.radio = ''
      }
      if (this.payIndex === 3) {
        this.skitRadio = ''
      }
      this.payIndex--
    },
    handerText() {
      if (this.payIndex === 0 || this.payIndex === 1) {
        return '添加/选择宝宝'
      } else if (this.payIndex === 2) {
        return '选择技能'
      } else if (this.payIndex === 1) {
        return '添加宝宝'
      } else {
        return '输入金额'
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
  },
  mounted() {
    this.getUserInfo()
    this.getBabyList()
    this.getSkitList()
    this.relation = this.$api.relation();
  }
};
</script>

<style scoped
       lang="less">
      .card {
        height: calc(100% - 10px);
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background-color: #f7f8fa;

        .card_header {
          height: 30%;
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
          height: 100%;
          width: 90%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          box-shadow: 0 0 10px 0 rgba(119, 116, 116, 0.3);
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

      /deep/ .van-button--default {
        border-radius: 12px !important;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-size: 14px !important;
      }

      .style_popup {
        height: calc(100% - 60px);
        width: 100%;
        background-color: white;
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .full {
        height: 100%;
        width: 90%;
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

      .hang_btn {
        width: 90%;
        height: 30px;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding-left: 10px;
        color: rgba(128, 128, 128, 0.788);
      }

      /deep/ .van-cell__title {
        width: 50% !important;
      }

      /deep/ .van-radio {
        width: 50%;
        display: flex;
        justify-content: end;
      }

      .amount {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    /deep/  .van-form :last-child::after {
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
    </style>
