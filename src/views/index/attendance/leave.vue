<template>
  <div class="leave">
    <v-tool-title>
      <span v-if="!!tms">{{ tms }}</span>
    </v-tool-title>
    <van-field label="请假类型" input-align="right" readonly required>
      <template #button>
        <van-radio-group v-model="radio" direction="horizontal">
          <van-radio name="1">病假</van-radio>
          <van-radio name="2">事假</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      v-model="st"
      label="开始时间"
      input-align="right"
      readonly
      required
      placeholder="请选择开始时间"
      right-icon="arrow"
      @click="onTime('st')"
    />
    <van-field
      v-model="et"
      label="结束时间"
      input-align="right"
      readonly
      required
      placeholder="请选择结束时间"
      right-icon="arrow"
      @click="onTime('et')"
    />
    <van-field
      v-model="value"
      rows="3"
      autosize
      label="备注"
      type="textarea"
      placeholder="请输入备注"
      maxlength="120"
      show-word-limit
    />
    <van-field label="附件" readonly>
      <template #button> <v-i class="w" @path="onImage"></v-i> </template>
    </van-field>
    <div class="send">
      <van-button block :color="theme.linear" round @click="onSub"
        >提交</van-button
      >
    </div>
    <v-p :open="open" type="time">
      <v-t @on-change="onTimed" type="datehour"></v-t>
    </v-p>
  </div>
</template>

<script>
import vI from "../../private/image.vue";
import vP from "../../private/popup.vue";
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      value: "",
      theme: {},
      open: 0,
      st: "",
      et: "",
      stype: "",
      radio: "1",
      image: [],
    };
  },
  components: { vI, vP, vT },
  inject: ["appGetTheme", "appBack"],
  computed: {
    tms() {
      if (this.st && this.et) {
        let s = new Date(this.st.replace(/-/g, "/")).getTime();
        let e = new Date(this.et.replace(/-/g, "/")).getTime();
        if (s > e) {
          return 0;
        }
        let d = e - s;
        if (d > 864e5) {
          let d2 = Math.floor(d / 864e5);
          let h = (d - d2 * 864e5) / 36e5;
          return d2 + "天" + h + "时";
        }
        let d3 = d / 36e5;
        return d3 > 0 ? d3 + "时" : 0;
      }
      return 0;
    },
  },
  methods: {
    onTime(e) {
      this.open++;
      this.stype = e;
    },
    onTimed(e) {
      let a = e.arr;
      this[this.stype] = [a[0], a[1], a[2]].join("-") + " " + a[3] + ":00";
      this.open = 0;
    },
    onImage(e) {
      this.image = e;
    },
    onSub() {
      if (!this.tms) return this.$model.info("请正确选择请假时间", 2);
      let os = {
        days_type: 1,
        type: this.radio,
        begin_date: this.st,
        end_date: this.et,
        caption: this.value,
        imgs: this.image.map((k) => {
          return k.path;
        }),
      };
      this.$api.http("attendanceLeave", os, () => {
        this.$model.info("提交成功", 2);
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
.leave {
  overflow-y: scroll;
  .w {
    width: 235px;
  }
  .send {
    margin: 30px auto;
    width: 80%;
  }
}
</style>
