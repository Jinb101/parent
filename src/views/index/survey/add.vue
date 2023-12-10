<template>
  <div class="survey_add">
    <v-tool-title></v-tool-title>
    <div class="view">
      <van-tabs v-model="val" swipeable>
        <van-tab v-for="(i, j) in item" :key="j + '-s'" title="">
          <p class="head">
            <span class="tag">{{ i.text }}</span>
            <b>{{ j + 1 }}、</b>
            <span class="name">{{ i.name }}</span>
          </p>
          <div v-if="i.status" class="cont">
            <sapn class="cover" v-if="det"></sapn>
            <van-field
              v-model="i.message"
              rows="4"
              autosize
              type="textarea"
              placeholder="请输入回答"
              maxlength="125"
              show-word-limit
            />
          </div>
          <div v-else class="cont">
            <sapn class="cover" v-if="det"></sapn>
            <van-radio-group v-model="i.value">
              <van-radio
                :name="x.index"
                v-for="(x, y) in i.list"
                :key="y + '-s'"
                >{{ x.name }}</van-radio
              >
            </van-radio-group>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="btns flex">
      <div class="l">
        <van-button @click="onPrev" size="small">上一题</van-button>
      </div>
      <div class="b">
        <van-button @click="onSub" type="primary" round v-if="!det">
          确认提交
        </van-button>
      </div>
      <div class="r">
        <van-button @click="onNext" size="small">下一题</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    det: { type: Boolean, default: false },
  },
  data() {
    return {
      params: {},
      item: [],
      val: "",
    };
  },
  inject: ["appBack"],
  methods: {
    onPrev() {
      let n = this.val - 1;
      this.val = n < 0 ? this.item.length - 1 : n;
    },
    onNext() {
      let n = this.val + 1;
      this.val = n >= this.item.length ? 0 : n;
    },
    onSub() {
      let answer = this.item
        .map((r) => {
          return r.status ? r.message : r.value;
        })
        .filter((s) => {
          return !!s;
        });
      if (answer.length !== this.item.length) {
        return this.$model.info("未填写完整", 2);
      }
      answer = answer.join(",");
      let os = {
        f_id: this.params.id,
        r_id: this.params.rid,
        t_id: this.item
          .map((s) => {
            return s.id;
          })
          .join(","),
        answer,
      };
      this.$api.http("feedBackAdd", os, () => {
        this.$model.info("提交成功", 2);
        this.appBack(1);
      });
    },
    init() {
      this.$api.http(
        "feedBackDetail",
        { f_id: this.params.id, r_id: this.params.rid },
        (e) => {
          this.item = e.map((s) => {
            let os = {
              name: s.name,
              id: s.id,
              fid: s.f_id,
              rid: s.r_id,
              status: s.type === 2,
              list: [],
              message: s.answer,
              value: s.answer,
            };
            os.text = os.status ? "问答题" : "选择题";
            if (os.status) {
              os.message = s.answer;
            } else {
              if (s.a) {
                os.list.push({ name: s.a, value: s.score_a, index: "a" });
              }
              if (s.b) {
                os.list.push({ name: s.b, value: s.score_b, index: "b" });
              }
              if (s.c) {
                os.list.push({ name: s.c, value: s.score_c, index: "c" });
              }
              if (s.d) {
                os.list.push({ name: s.d, value: s.score_d, index: "d" });
              }
            }
            return os;
          });
        }
      );
    },
  },
  mounted() {
    this.params = this.$route.params;
    this.init();
  },
};
</script>

<style lang='less'>
.survey_add {
  .van-tabs--line .van-tabs__wrap {
    height: 0;
  }
  .van-tabs__content,
  .van-tab__pane,
  .van-tabs {
    height: 100%;
  }
}
</style>
<style lang='less' scoped>
.survey_add {
  .view {
    height: calc(100% - 106px);
  }
  .btns {
    height: 60px;
    padding: 8px 15px;
    box-sizing: border-box;
    .l,
    .r {
      box-sizing: border-box;
      padding-top: 8px;
    }
    .r {
      text-align: right;
    }
    .b {
      flex: 1;
    }
    .van-button {
      margin: 0 auto;
      display: block;
      min-width: 60%;
    }
  }
  .cont {
    padding: 10px;
    position: relative;
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 15;
    }
  }
  .van-radio {
    margin-bottom: 20px;
  }
  .head {
    padding: 10px;
    font-size: 15px;
    .tag {
      color: orange;
      font-size: 13px;
      border: 1px solid orange;
      padding: 5px;
      border-radius: 5px;
      transform: scale(0.8);
      display: inline-block;
    }
    b,
    .name {
      line-height: 30px;
      font-weight: 650;
    }
  }
}
</style>
