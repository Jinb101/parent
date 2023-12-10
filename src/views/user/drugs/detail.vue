<template>
  <div class="durgs_detail">
    <v-tool-title>
      <span v-if="del" class="col_danger" @click="onDel">删除记录</span>
    </v-tool-title>
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
    <van-field v-model="zz" label="症状" readonly input-align="right" />
    <van-field v-model="time" label="服药时间" readonly input-align="right" />
    <van-field label="药品" readonly />
    <div class="box">
      <article v-for="(i, j) in item" :key="j + '-s'">
        <p>
          药品名称：<b>{{ i.drug_name }}</b>
        </p>
        <p>
          服用剂量：<b>一次{{ i.metering }}剂量</b>
        </p>
        <p>
          上午喂药时间：
          <b>{{ i.morning }}</b>
          <b v-if="i.morning_status === '1'" class="col_danger">[未喂药]</b>
          <b v-else class="col_green">已喂药</b>
        </p>
        <p>
          下午喂药时间：
          <b>
            {{ i.afternoon }}
            <b v-if="i.afternoon_status === '1'" class="col_danger">[未喂药]</b>
            <b v-else class="col_green">已喂药</b>
          </b>
        </p>
      </article>
    </div>
    <van-field
      label="医院病例/处方单"
      readonly
      label-width="10em"
      v-if="image.length"
    />
    <div class="box">
      <div class="flex fw">
        <div class="avas" v-for="(i, j) in image" :key="j + '-is'">
          <van-image
            :src="i"
            fit="cover"
            @click="appShowImage(image, j)"
          ></van-image>
        </div>
      </div>
    </div>
    <van-field label="家长签字" readonly />
    <div class="box">
      <div class="ava" v-if="pic">
        <van-image :src="pic" @click="appShowImage(pic)"></van-image>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: {},
      cn: "",
      sn: "",
      name: "",
      zz: "",
      time: "",
      detail: {},
      item: [],
      pic: "",
      image: [],
      del: false,
    };
  },
  inject: ["appGetTheme", "appGetBabyInfo", "appShowImage", "appBack"],
  methods: {
    onDel() {
      this.$model.model("是否删除这条喂药记录", "", (res) => {
        if (res) {
          this.$api.http("drugsDel", this.$route.params, () => {
            this.$model.info("删除成功", 2);
            this.appBack(true);
          });
        }
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.appGetBabyInfo((e, b) => {
      this.cn = b.class_name;
      this.name = b.name;
      this.sn = b.nursery_name;
    });
    this.$api.http("drugsDetail", this.$route.params, (e) => {
      let d = new Date(e.date.replace(/-/g, "/") + " 00:00:00").getTime();
      this.zz = e.symptom;
      this.time = e.date;
      this.item = e.drugs || [];
      this.pic = e.sign;
      this.image = e.picture || [];
      this.del = d > e.server_time * 1e3;
      this.detail = e;
    });
  },
};
</script>
<style lang='less' scoped>
.durgs_detail {
  overflow-y: scroll;
  .avas {
    width: 100px;
    height: 100px;
    margin: 0 10px 10px 0;
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
      b {
        font-weight: 650;
      }
    }
    h5 {
      font-weight: 650;
    }
    article {
      p {
        margin-bottom: 5px;
      }
      & + article {
        margin-top: 8px;
      }
    }
  }
}
</style>
