<template>
  <v-view retreat index="500" ref="views">
    <div class="cover_bgc"><img :src="cover" alt="" /></div>
    <template v-if="open">
      <span v-if="isopenmenu" class="top_right_btn" @click="onlock({})"
        >解锁/激活</span
      >
      <v-t class="leftmenu" :item="menu" v-model="type"></v-t>
      <div class="content_view">
        <div class="app_top" style="z-index: 600">
          <template v-if="menu1.length">
            <v-t
              class="menu1 flex"
              v-model="type1"
              dire="x"
              :item="menu1"
              :icon="[601, 603]"
            ></v-t>
            <v-t
              class="menu2 flex"
              v-model="type2"
              dire="x"
              :item="menu2"
              small
              :icon="[600, 602]"
            ></v-t>
          </template>
        </div>
        <v-page ref="page" @on-page="onPage">
          <van-empty v-if="!item.length"></van-empty>
          <ul>
            <li
              v-for="(i, j) in item"
              :key="j + 'l'"
              @click="ondetail(i)"
              :class="[
                { status: +i.status === 1 },
                { active: toclickdata(i) === 2 },
                { success: toclickdata(i) === 1 },
              ]"
            >
              <div class="logo">
                <img
                  :src="toimgs(i.parent_cover_picture, j)"
                  alt=""
                  class="db_image"
                />
              </div>
              <div class="text">
                <h2>
                  <div class="ico">
                    <img :src="icons(502)" alt="" class="db_image" /><b>{{
                      totypestext(i.types)
                    }}</b>
                  </div>
                  <b>{{ i.types }}</b>
                </h2>
                <p>{{ i.name }}</p>
              </div>
              <div class="right_btn" @click.stop>
                <span v-if="toclickdata(i) !== 0" @click.stop="onview(i)">
                  <img :src="icons(503)" alt="" />
                  <b>预览</b>
                </span>
                <span v-if="toclickdata(i) === 2" @click.stop="onclock(i)">
                  <img :src="icons(504)" alt="" />
                  <b>打卡</b>
                </span>
                <span v-if="toclickdata(i) === 0" @click.stop="onlock(i)">
                  <img :src="icons(505)" alt="" />
                  <b>解锁</b>
                </span>
              </div>
            </li>
          </ul>
        </v-page>
      </div>
    </template>
    <template v-else>
      <van-empty description="未开通功能"></van-empty>
    </template>
    <template #fixed>
      <v-fixed v-model="open1" index="600" retreat :header="false">
        <v-d
          v-model="detail"
          :save="icons(504)"
          @ondet="ondetailchild"
          @send="onsendchild"
          @error="open1 = false"
          @showshare="onshowshare"
          @showlog="onshowlog"
          ref="det"
        ></v-d>
      </v-fixed>
      <v-fixed v-model="open2" index="610">
        <v-c
          :ext="detail2"
          @likes="onendlike"
          @end="onenddel"
          @comments="onendcomment"
        ></v-c>
      </v-fixed>
      <v-fixed v-model="open3" index="620">
        <v-s v-model="sendext" @end="onsendend"></v-s>
      </v-fixed>
      <v-fixed v-model="open4" index="630" :header="false" retreat>
        <v-p v-model="viewext"></v-p>
      </v-fixed>
      <v-fixed v-model="open5" index="640">
        <div class="lock_box">
          <van-field
            v-model="lock.account"
            label="账号"
            placeholder="请输入激活码账号"
            label-width="3em"
          />
          <van-field
            v-model="lock.code"
            label="秘钥"
            placeholder="请输入激活码秘钥"
            label-width="3em"
          />
          <van-button block round type="info" @click="onlocksend"
            >激活</van-button
          >
        </div>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vT from "./_tab.vue";
import vD from "./detail.vue";
import vC from "./child_detail.vue";
import vS from "./send.vue";
import vP from "./preview.vue";
export default {
  data() {
    return {
      params: {},
      oncestatus: false,
      detailid: "",
      open: false,
      type: "",
      cover: "",
      type1: "",
      type2: "",
      item: [],
      open1: false, // 详情
      detail: {},
      open2: false, // 详情->打卡 详情
      detail2: {},
      open3: false, // 打卡
      sendext: {},
      open4: false, // 预览
      viewext: "",
      open5: false, // 解锁
      lockext: {},
      lock: { account: "", code: "" },
    };
  },
  inject: ["appPath"],
  components: { vT, vD, vC, vS, vP },
  watch: {
    type() {
      if (this.oncestatus) {
        this.type1 = "";
        setTimeout(() => {
          this.type1 = this.menu1[0].id;
        }, 200);
      }
    },
    type1() {
      if (this.oncestatus) {
        this.type2 = "";
        setTimeout(() => {
          this.type2 = this.menu2[0].id;
        }, 200);
      }
    },
    type2() {
      this.onPage(1);
    },
    typepath(n) {
      if (this.oncestatus) {
        if (n) {
          this.appPath("/chant/" + n, true);
        }
      }
    },
    open1(n) {
      if (!n) {
        this.detailid = "";
        this.appPath("/chant/" + this.typepath, true);
      }
    },
  },
  computed: {
    menu1() {
      if (!this.open) return [];
      let id = this.type;
      let arr = this.menu;
      if (arr && arr.length) {
        arr =
          arr.filter((r) => {
            return r.id === +id;
          })[0] || {};
        return arr.children || [];
      }
      return [];
    },
    menu2() {
      if (!this.open) return [];
      if (!this.menu1.length) return [];
      let id = this.type1;
      let arr = this.menu1;
      if (arr && arr.length) {
        arr =
          arr.filter((r) => {
            return r.id === +id;
          })[0] || {};
        return arr.children || [];
      }
      return [];
    },
    typepath() {
      let u = [this.type, this.type1, this.type2];
      let e = u.filter((r) => {
        return r !== "";
      });
      if (u.length === e.length) {
        return u.join("&");
      }
      return "";
    },
    isopenmenu() {
      if (!this.menu1.length) return false;
      if (!this.type1) return false;
      let a = this.type1;
      let b =
        this.menu1.filter((r) => {
          return r.id === +a;
        })[0] || {};
      if (!b.id) return false;
      return +b.status === 0;
    },
  },
  methods: {
    onshowlog(e, v) {
      this.viewext = this.$js.frametoh5page(
        "media",
        {
          country_study_id: v.country_study_id,
          s_type: +e === 1 ? "mp3" : "mp4",
          s_head: true,
        },
        "chantdet"
      );
      this.open4 = true;
    },
    onlocksend() {
      if (this.lock.account === "") return this.$toast("请输入激活码账号");
      if (this.lock.code === "") return this.$toast("请输入激活码秘钥");

      this.lock.account = this.lock.account
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "");
      this.lock.code = this.lock.code
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "");

      this.$api.http("a2023042611", this.lock, () => {
        this.$toast("激活成功");
        this.open5 = false;
        this.$nextTick(() => {
          this.onceinit();
          this.onPage(1);
        });
      });
    },
    onlock(e) {
      this.open1 = false;
      this.lockext = e;
      this.open5 = true;
    },
    onshowshare() {
      this.$refs.views.$share();
    },
    onendlike(give, likecount, id) {
      if (this.$refs.det) {
        this.$refs.det.setlikes(give, likecount, id);
      }
    },
    onenddel(id) {
      if (this.$refs.det) {
        this.$refs.det.setdels(id);
      }
      this.open2 = false;
    },
    onendcomment(e, id) {
      if (this.$refs.det) {
        this.$refs.det.setcomments(e, id);
      }
    },
    // 进入触发
    onceinit() {
      this.$api.http("a2023042601", {}, (r) => {
        this.menu = r.classify;
        this.open = r.classify.length > 0;
        let o =
          (this.menu || []).filter((s) => {
            return +s.type === +r.grade;
          })[0] || {};
        let sid = this.$js.def.semester.semester;
        let s =
          (o.children || []).filter((r) => {
            return +r.school_term === sid;
          })[0] || {};
        this.$nextTick(() => {
          if (this.params.classid) {
            this.type = this.params.classid;
          } else {
            this.type = o.id || this.menu[0].id;
          }
          if (this.params.typeid) {
            this.type1 = this.params.typeid;
          } else {
            this.type1 = s.id || this.menu1[0].id;
          }
          if (this.params.tabid) {
            this.type2 = this.params.tabid;
          } else {
            this.type2 = this.menu2[0].id;
          }
          if (this.params.detailid) {
            this.ondetail({
              country_study_id: this.params.detailid,
              page: true,
            });
          }
          setTimeout(() => {
            this.oncestatus = true;
          }, 200);
        });
      });
    },
    // 打卡
    onclock(e) {
      this.onsendchild({
        country_study_class_id: e.country_study_class.country_study_class_id,
        video: "",
        content: "",
        type: e.country_study_class.country_study_child.length > 0 ? 1 : 2,
      });
    },
    // 预览
    onview(e) {
      this.viewext = this.$js.frametoh5page(
        "media",
        {
          country_study_id: e.country_study_id,
          s_head: true,
        },
        "chantdet"
      );
      this.open4 = true;
      // this.$api.http(
      //   "a2023042603",
      //   { country_study_id: e.country_study_id },
      //   (r) => {
      //     // console.log(r);
      //     // if (r.classify && r.classify.status === 0) {
      //     //   this.$toast("功能未开通");
      //     //   this.$emit("error");
      //     //   return 0;
      //     // }
      //     // this.viewext = r;
      //     this.open4 = true;
      //   }
      // );
    },
    onsendend() {
      this.open3 = false;
      this.onPage(1);
      if (this.$refs.det) {
        this.$refs.det.init();
      }
    },
    onsendchild(e) {
      this.sendext = e;
      this.open3 = true;
    },
    ondetailchild(e) {
      this.detail2 = e;
      this.open2 = true;
    },
    totypestext(e) {
      let arr = [
        "",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
        "十三",
        "十四",
        "十五",
        "十六",
        "十七",
        "十八",
        "十九",
        "二十",
      ]
        .map((s, v) => {
          return {
            s,
            v,
          };
        })
        .filter((r) => {
          return (e + "").indexOf(r.s) >= 0 && r.v > 0;
        });
      if (arr.length) {
        return arr[arr.length - 1].v;
      }
      return 0;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "a2023042602",
        { page, class_id: this.type, classify_id: this.type2 },
        (e) => {
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
          // country_study_class 为null时 不显示打卡按钮与状态
        }
      );
    },
    toclickdata(i) {
      if (i.classify && i.classify.status === 0) return 0;
      if (i.country_study_class === null) return 3;
      let a = i.country_study_class;
      if (a.country_study_child && a.country_study_child.length > 0) {
        return 1;
      }
      return 2;
    },
    toimgs(src, index) {
      // if (src) return src;
      return this.icons((index % 24) + 1);
    },
    icons(name) {
      // eslint-disable-next-line
      return siteConfig().icon(name, "parent");
    },
    ondetail(e) {
      this.detail = e;
      if (typeof e.classify === "object") {
        if (e.classify.status === 0) {
          this.$toast("功能未开通,您需要激活才能使用");
          this.onlock(e);
          return 0;
        }
      }
      this.detailid = e.country_study_id;
      this.appPath("/chant/" + this.typepath + "&" + this.detailid, true);
      this.$nextTick(() => {
        this.open1 = true;
      });
    },
  },
  mounted() {
    this.params = this.$route.params;
    this.onceinit();
    this.cover = this.icons(0);
  },
};
</script>
<style lang='less' scoped>
.cover_bgc {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100vw;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    filter: blur(2px);
    content: "";
  }
}
.leftmenu {
  position: fixed;
  left: 0;
  top: 44px;
  width: 100px;
  z-index: 55;
  padding: 10px 0;
}
.content_view {
  box-sizing: border-box;
  padding: 54px 5px 10px 110px;
  font-size: 16px;
  position: relative;
  z-index: 20;
  li {
    margin-top: 12px;
    position: relative;
    box-sizing: border-box;
    padding: 5px 0 10px;
    display: flex;
    align-items: center;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      opacity: 0.4;
      content: "";
      z-index: 50;
      border-radius: 15px;
    }
    &.status {
      &::before {
        background: #fffda0;
      }
    }
    &.active {
      // 未打卡
      &::before {
        background: #ff8349;
      }
    }
    &.success {
      &::before {
        background-color: #20f7c9;
      }
    }
    .right_btn {
      position: absolute;
      right: 5px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 66;
      bottom: 0;
      margin: auto;
      span {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(0.65);
        img {
          width: 40px;
          height: 40px;
        }
        b {
          font-size: 15px;
          line-height: 1.5;
          letter-spacing: 2px;
          // font-weight: 650;
        }
      }
    }
    .logo {
      position: relative;
      z-index: 51;
      width: 60px;
      height: 60px;
      transform: scale(0.8);
    }
    .text {
      width: calc(100% - 60px);
      position: relative;
      z-index: 51;
      > p {
        box-sizing: border-box;
        word-break: break-all;
        padding: 0 90px 0 12px;
        line-height: 1.2;
      }
      h2 {
        height: 40px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 15px;
        > b {
          transform: translateX(-5px);
        }
        .ico {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.45);
          img {
            left: 0;
            top: 0;
            position: absolute;
          }
          b {
            position: relative;
            z-index: 55;
            transform: translateY(5px);
          }
        }
      }
    }
  }
}
.menu2 {
  margin-top: 8px;
}
.lock_box {
  box-sizing: border-box;
  padding: 10px 0;
  .van-button {
    margin: 15px 15%;
    width: 70%;
  }
  .van-cell {
    margin-top: 8px;
  }
}
.top_right_btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 40px;
  z-index: 55;
  line-height: 40px;
  font-size: 14px;
  padding: 0 10px;
}
</style>
