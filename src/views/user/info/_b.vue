<template>
  <div>
    <v-line
      title="宝宝信息"
      :color="theme.bgc"
      name="smile"
      msg="已绑定宝贝"
    ></v-line>
    <div class="box" v-if="!cid">
      <p>
        <span class="large">{{ baby.name }}</span>
        {{ toYear }}岁
      </p>
      <p><b>性别：</b>{{ baby.gender === 2 ? "女" : "男" }}</p>
      <p><b>园所：</b>{{ baby.nursery_name }}</p>
      <p><b>班级：</b>{{ baby.class_name }}</p>
      <p><b>学号：</b>{{ baby.no }}</p>
      <p><b>入学日期：</b>{{ toTime(baby.join_time) }}</p>
      <p><b>出生日期：</b>{{ baby.birthday }}</p>
      <van-button
        size="small"
        round
        :color="$theme.linear"
        to="/user_info_avatar"
        class="btn"
        >考勤图设置</van-button
      >
    </div>
    <div class="box" v-else>无</div>
    <br />
    <v-line
      title="班主任信息"
      :color="theme.bgc"
      name="smile"
      msg="绑定宝贝所对应负责老师"
    ></v-line>
    <div class="box" v-if="!cid">
      <p>
        <span class="large">{{ baby.leader_name }}</span>
      </p>
      <p><b>联系方式：</b>{{ baby.leader_contact }}</p>
    </div>
    <div class="box" v-else>无</div>
    <br /><br /><br />
  </div>
</template>

<script>
import vLine from "../../system/line.vue";
export default {
  data() {
    return {
      theme: {},
      baby: {},
      cid: true,
    };
  },
  computed: {
    toYear() {
      let y = this.baby.birthday;
      if (!y) return 0;
      let t = Date.now() - new Date(y.replace(/-/g, "/")).getTime();
      let n = (t / (864e5 * 365)).toFixed(1);
      return n < 1 ? n : Math.floor(n);
    },
  },
  inject: ["appGetTheme", "appGetBabyInfo"],
  components: { vLine },
  methods: {
    toTime(n) {
      if (n > 0) {
        return this.$demo.timeout(n);
      }
      return n;
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.appGetBabyInfo((e, b) => {
      this.cid = e.c_id === 0;
      this.baby = b;
    });
  },
};
</script>
<style lang='less' scoped>
.box {
  background-color: #fff;
  padding: 10px;
  font-size: 15px;
  p {
    line-height: 20px;
    margin-bottom: 5px;
    b {
      color: #999;
    }
  }
  .large {
    padding: 0 10px;
    font-weight: 650;
    font-size: 18px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    vertical-align: bottom;
  }
}
.btn {
  min-width: 100px;
}
</style>
