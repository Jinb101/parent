<template>
  <v-view retreat>
    <template v-if="shows">
      <div class="cover_bgc"></div>
      <div
        class="prev flex"
        v-if="detail.no > 1 && item.length > current"
        @click="current--"
      >
        <div class="icon"><van-icon name="arrow-left" /></div>
        <b>上一题</b>
      </div>
      <div class="div">
        <div class="progress flex">
          <div>
            <van-progress
              :percentage="pronum"
              stroke-width="8"
              :pivot-text="detail.name"
            />
          </div>
          <b>该项共{{ detail.count }}题</b>
        </div>
        <div class="title van-hairline--top">
          {{ detail.label }}
        </div>
        <div class="btns">
          <van-button
            block
            round
            :plain="+detail.value !== +i.answer_id"
            type="info"
            @click="onsavevalue(i.answer_id)"
            v-for="(i, j) in detail.list"
            :key="j"
            >{{ i.title }}</van-button
          >
        </div>
        <div class="sub_btn">
          <van-button
            block
            type="primary"
            v-if="item.length <= current"
            @click="onsub"
            >查看测评报告</van-button
          >
        </div>
        <div class="tips">
          *测评中有需要宝宝做出相关动作的题目，宝宝在身边测评结果会更准确哦
        </div>
      </div>
    </template>
    <template #fixed>
      <v-fixed v-model="open">
        <template #menu>
          <span @click="open2 = true">测评记录</span>
        </template>
        <div class="child">
          <div class="canvas">
            <iframe :src="canvassrc" frameborder="0"></iframe>
          </div>
          <div class="age flex">
            <b>测评与宝宝({{ ext.age }})</b>
            <van-button round size="small" type="primary" @click="getinit"
              >重新测评</van-button
            >
          </div>
          <div class="all">
            <h5>整体能力现状</h5>
            <p>{{ ext.expression }}</p>
          </div>
          <div
            v-if="ext.evaluation_report && ext.evaluation_report.length"
            class="box"
          >
            <ul>
              <li v-for="(i, j) in ext.evaluation_report" :key="j">
                <h6>
                  <span class="icon"><img :src="imgslen(j)" alt="" /></span>
                  {{ i.classify_title }}
                </h6>
                <p>{{ i.appraise }}</p>
                <span class="status">
                  <img
                    :src="imgslen(i.all_score - i.score <= 1 ? -8 : -7)"
                    alt=""
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </v-fixed>
      <v-fixed v-model="open2">
        <v-l @change="onchengdetail"></v-l>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vL from "./list.vue";
export default {
  data() {
    return {
      item: [],
      current: 0,
      active: 1,
      i2: [],
      open: false,
      ext: {},
      shows: false,
      open2: false,
      detail: {},
      pronum: 0,
    };
  },
  watch: {
    current(n) {
      if (n < this.item.length) {
        this.detail = this.item[n];
        this.pronum = this.progresslen;
      }
    },
  },
  components: { vL },
  methods: {
    imgslen(num) {
      // eslint-disable-next-line
      return siteConfig().icon(10 + num, "private");
    },
    onsavevalue(e) {
      if (this.current >= this.item.length) return 0;
      this.$set(this.item[this.current], "value", e);
      this.pronum = this.progresslen;
      let t = 200;
      if (this.detail.no === this.detail.count && this.pronum > 0) {
        this.pronum = 100;
        t = 500;
      }
      setTimeout(() => {
        this.current++;
      }, t);
    },
    onsub() {
      // eslint-disable-next-line
      let a = demo.copy(this.item);
      // eslint-disable-next-line
      let b = demo.array(a).agg("id");
      let c = Object.values(b).map((s) => {
        return {
          classify_id: s[0].id,
          data: s.map((k) => {
            return {
              evaluation_id: k.list[0].evaluation_id,
              answer_id: k.value,
            };
          }),
        };
      });
      let load = this.$toast.loading({ duration: 0 });
      this.$api.http("a2023041402", { data: JSON.stringify(c) }, (r) => {
        this.ext = r;
        this.open = true;
        if (load) {
          load.clear();
          load = null;
        }
      });
      setTimeout(() => {
        if (load) {
          load.clear();
          load = null;
        }
      }, 8e3);
    },
    init(evaluation_report_id) {
      this.shows = false;
      this.$api.http("a2023041404", { evaluation_report_id }, (r) => {
        if (r.child_id) {
          this.ext = r;
          this.open = true;
        } else {
          this.getinit();
        }
      });
    },
    onchengdetail(e) {
      this.open2 = false;
      this.init(e);
    },
    getinit() {
      this.open = false;
      this.shows = true;
      this.item = [];
      this.$api.http("a2023041401", {}, (r) => {
        this.i2 = r.map((s) => {
          return {
            name: s.name,
            id: s.classify_id,
          };
        });
        let item = r.map((s) => {
          let o = {
            name: s.name,
            id: s.classify_id,
            count: s.evaluation.length,
          };
          let list = (s.evaluation || []).map((k, v) => {
            return {
              value: "",
              label: k.question,
              list: k.evaluation_answer || [],
              no: v + 1,
              ...o,
            };
          });
          return list;
        });
        item.forEach((k) => {
          this.item.push(...k);
        });
        this.$nextTick(() => {
          this.current = 0;
          this.detail = this.item[0];
          this.pronum = this.progresslen;
        });
      });
    },
  },
  computed: {
    topro() {
      if (this.item.length) {
        return +(((this.current + 1) / this.item.length) * 100).toFixed(2);
      }
      return 0;
    },
    end() {
      if (this.endlen < this.item.length) {
        return ["(", this.endlen, "/", this.item.length, ")"].join("");
      }
      return "";
    },
    endlen() {
      return this.item.filter((s) => {
        return s.value !== "";
      }).length;
    },
    exttocanvas() {
      if (this.ext.evaluation_report) {
        return this.ext.evaluation_report.map((s) => {
          return {
            name: s.classify_title,
            max: s.all_score,
            num: s.score,
          };
        });
      }
      return [];
    },
    canvassrc() {
      // eslint-disable-next-line
      let d = demo.es6().encrypt(this.exttocanvas, "chart");
      return this.$js.api.h5 + "chart/?type=w_evaluate&h5=" + d;
    },
    progresslen() {
      if (this.detail.no > 0) {
        return +(((this.detail.no - 1) / this.detail.count) * 100).toFixed(2);
      }
      return 0;
    },
  },
  mounted() {
    this.init("");
  },
};
</script>
<style lang='less' scoped>
.cover_bgc {
  position: fixed;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  // background-color: #38f;
}
.div {
  position: relative;
  z-index: 3;
  margin: 40px auto 20px;
  width: 96%;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 15px;
  .progress {
    padding: 15px 0;
    align-items: center;
    div {
      flex: 1;
    }
    b {
      font-size: 13px;
      margin-left: 10px;
    }
  }
  .title {
    padding: 20px 10px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    line-height: 18px;
    min-height: 54px;
  }
  .btns {
    padding: 0 10px;
    .van-button {
      & + .van-button {
        margin-top: 15px;
      }
    }
  }
  .sub_btn {
    padding: 20px 10px;
    .van-button {
      border-radius: 15px;
    }
  }
  .tips {
    color: #999;
    font-size: 14px;
    line-height: 1.8;
  }
}
.prev {
  font-size: 14px;
  padding: 10px;
  color: orange;
  position: fixed;
  right: 5px;
  top: 5px;
  z-index: 66;
}

.child {
  padding: 10px;
  box-sizing: border-box;
  font-size: 16px;
  .canvas {
    height: 300px;
    background-color: rgb(23, 198, 207);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .age {
    padding: 10px;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 10px;
    font-size: 14px;
    align-items: center;
    background: linear-gradient(45deg, rgb(23, 198, 207), #3b9cff);
    b {
      width: calc(100% - 100px);
      color: #f8f7fa;
      text-indent: 5px;
    }
    .van-button {
      width: 100px;
      letter-spacing: 2px;
    }
  }
  .all,
  .box {
    background-color: #fff;
    border-radius: 15px;
    padding: 15px;
    box-sizing: border-box;
    h5 {
      text-align: center;
      font-weight: 650;
      line-height: 1.2;
      font-size: 20px;
      padding: 15px 0 20px;
    }
    p {
      line-height: 1.6;
      font-size: 15px;
      position: relative;
      z-index: 6;
    }
    h6 {
      position: relative;
      font-weight: 650;
      padding: 8px;
      line-height: 20px;
      margin-bottom: 8px;
      .icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        display: inline-block;
        border-radius: 50%;
        // background-color: #f8f7fa;
        overflow: hidden;
        transform: scale(1.2);
        margin-right: 10px;
      }
    }
    li {
      position: relative;
      & + li {
        margin-top: 12px;
      }
    }
    .status {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 70px;
      height: 70px;
      z-index: 5;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .box {
    margin-top: 12px;
  }
}
iframe {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
