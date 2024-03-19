<template>
  <v-view @on-view="onview" nologin bar footbar>
    <x-header :color="$theme.color"></x-header>
    <x-content></x-content>
    <x-content>
      <van-swipe :autoplay="3000" :stop-propagation="false" class="banner">
        <van-swipe-item
          v-for="(image, index) in banner"
          :key="index + '-banner'"
          @click="onbanner(image)"
        >
          <van-image :src="image.picture" fit="cover"></van-image>
        </van-swipe-item>
      </van-swipe>
    </x-content>
    <!-- 绑定微信 -->
    <x-content v-if="is_openid && iswx">
      <van-notice-bar
        color="#1989fa"
        background="#ecf9ff"
        left-icon="wechat"
        @click="appPath('/wx_bind')"
      >
        点击 - 绑定微信
      </van-notice-bar>
    </x-content>
    <x-content v-if="is_info">
      <van-notice-bar
        left-icon="volume-o"
        text="点击-完善宝贝信息"
        @click="appPath('/user_baby')"
      />
    </x-content>
    <x-content v-if="menu.length">
      <div class="semiellipse"></div>
      <div class="user_box menu">
        <van-swipe
          :loop="false"
          :show-indicators="menulist.length > 1"
          @change="onswipechange"
        >
          <template #indicator>
            <div class="swipe_dot" v-if="menulist.length > 1">
              <span
                v-for="(s, w) in menulist"
                :key="w + '-dot'"
                :class="{ active: swipeindex === w }"
              >
              </span>
            </div>
          </template>
          <van-swipe-item v-for="(x, y) in menulist" :key="y + 'y'">
            <v-m v-model="menulist[y]" @change="onMenu"></v-m>
          </van-swipe-item>
        </van-swipe>
      </div>
    </x-content>
    <!-- 咨询热线 -->
    <x-content v-if="tels.id">
      <div class="flex tels">
        <van-cell @click.stop="ontel(tels.contact)">
          <template #title>
            咨询热线：<b class="font">{{ tels.contact }}</b
            >({{ tels.contacts }})
          </template>
        </van-cell>
        <p class="location flex" @click.stop="onLocation">
          <b>导航</b>
          <van-icon name="location" color="#41cc6e" />
        </p>
      </div>
    </x-content>
    <x-content v-if="is_babyvideo">
      <x-box title="精彩瞬间">
        <template #icon>
          <van-image :src="$js.def.icon.like.icon" fit="cover"></van-image>
        </template>
        <template #btn>
          <van-button size="small" round @click="appPath('/cute')"
            >查看更多</van-button
          >
        </template>
        <v-video :item="cute" @on-detail="onCuteDetail" goods></v-video>
      </x-box>
    </x-content>
    <x-content v-if="is_infotext">
      <x-box title="园所资讯">
        <template #icon>
          <van-image :src="$js.def.icon.msg.icon" fit="cover"></van-image>
        </template>
        <template #btn>
          <van-button size="small" round @click="appPath('/info')"
            >查看更多</van-button
          >
        </template>
        <v-list :item="info"></v-list>
      </x-box>
    </x-content>
  </v-view>
</template>

<script>
import vM from "../newpublic/menu.vue";
import vVideo from "../private/video.vue";
import vList from "../private/list.vue";
export default {
  data() {
    return {
      banner: [],
      is_openid: false,
      is_info: false,
      islogin: false, // 是否登录
      is_babyvideo: false,
      is_infotext: true,
      tab: [],
      menu: [],
      swipernum: 12,
      swipeindex: 0,
      user: {},
      info: [],
      cute: [],
      tels: {},
      iswx: false,
      is10type: false,
    };
  },
  computed: {
    menulist() {
      if (this.menu.length > this.swipernum) {
        // eslint-disable-next-line
        return demo
          .array(JSON.parse(JSON.stringify(this.menu)))
          .chunk(this.swipernum);
      }
      return [this.menu];
    },
  },
  inject: ["appPath", "appisFoodShop", "appGetParams"],
  components: { vM, vVideo, vList },
  methods: {
    gettotype(o) {
      this.appPath(this.is10type ? o.url : "/record1");
    },
    ontel(e) {
      // eslint-disable-next-line
      siteConfig().tel(e);
    },
    onswipechange(e) {
      this.swipeindex = e;
    },
    checklevel(flag, level, fn) {
      if (!flag) {
        this.tab = this.tab.filter((r) => {
          return +r.type !== +level;
        });
      } else {
        // eslint-disable-next-line no-unused-expressions
        fn ? fn() : null;
      }
    },
    onview(e) {
      // console.log(e, 123, e.validate);
      this.islogin = (e.user || {}).id;
      console.log(e.user);
      this.tab = this.$js.def.indexRoute;
      console.log(this.tab);
      this.user = e.user || {};
      this.tels = (e.config || {}).nursery_ext || {};
      let val = e.validate;
      let name = (e.config || {}).name;
      if (name) {
        this.$demo.title(name);
      }
      this.$api.http("banner", {}, (e) => {
        this.banner = e;
      });

      this.$api.http("info", { page: 1, limit: 4, type: 2 }, (e) => {
        this.info = e;
      });
      this.checklevel(val.t0, 4);
      this.checklevel(val.t3, 10);
      this.checklevel(val.t4, 1);
      this.checklevel(val.t5, 2);
      this.checklevel(val.t6, 3);
      this.checklevel(val.t7, 5);
      this.checklevel(val.t8, 6);
      this.checklevel(val.t9, 7);
      this.checklevel(val.t10, 8);
      this.checklevel(val.t11, 9);
      this.checklevel(val.t13, 12);
      this.checklevel(val.t12, 13);
      this.checklevel(val.t19, 11);
      this.checklevel(val.t20, 14);
      this.checklevel(val.t21, 15);

      // eslint-disable-next-line
      let idss = +demo.$local.get("nid");
      if (idss !== 7 && !this.$js.env) {
        this.checklevel(false, 13);
      }

      if (idss !== 7) {
        // 手动关闭 国学
        this.checklevel(false, 14);
      }

      // if (idss !== 7 && idss !== 71) {
      //   this.checklevel(false, 15);
      // }

      // 家园联系册小红点
      if (val.t10 && this.user.id) {
        this.$api.http("a2023051907", {}, (r) => {
          this.is10type = +r === 1;
          if (!this.is10type) {
            this.$api.http("a2023051908", {}, (r2) => {
              let index = this.tab
                .map((s) => {
                  return s.type;
                })
                .indexOf(10);
              if (index >= 0) {
                this.$set(this.tab[index], "num", r2);
              }
            });
          }
        });
      }

      this.is_babyvideo = val.t1;
      this.is_infotext = val.t14;

      if (this.is_babyvideo) {
        this.$api.http("cute", { page: 1, limit: 2 }, (e) => {
          this.cute = e;
        });
      }

      this.is_openid = e.user.openid === "";

      if (this.is_openid && this.iswx) {
        this.$model.model(
          "是否微信授权，授权后可实时接收信息",
          "微信绑定",
          (r) => {
            if (r) {
              this.$demo.toBindWx(this.appGetParams("id"), "wx_bind_code");
            }
          }
        );
      }

      this.is_info =
        +e.user.is_it_bound === 2 && e.user.is_baby_information === 0;

      // 新规则 是否有权限
      let menulevel = this.$demo.$session.get("menulevel", {});
      let closed = menulevel.close || [];
      if (closed.length) {
        this.tab = this.tab.filter((r) => {
          if (r.menulevel) {
            return closed.indexOf(r.menulevel) < 0;
          }
          return true;
        });
      }

      this.menu = this.tab;
    },
    onbanner(e) {
      this.appPath("/banner_detail/" + e.id);
    },
    onCuteDetail(e) {
      this.appPath("/cute_detail/" + e.id);
    },
    onLocation() {
      this.$model.info("正在尝试为您打开地图", 2);
      this.$vx({}, "location");
    },
    onMenu(e) {
      if (e.url === "share") {
        this.$vx({ desc: "您的好友给你推荐" }, "", true);
        return 0;
      }
      if (e.url === "/food") {
        this.appisFoodShop((rej) => {
          if (rej) {
            this.appPath("/food");
          } else {
            this.appPath("/foods");
          }
        });
        return 0;
      }
      // console.log(this.islogin === false, window.location.href.indexOf("tulis"));
          if (e.level > 0) {
          if (!this.islogin && window.location.href.indexOf("tulis") !== -1) {
          this.$model.info("您还未登录", 2);
          // this.$nextTick(() => {
          //   this.appPath("/login");
          // });
          return 0;
        }
      // e.level 1=>需登录 2=>需绑定宝宝

        // 检测是否有权限访问
        if (e.level > 1) {
          let r = this.user;
          // is_it_bound, // 绑定宝宝审核 0 未绑定 1 待审核 2 通过 3 驳回
          switch (+r.is_it_bound) {
            case 0:
              this.$model.info("您还未绑定宝宝", 2);
              this.onBindBaby(0);
              break;
            case 1:
              this.$model.info("您申请绑定的宝宝正在审核中", 2);
              this.onBindBaby(1);
              break;
            case 3:
              this.$model.info("您申请绑定的宝宝未通过审核", 2);
              this.onBindBaby(2);
              break;
            default:
              if (r.c_id && r.bind_last_day <= 0 && e.name === "6003") {
                this.$model.model(
                  "你的可观看时间已到期,请点击确定去续费!",
                  "无法查看宝贝在线",
                  (res) => {
                    if (res) {
                      this.appPath("/pay_renew");
                    }
                  }
                );
                return 0;
              }
              if (e.type === 10) {
                return this.gettotype(e);
              }
              this.appPath(e.url);
          }
        } else {
          this.appPath(e.url);
        }
        return 0;
      }
      this.appPath(e.url);
    },
    onBindBaby(num) {
      this.$nextTick(() => {
        this.appPath("/bind_baby/" + num);
      });
    },
  },
  mounted() {
    this.iswx = this.$demo.es6().isWx();
  },

};
</script>
<style lang='less' scoped>
.banner {
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.5);
}
.semiellipse {
  @s: 15px;
  height: @s;
  position: relative;
  overflow: hidden;
  z-index: 8;
  &::before {
    position: absolute;
    height: @s * 3;
    background-color: #fff;
    border-radius: 50% 50% 0 0;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
  }
}
.tab {
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  font-size: 16px;
  overflow: hidden;
  padding-bottom: 10px;
}
.tels {
  border-radius: 5px;
  overflow: hidden;
  background-color: #fff;
  font-size: 15px;
  .location {
    width: 80px;
    align-items: center;
    color: #999;
    i {
      font-size: 18px;
      padding-left: 5px;
    }
  }
}
.user_box {
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  font-size: 16px;
  overflow: hidden;
  padding-bottom: 10px;
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
</style>
