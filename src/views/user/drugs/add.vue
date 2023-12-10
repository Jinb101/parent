<template>
  <div class="drug_add">
    <v-tool-title>
      <span v-if="hand" @click="hand = false">
        <van-icon name="cross" size="20" />
      </span>
      <span v-else @click="onAddItem" class="col_green">添加药品</span>
    </v-tool-title>
    <div class="box">
      <h5 class="col_danger">重要说明</h5>
      <p v-for="(i, j) in vex" :key="j + '-p'" class="col_danger">
        {{ j + 1 }}.{{ i }}
      </p>
    </div>
    <transition name="fade">
      <div class="box" v-if="zz">
        <p>
          本人宝宝({{ name }})因
          <b class="col_danger">{{ zz }}</b>
          症状，特委托
          <b class="col_danger">{{ sn }}</b>
          代喂药
        </p>
      </div>
    </transition>
    <van-field v-model="cn" label="班级" readonly input-align="right" />
    <van-field v-model="name" label="幼儿姓名" readonly input-align="right" />
    <van-field
      v-model="zz"
      label="症状"
      required
      input-align="right"
      placeholder="请输入症状"
      maxlength="60"
    />
    <!-- <van-field
      v-model="time"
      label="服药时间"
      required
      readonly
      input-align="right"
      placeholder="请选择服药时间"
      @click="onOpenTime('time')"
    /> -->
    <van-cell
      title="服药时间"
      is-link
      :value="todaynum > 0 ? todaynum + '天' : '选择服药时间'"
      @click="open1 = true"
    ></van-cell>
    <van-field label="药品" readonly required />
    <div class="box med">
      <article v-for="(i, j) in item" :key="j + '-art'">
        <h6>
          {{ j + 1 }}
          <span class="del" @click="onDelItem(i.id)">
            <van-icon size="20" name="delete" color="tomato" />
          </span>
        </h6>
        <van-field
          v-model="i.name"
          label="药品名称"
          required
          input-align="right"
          placeholder="请输入药品名称"
        />
        <van-field
          v-model="i.num"
          label="服用剂量"
          required
          input-align="right"
          placeholder="请输入服用剂量"
        />
        <van-field
          v-model="i.am"
          label="上午服药时间"
          readonly
          input-align="right"
          placeholder="请选择上午服药时间"
          @click="onOpenTime('am', j)"
        />
        <van-field
          v-model="i.pm"
          label="下午服药时间"
          readonly
          input-align="right"
          placeholder="请选择下午服药时间"
          @click="onOpenTime('pm', j)"
        />
      </article>
    </div>
    <van-field label="医院病例/处方单" label-width="10em" readonly />
    <div class="box">
      <v-i @path="onPath" max="3"></v-i>
    </div>
    <van-field
      label="家长签字"
      readonly
      required
      @click="hand = true"
      placeholder="点击签字"
      input-align="right"
    />
    <div class="box">
      <div class="ava" v-if="hand_pic">
        <van-image :src="hand_pic" @click="appShowImage(hand_pic)"></van-image>
      </div>
    </div>
    <div class="send">
      <van-button block :color="theme.linear" round @click="onSub"
        >添加</van-button
      >
    </div>
    <transition name="fade">
      <div class="app_show_fixed" v-if="hand">
        <v-hand @on-save="onHandPath"></v-hand>
      </div>
    </transition>
    <v-p type="time" :open="open">
      <v-t @on-change="onChangeTime" v-if="etx.type === 'time'"></v-t>
      <van-datetime-picker
        v-model="tms"
        type="time"
        title="选择时间"
        :min-hour="8"
        :max-hour="20"
        @confirm="subTime"
        v-else
      />
    </v-p>
    <van-calendar v-model="open1" type="multiple" @confirm="onConfirm" />
  </div>
</template>

<script>
import vI from "../../private/image.vue";
import vHand from "com/hand/hand";
import vP from "../../private/popup.vue";
import vT from "../../private/time.vue";
export default {
  data() {
    return {
      value: "",
      cn: "",
      sn: "",
      zz: "",
      name: "",
      hand: false,
      hand_pic: "",
      theme: {},
      vex: [
        "该家长务必认真填写代喂药委托表",
        "药品无包装或标识不清，不予喂服",
        "请家长将药品打包在一个包装内，写上姓名和班级",
      ],
      item: [],
      id: 0,
      open: 0,
      open1: false,
      etx: {},
      time: "",
      tms: "",
      image: [],
      todaynum: 0,
      times: [],
    };
  },
  inject: ["appGetBabyInfo", "appShowImage", "appGetTheme", "appBack"],
  components: { vI, vHand, vP, vT },
  methods: {
    onConfirm(v) {
      this.open1 = false;
      this.todaynum = v.length;
      this.times = v.map((s) => {
        // return Math.floor(s.getTime() / 1000);
        // eslint-disable-next-line
        return demo.timeout(s.getTime(), "ymd", "-");
      });
      // console.log(this.times);
    },
    onSub() {
      // if (!this.time) return this.$model.info("请选择喂药时间", 2);
      if (!this.zz) return this.$model.info("请输入症状", 2);
      if (!this.hand_pic) return this.$model.info("请签字", 2);
      let os = {
        date: this.times.join(","),
        // date: this.time,
        symptom: this.zz,
        sign: this.hand_pic,
        drugs: this.item
          .filter((s) => {
            return !(
              s.name === "" ||
              s.num === "" ||
              (s.am === "" && s.pm === "")
            );
          })
          .map((k) => {
            return {
              drug_name: k.name,
              metering: k.num,
              morning: k.am,
              afternoon: k.pm,
            };
          }),
        picture: this.image
          .map((s) => {
            return s.path;
          })
          .join(","),
      };
      if (!os.drugs.length) return this.$toast("请添加药品及服药时间");
      this.$api.http("drugsAdd", os, () => {
        this.$model.info("提交成功", 2);
        this.appBack(true);
      });
    },
    onPath(e) {
      this.image = e;
    },
    subTime(e) {
      this.open = 0;
      this.item[this.etx.index][this.etx.type] = e;
    },
    onOpenTime(type, index) {
      this.etx = { type, index };
      this.open++;
    },
    onChangeTime(e) {
      this.open = 0;
      this.time = e.time.replace(/\//g, "-");
    },
    onHandPath(e) {
      this.hand = false;
      this.hand_pic = e;
    },
    onAddItem() {
      let v = this.item.filter((s) => {
        return s.name === "" || s.num === "" || (s.am === "" && s.pm === "");
      });
      if (v.length) return this.$model.info("请完整填写药品", 2);
      this.id++;
      this.item.push({ name: "", num: "", id: this.id, am: "", pm: "" });
    },
    onDelItem(id) {
      if (this.item.length <= 1) return 0;
      this.item = this.item.filter((r) => {
        return r.id !== id;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.onAddItem();
    this.appGetBabyInfo((e, b) => {
      this.cn = b.class_name;
      this.name = b.name;
      this.sn = b.nursery_name;
    });
  },
};
</script>

<style lang='less' scoped>
.drug_add {
  overflow-y: scroll;
  padding-bottom: 30px;
  .med {
    article {
      background-color: rgba(79, 139, 223, 0.1);
      .van-cell {
        background-color: rgba(79, 139, 223, 0);
      }
      &:nth-child(2n) {
        background-color: rgba(37, 206, 37, 0.1);
        .van-cell {
          background-color: rgba(37, 206, 37, 0);
        }
      }
    }
    h6 {
      position: relative;
      padding: 10px;
      .del {
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 20px;
      }
    }
  }
  .box {
    padding: 10px;
    .ava {
      height: 213px;
      width: 120px;
      border: 1px solid #eee;
      border-radius: 5px;
    }
    h5,
    p {
      font-size: 14px;
      line-height: 1.2;
      margin-bottom: 2px;
    }
    h5 {
      font-weight: 650;
    }
  }
  .send {
    width: 80%;
    margin: 30px auto 10px;
  }
}
</style>
