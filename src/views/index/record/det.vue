<template>
  <div class="det">
    <div class="view_box">
      <div class="v_box flex">
        <span class="f1">日期：{{ toTime(ext.record_date) }}</span>
        <span class="f1 r">姓名：{{ ext.name }}</span>
      </div>
    </div>
    <van-empty v-if="!item.length"></van-empty>
    <div class="view_box" v-for="(i, j) in item" :key="j">
      <div class="head">
        <van-image :src="image.head" fit="cover"></van-image>
        <p>{{ i.title }}</p>
      </div>
      <template v-if="+i.sub === 2">
        <div class="v_box">
          <template v-if="isadd">
            <van-field
              v-model="i.value"
              rows="3"
              autosize
              type="textarea"
              placeholder="请输入特殊叮嘱"
              show-word-limit
              maxlength="255"
            />
          </template>
          <template v-else>
            <div class="textarea">
              {{ i.value || "暂无" }}
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="v_box" :class="{ noedit: i.type !== 'textarea' }">
          <template v-if="i.item && i.item.length">
            <section v-for="(x, y) in i.item" :key="y + '-' + j">
              <h6 v-if="x.title">{{ x.title }}</h6>
              <div v-for="(q, w) in x.list" :key="w + '-' + y + '-' + j">
                <h5 v-if="q.title">{{ q.title }}</h5>
                <div class="flex fw">
                  <van-tag
                    plain
                    type="default"
                    round
                    v-for="(r, t) in q.children"
                    :key="t + '-' + w + '-' + y + '-' + j"
                    :class="{ active: q.value === r.title }"
                    >{{ r.title }}</van-tag
                  >
                  <template>
                    <van-tag
                      class="active"
                      plain
                      type="default"
                      round
                      v-if="q.search"
                      >{{ q.search }}</van-tag
                    >
                  </template>
                </div>
              </div>
            </section>
          </template>
          <template v-else-if="i.type === 'textarea'">
            <div class="textarea">
              {{ i.value || "暂无" }}
            </div>
            <h6>
              {{ i.label }} <span>{{ i.hand ? "[已签字]" : "" }}</span>
            </h6>
            <template v-if="i.hand">
              <div class="hand_img">
                <van-image
                  :src="i.hand"
                  @click="appShowImage(i.hand)"
                ></van-image>
              </div>
            </template>
          </template>
        </div>
      </template>
    </div>
    <div class="view_box foot">
      <van-button block round type="primary" @click="onsubmit" v-if="isadd"
        >提交</van-button
      >
    </div>
    <div class="footer_image">
      <van-image :src="image.foot"></van-image>
    </div>
  </div>
</template>

<script>
const icons = (name) => {
  return "https://jsxrk.jsxrk.xin/500/icon/private/" + name + ".png";
};
export default {
  props: {
    value: null,
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  inject: ["appTimeout", "appShowImage"],
  watch: {
    ext: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  data() {
    return {
      item: [],
      image: {
        head: icons("connection_header"),
        foot: icons("connection_foot"),
      },
      isadd: false,
    };
  },
  methods: {
    toTime(e) {
      if (isNaN(e)) {
        return e;
      }
      return this.appTimeout(e, "ymd");
    },
    init() {
      if (this.ext.content) {
        try {
          this.item = JSON.parse(this.ext.content);
          let v = this.item.filter((r) => {
            return +r.sub === 2;
          });
          this.isadd = v[0].value === "";
        } catch (err) {}
      }
    },
    onsubmit() {
      let os = {
        record_date: this.toTime(this.ext.record_date),
        content: JSON.stringify(this.item),
        parent_signature: "",
        park_records_id: this.ext.park_records_id,
      };
      this.$api.http("a2023030803", os, () => {
        this.$toast("录入成功");
        this.isadd = false;
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.det {
  position: relative;
  min-height: 100%;
  .view_box {
    padding: 17px 13px;
    box-sizing: border-box;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        rgba(253, 220, 159, 0.2),
        rgba(169, 215, 255, 0.2)
      );
    }
    &:nth-child(2n) {
      &::before {
        background: linear-gradient(
          rgba(169, 215, 255, 0.2),
          rgba(253, 220, 159, 0.2)
        );
      }
    }
    .head {
      width: 195px;
      margin: 0 auto 15px;
      padding: 10px 0;
      position: relative;
      .van-image {
        position: absolute;
        left: 0;
        top: 0;
      }
      line-height: 15px;
      font-size: 14px;
      color: #fff;
      box-sizing: border-box;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      > p {
        position: relative;
        z-index: 15;
        text-indent: -10px;
        letter-spacing: 1px;
      }
    }
    .v_box {
      padding: 20px 17px;
      position: relative;
      z-index: 20;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      background-color: #fff;
      font-size: 13px;
      &.flex {
        .f1 {
          font-weight: 650;
          flex: 1;
          &.r {
            text-align: right;
          }
        }
      }
      .van-tag {
        padding: 5px 15px;
        margin: 0 25px 15px 0;
        cursor: pointer;
        min-width: 70px;
        box-sizing: border-box;
        justify-content: center;
        &.active {
          background: rgba(25, 137, 250, 0.1);
          color: #1989fa;
          border-color: #1989fa;
        }
      }
      .inp {
        height: 26px;
        border-radius: 13px;
        box-sizing: border-box;
        line-height: 24px;
        padding: 0 10px;
        width: 130px;
      }
      &::before {
        position: absolute;
        content: "";
        z-index: -1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      &.noedit::before {
        z-index: 50;
      }
    }
    &.foot {
      padding: 5px 10% 90px;
    }
  }
  .textarea {
    padding-bottom: 10px;
  }
  h6 {
    padding: 5px 0;
    margin-bottom: 5px;
    font-weight: 600;
    color: #838c95;
    font-size: 13px;
  }
  section h6 {
    margin-top: 10px;
  }
  h5 {
    font-size: 11px;
    margin-bottom: 15px;
    color: #80c1fb;
    & + div {
      padding-bottom: 10px;
    }
  }
  .hand_img {
    height: 198px;
    & + .van-button {
      margin-top: 8px;
      min-width: 80px;
    }
  }
  .footer_image {
    height: 76px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 50;
  }
}
</style>
