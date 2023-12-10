<template>
  <div class="class_child">
    <div class="cover">
      <!-- <div class="avatar"></div> -->
      <h2>Ta的班级圈</h2>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j" class="flex" @click="onshow(i)">
        <div class="day" :class="toDay(i.release_time).v">
          {{ toDay(i.release_time).t }}
        </div>
        <div class="strong">
          <!-- 图文 -->
          <template v-if="+i.type === 1 && i.imgs.length > 0">
            <div class="flex">
              <div class="logo">
                <van-image :src="i.imgs[0].img" fit="cover"></van-image>
              </div>
              <div class="text">
                <b v-html="i.content || '点击查看更多'"></b>
              </div>
            </div>
          </template>
          <!-- 视频 -->
          <template v-else-if="+i.type === 2">
            <div class="flex">
              <div class="logo">
                <span class="play">
                  <van-image
                    :src="i.imgs[0].cover"
                    v-if="i.imgs[0] && i.imgs[0].cover"
                    class="img"
                  ></van-image>
                  <van-icon name="play-circle-o" />
                </span>
              </div>
              <div class="text">
                <b><p>视频朋友圈</p> </b>
              </div>
            </div>
          </template>
          <!-- 纯文字 -->
          <template v-else>
            <div class="text van-multi-ellipsis--l3">
              <b v-html="i.content"></b>
            </div>
          </template>
        </div>
      </section>
    </v-page>
  </div>
</template>

<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      item: [],
    };
  },
  computed: {
    id: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    id(n) {
      this.$emit("input", n);
    },
  },
  methods: {
    onshow(e) {
      this.$emit("change", e);
    },
    toDay(time) {
      let ts = Date.now();
      let day = 864e5;
      if (time <= 0) return "";
      if (time.length === 10) {
        time *= 1000;
      }
      if (time > ts) return "刚刚";
      // eslint-disable-next-line
      let t = demo.timeout(time, "object");
      // eslint-disable-next-line
      let zero = demo.timeout("", "zero");
      if (time > zero) {
        return { t: "今天", v: "" };
      }
      if (time > zero - day) {
        return { t: "昨天", v: "" };
      }
      if (time > zero - day * 2) {
        return { t: "前天", v: "" };
      }
      if (ts - day * 30 < time) {
        return { t: parseInt((ts - time) / day) + "天前", v: "a1" };
      }
      if (new Date().getFullYear() > t.y) {
        return {
          t: [t.y - 2000, "年", t.m, "月", t.d, "日"].join(""),
          v: "a3",
        };
      }
      return { t: [t.m, "月", t.d, "日"].join(""), v: "a2" };
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("classmy", { user_id: this.id, page }, (r) => {
        this.item = this.item.concat(r);
        this.$refs.page.onFinish(r.length < 20);
      });
      // let res = ",,,,,,,,,,,,,".split(",").map((k, v) => {
      //   return {
      //     // eslint-disable-next-line
      //     time: v > 1 ? Date.now() - demo.rand(864e5, 864e7) : Date.now(),
      //   };
      // });
    },
  },
  mounted() {
    this.id = this.value;
  },
};
</script>
<style lang='less' scoped>
.class_child {
  .cover {
    height: 190px;
    background-color: #f7f7f7;
    position: relative;
    background: linear-gradient(45deg, #e3f9ed, #caebf0);
    z-index: 5;
    margin-bottom: 35px;
    .avatar {
      border-radius: 8px;
      width: 70px;
      height: 70px;
      overflow: hidden;
      background-color: #ccc;
      position: absolute;
      right: 10%;
      bottom: -35px;
    }
    h2 {
      position: absolute;
      bottom: 0;
      right: calc(80px + 10%);
      line-height: 35px;
      font-size: 15px;
    }
  }
}
section {
  padding: 10px 0;
  margin: 10px;
  .day {
    width: 80px;
    font-weight: 650;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.a1 {
      font-size: 19px;
    }
    &.a2 {
      font-size: 17px;
    }
    &.a3 {
      font-size: 15px;
    }
  }
  .strong {
    width: calc(100% - 80px);
    background-color: #f7f7f7;
    font-size: 14px;
    line-height: 1.2;
    .text {
      min-height: 40px;
      box-sizing: border-box;
      padding-left: 5px;
      display: flex;
      align-items: center;
    }
    > .flex {
      width: 100%;
      .logo {
        width: 60px;
        height: 60px;
        background-color: #ccc;
        position: relative;
        .play {
          position: absolute;
          z-index: 5;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #fff;
          .img {
            position: absolute;
            left: -15px;
            top: -15px;
            width: 200%;
            height: 200%;
          }
        }
      }
      .text {
        width: calc(100% - 60px);
        // box-sizing: border-box;
        // padding-left: 5px;
        // display: flex;
        // align-items: center;
      }
    }
  }
}
</style>
