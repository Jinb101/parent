<template>
  <div class="visit">
    <v-tool-title text="报名"></v-tool-title>
    <div class="view">
      <van-field
        v-model="os.name"
        label="宝宝姓名"
        placeholder="请输入宝宝姓名"
        required
        input-align="right"
        maxlength="10"
      />
      <van-field label="宝宝性别" required input-align="right" readonly>
        <template #button>
          <van-radio-group v-model="os.gender" direction="horizontal">
            <van-radio name="1">男孩</van-radio>
            <van-radio name="2">女孩</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="os.birthday"
        label="宝宝出生日期"
        placeholder="请选择宝宝出生日期"
        required
        readonly
        input-align="right"
        right-icon="arrow"
        @click="open++"
      />
      <van-field
        v-model="os.parent_name"
        label="家长姓名"
        placeholder="请输入宝宝监护人"
        required
        input-align="right"
        maxlength="10"
      />
      <van-field
        v-model="os.contact"
        label="家长联系方式"
        placeholder="请输入宝宝监护人联系电话"
        required
        input-align="right"
        type="tel"
        maxlength="11"
      />
      <van-field
        v-model="os.address"
        label="联系地址"
        placeholder="请输入联系地址"
        required
        input-align="right"
        maxlength="25"
      />
    </div>
    <div class="foot">
      <van-button :color="theme.linear" block @click="onSub">提交</van-button>
    </div>
    <v-p :open="open" type="time">
      <v-t
        title="选择生日"
        @on-change="changeDate"
        :max="now"
        :min="min"
        temp
      ></v-t>
    </v-p>
  </div>
</template>

<script>
import vT from "../../private/time.vue";
import vP from "../../private/popup.vue";
export default {
  data() {
    return {
      theme: {},
      value: "",
      open: 0,
      now: Date.now(),
      os: {
        name: "",
        gender: "1",
        birthday: "",
        parent_name: "",
        address: "",
        contact: "",
      },
    };
  },
  computed: {
    min() {
      let y = this.$demo.timeout(this.now, "object");
      let t = [y.y - 20, "01", "01"].join("/");
      return new Date(t).getTime();
    },
  },
  components: { vT, vP },
  inject: ["appGetTheme", "appBack"],
  methods: {
    changeDate(e) {
      this.open = 0;
      this.os.birthday = e.time;
    },
    onSub() {
      if (!this.os.name) {
        return this.$model.info("请输入宝宝姓名", 2);
      }
      if (!this.os.birthday) {
        return this.$model.info("请选择宝宝出生日期", 2);
      }
      if (!this.os.parent_name) {
        return this.$model.info("请输入宝宝监护人", 2);
      }
      if (!this.os.contact) {
        return this.$model.info("请输入宝宝监护人联系电话", 2);
      }
      if (!this.os.address) {
        return this.$model.info("请输入联系地址", 2);
      }
      this.$api.http("signIn", this.os, () => {
        this.$model.info("报名成功", 2);
        this.appBack(true);
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
  },
};
</script>
<style lang='less' scoped>
.visit {
  .view {
    height: calc(100% - 90px);
    overflow-y: scroll;
  }
  .foot {
    height: 44px;
  }
}
</style>
