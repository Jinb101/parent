<template>
  <v-view @on-view="onview"
          bar
          footbar
          index="500">
    <x-header :color="$theme.color"></x-header>
    <x-content></x-content>
    <x-content>
      <div class="user_box head flex">
        <span class="tag"
              @click="ontovippath"
              v-if="isbabyvip">
          <template v-if="vipday > 0"> 剩余{{ vipday }}天 </template>
          <template v-else> 已过期 </template>
        </span>
        <div class="avatar"
             @click.stop="appPath('/user_info')">
          <van-image :src="user.avatar"></van-image>
        </div>
        <div class="strong"
             @click.stop="onpathtobind">
          <h2>
            {{ user.nickname }}
            <van-tag v-if="authorjob"
                     type="primary">{{ authorjob }}</van-tag>
          </h2>
          <p class="account">
            <b>{{ isbind.text }}</b>
          </p>
        </div>
      </div>
    </x-content>
    <x-content>
      <div class="user_box menu">
        <span v-if="menulist.length > 1 && swipeindex < menulist.length - 1"
              class="scrollhand">左滑查看更多功能</span>
        <van-swipe :loop="false"
                   :show-indicators="menulist.length > 1"
                   @change="onswipechange">
          <template #indicator>
            <div class="swipe_dot"
                 v-if="menulist.length > 1">
              <span v-for="(s, w) in menulist"
                    :key="w + '-dot'"
                    :class="{ active: swipeindex === w }">
              </span>
            </div>
          </template>
          <van-swipe-item v-for="(x, y) in menulist"
                          :key="y + 'y'">
            <v-m v-model="menulist[y]"
                 @change="onMenu"></v-m>
          </van-swipe-item>
        </van-swipe>
      </div>
    </x-content>
    <x-content>
      <div class="list_menu">
        <van-cell :title="i.t"
                  is-link
                  v-for="(i, j) in listmenu"
                  :key="j + 'lm'"
                  :value="i.v ? i.v : ''"
                  @click="onlistmenu(i)"></van-cell>
      </div>
    </x-content>
    <x-content>
      <div class="exit">
        <van-button block
                    plain
                    type="danger"
                    round
                    @click="onExit">
          <b class="col_danger">{{ isTulis ? "去登陆" : '退出登录' }}</b>
        </van-button>
      </div>
    </x-content>
    <template #fixed>
      <v-fixed v-model="open"
               text="切换宝宝"
               index="600"
               :footer="false">
        <template #menu>
          <span class="col_green"
                @click="appPath('/bind_baby/0')">绑定新的</span>
        </template>
        <v-c :user="user"></v-c>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vM from "../newpublic/menu.vue";
import vC from "./check_baby.vue";
export default {
  data() {
    return {
      user: {},
      baby: {},
      tab: [],
      nav: [],
      swipeindex: 0,
      tel: "",
      pid: "",
      swipernum: 12,
      open: false,
      isTulis: false,
      listmenu: [
        { t: "联系客服", v: "", n: "tel" },
        { t: "切换宝宝", n: "baby" },
        // { t: "食材小店", n: "food" },
        { t: "设置", n: "system" },
      ],
      menuLeveList: [],
      isbabyvip: false,
    };
  },
  inject: ["appPath"],
  components: { vM, vC },
  computed: {
    authorjob() {
      let a = this.user.guardian;
      let s = "";
      switch (+a) {
        case 1:
          s = "主监护人";
          break;
        case 2:
          s = "副监护人";
          break;
        default:
      }
      return s;
    },
    isbind() {
      let num = +this.user.is_it_bound;
      let t = ["未绑定", "待审核", "已通过", "已驳回"][num];
      let o = {
        num,
        text: t,
      };
      if (+num === 2) {
        o.text = [this.baby.class_name || "", this.baby.name].join(" ");
      }
      return o;
    },
    vipday() {
      let e = this.user;
      return e.bind_is_expire * 1 ? 0 : Math.floor(e.bind_last_day || 0);
    },
    menulist() {
      console.log(this.nav, this.swipernum, '----');
      if (this.nav.length > this.swipernum) {
        // eslint-disable-next-line
        return demo
          .array(JSON.parse(JSON.stringify(this.nav)))
          .chunk(this.swipernum);
      }
      return [this.nav];
    },
  },
  watch: {
    'menuLeveList.length': {
      handler(v) {
        if (v > 0) {
          // 艺体中心判断
          // 找到 key 为 eurhythmics 的对象
          let index = this.menuLeveList
            .map((s, v) => {
              return { f: s.key === "eurhythmics", v };
            })
            .filter((s) => {
              return s.f;
            })[0].v;
          // 判断 switch 0 开启 1 关闭
          if (this.menuLeveList[index].switch === 1) {
            // 删除 tab 中 path === 'art_style' 的对象
            this.$nextTick(() => {
              this.nav = this.nav.filter((r) => {
                return r.path !== "/art_style";
              });
            });
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    onlistmenu(e) {
      this.onMenu({ path: "to:" + e.n });
    },
    onExit() {
      if (this.isTulis) {
        this.appPath("/login");
        return
      }
      this.$model.model("是否退出登录", "", (res) => {
        if (res) {
          this.$api.exit();
          this.$model.info("退出成功", 2);
          this.$demo.$local.set("login-status-type", false);
          this.appPath("/login");
        }
      });
    },
    onpathtobind() {
      let n = this.isbind.num;
      if (+n === 2) {
        return this.appPath("/user_baby_info");
      }
      this.appPath("/bind_baby/" + (+n === 3 ? 2 : n));
    },
    ontovippath() {
      if (!this.baby.no) {
        this.appPath("/bind_baby/0");
        return this.$model.info("请先绑定宝贝", 2);
      }
      // if (this.vipday > 0) return 0;
      this.$api.http("user", {}, (r) => {
        let s = +r.guardian === 1;
        let d = +r.guardian_pay_fee === 2;
        console.log(s, d);
        if (!s && d) {
          return this.$model.info("不可缴费，主监护人未完成缴费", 2);
        }
        this.appPath("/pay_renew");
      });
    },
    onswipechange(e) {
      this.swipeindex = e;
    },
    onMenu(e) {
      let path = e.path;
      if (path) {
        let a = path.split("to:");
        if (a.length > 1) {
          switch (a[1]) {
            case "food":
              this.onToFood();
              break;
            case "baby":
              this.open = true;
              break;
            case "system":
              this.appPath("/system");
              break;
            case "tel":
              if (this.tel) {
                // eslint-disable-next-line
                siteConfig().tel(this.tel);
              }
              break;
            default:
          }
        } else {
          this.appPath(path);
        }
      }
    },
    checklevel(flag, level, fn) {
      if (!flag) {
        this.tab = this.tab.filter((r) => {
          return r.level !== level;
        });
      } else {
        // eslint-disable-next-line no-unused-expressions
        fn ? fn() : null;
      }
    },
    onview(e) {
      this.$api.http("newmenulevel", {}, (e) => {
        this.menuLeveList = e;
      });
      this.user = e.user || {};
      this.baby = e.baby || {};
      this.tel = (e.config || {}).tel;
      this.pid = this.user.n_id;
      this.tab = this.$js.def.user2;
      console.log(this.$js.def.user2, 'this.$js.def.user2');
      if (this.tel) {
        this.$set(this.listmenu[0], "v", this.tel);
      }
      let val = e.validate;

      // 监护人判断
      this.checklevel(+this.user.guardian === 1, 4);
      // 宝贝在线续费判断
      this.checklevel(this.user.bind_last_day <= 0, 5);

      // 缴费判断
      this.checklevel(+this.user.show_payment === 2, 3, () => {
        try {
          let index = this.tab
            .map((s, v) => {
              return { f: s.level === 3, v };
            })
            .filter((s) => {
              return s.f;
            })[0].v;
          this.$api.http("payDot", {}, (e) => {
            if (e >= 1) {
              this.$set(this.nav[index], "num", e);
            }
          });
        } catch (err) { }
      });
      // 喂药
      this.checklevel(this.baby.no, 2);
      // 完善宝贝信息
      this.checklevel(+this.user.c_id !== 0, 1);

      // 家庭教育订单/收货地址/招生动态
      this.checklevel(+this.pid === 7, 9);
      this.checklevel(+this.pid === 7, 12);
      this.checklevel(+this.pid === 7, 14);
      this.checklevel(+this.pid === 7, 16);
      // 微信绑定
      this.checklevel(this.$demo.es6().isWx(), 11);

      // 宝贝在线
      this.checklevel(val.t0, 5);
      // 喂药管理
      this.checklevel(val.t2, 2);
      this.checklevel(val.t16, 3);
      this.checklevel(val.t17, 6);
      this.checklevel(val.t18, 8);
      this.checklevel(val.t19, 15);

      this.isbabyvip = val.t0;
      this.nav = this.tab;
    },
    onToFood() {
      // eslint-disable-next-line
      let v = demo.es6().encrypt(
        {
          token: this.$demo.$local.get("token"),
          id: this.$demo.$local.get("nid"),
          type: "web",
          // page: "detail/62",
          local: "youeryuanweb" + this.user.n_id,
          old: "true",
        },
        "food"
      );
      window.location.replace(this.$js.api.h5 + "h5/foods/?h5=" + v);
    },
  },
  mounted() {
    if (window.location.href.indexOf("tulis") > -1) {
      this.isTulis = true;
    } else {
      this.isTulis = false;
    }
  },
};
</script>
<style lang='less'
       scoped>
      .scrollhand {
        position: absolute;
        right: 0;
        font-size: 12px;
        top: 0;
        color: #868686;
        padding: 5px;
        border-radius: 5px 0 0 5px;
      }

      .user_box {
        background-color: #fff;
        border-radius: 8px;
        position: relative;
        font-size: 16px;
        overflow: hidden;
      }

      .head {
        padding: 10px;

        .avatar {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 0 10px #f7f7f7;
        }

        .strong {
          width: calc(100% - 65px);
          padding-left: 10px;
          padding-top: 8px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          flex-direction: column;

          h2 {
            padding: 5px 0;
            font-weight: 650;
            color: #232323;

            b {
              font-weight: 400;
              font-size: 12px;
              padding-left: 8px;
              color: #999;
            }
          }

          .account {
            padding: 5px 0;
            font-size: 15px;
          }
        }

        .tag {
          position: absolute;
          font-size: 12px;
          padding: 5px 10px;
          color: #fff;
          background: linear-gradient(45deg, rgb(255, 83, 1), rgb(248, 180, 119));
          right: 0;
          top: 10px;
          border-radius: 10px 0 0 10px;
        }

        .head_cover {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50px;
        }
      }

      .menu {
        padding: 10px 0;
      }

      .swipe_dot {
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          width: 10px;
          height: 5px;
          transition: all 0.5s;
          background-color: #f0f0f0;
          border-radius: 5px;

          &.active {
            background-color: #fb8639;
          }
        }
      }

      .exit {
        padding: 25px 8%;
        box-sizing: border-box;
      }

      .list_menu {
        .van-cell {
          margin: 2px 0;
        }
      }
    </style>
