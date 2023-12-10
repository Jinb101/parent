<template>
  <div class="index x_bgc_body">
    <x-header :color="$theme.color" class="h"></x-header>
    <x-content>
      <div class="banner">
        <van-swipe
          :autoplay="3000"
          :stop-propagation="false"
          :indicator-color="$theme.color[0]"
        >
          <van-swipe-item
            v-for="(image, index) in banner"
            :key="index + '-banner'"
            @click.stop="onBannerDetail(image)"
          >
            <van-image :src="image.picture" fit="cover"></van-image>
          </van-swipe-item>
        </van-swipe>
      </div>
    </x-content>
    <x-content>
      <div class="notice">
        <van-notice-bar
          left-icon="volume-o"
          text="点击-绑定微信"
          v-if="isBindWx"
          @click="appPath('/wx_bind')"
        />
        <van-notice-bar
          left-icon="volume-o"
          text="点击-完善宝贝信息"
          v-if="isEditBabyInfo"
          @click="appPath('/user_baby')"
        />
      </div>
    </x-content>
    <x-content>
      <div class="semiellipse"></div>
      <x-box :header="false" size="big" :style="{ 'padding-top': 0 }">
        <ul class="flex fw">
          <li
            v-for="(i, j) in menu"
            :key="j + '-item1'"
            @click="onMenuDetail(i)"
          >
            <div class="dot" v-if="i.num > 0">
              <van-badge :content="i.num"> </van-badge>
            </div>
            <x-radius>
              <van-image :src="i.icon" fit="cover"></van-image>
            </x-radius>
            <p class="van-ellipsis">
              {{ i.title }}
            </p>
          </li>
        </ul>
      </x-box>
    </x-content>
    <x-content>
      <div class="location flex" v-if="tel">
        <a :href="'tel:' + tel">
          <van-icon name="chat-o" :color="$theme.color[0]" size="20" />
          咨询热线：<b>{{ tel }}({{ telName }})</b>
        </a>
        <span @click="onLocation">
          导航
          <van-icon name="location" size="20" color="#41cc6e" />
        </span></div
    ></x-content>
    <x-content>
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
    <x-content>
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
  </div>
</template>

<script>
import vLine from "../private/line.vue";
import vVideo from "../private/video.vue";
import vList from "../private/list.vue";
export default {
  data() {
    return {
      tel: "",
      telName: "",
      title: "",
      menu: [],
      banner: [],
      cute: [],
      info: [],
      isCute: true,
      isEditBabyInfo: false,
      isBindWx: false,
    };
  },
  components: { vLine, vVideo, vList },
  inject: [
    "appGetConfig",
    "appPath",
    "appIsLogin",
    "appWait",
    "appGetInfo",
    "appisFoodShop",
  ],
  methods: {
    onLocation() {
      this.$model.info("正在尝试为您打开地图", 2);
      this.$vx({}, "location");
    },
    onBindBaby(num) {
      this.appWait(() => {
        this.appPath("/bind_baby/" + num);
      });
    },
    onMenuDetail(e) {
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
      if (window.location.href.indexOf("tulis") > -1) {
            this.$model.info("请先去我的页面登录", 2);
            } else {
      // e.level 1=>需登录 2=>需绑定宝宝
      if (e.level > 0) {
        // 检测是否登录
        this.appIsLogin(
          () => {
            // 检测是否有权限访问
            if (e.level > 1) {
              this.appGetInfo((r) => {
                // is_it_bound, // 绑定宝宝审核 0未绑定 1待审核 2通过 3驳回
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
                    this.appPath(e.url);
                }
              });
            } else {
              this.appPath(e.url);
            }
          },
          () => {
            this.$model.info("您还未登录", 2);
            this.appWait(() => {
              this.appPath("/login");
            });
          }
        );
        return 0;
      }
            }

      this.appPath(e.url);
    },
    onBannerDetail(e) {
      this.appPath("/banner_detail/" + e.id);
    },
    onCuteDetail(e) {
      this.appPath("/cute_detail/" + e.id);
    },
    init() {
      let menu = this.$js.def.indexRoute;
      this.$api.http("banner", {}, (e) => {
        this.banner = e;
      });
      // 检测宝贝在线是否开启 精彩瞬间是否开启
      let sr = (e, type) => {
        let a = e.filter((s) => {
          return s.type === +type;
        });
        a = a[0] || {};
        return a.is_show !== 0;
      };
      this.$api.http("isIndexOpen", {}, (e) => {
        // 0 为开启
        let baby = sr(e, 0);
        let cute = sr(e, 1);
        let ls = sr(e, 3);
        this.isCute = cute;
        if (baby) {
          this.menu = menu.filter((r) => {
            return r.name !== "6003";
          });
        }
        if (!cute) {
          // 精彩瞬间
          this.$api.http("cute", { page: 1, limit: 2 }, (e) => {
            this.cute = e;
          });
        }
        if (ls) {
          // 家园联系
          this.menu = menu.filter((r) => {
            return r.name !== "6009";
          });
        }
      });

      // 新规则 是否有权限
      let menulevel = this.$demo.$session.get("menulevel", {});
      let closed = menulevel.close || [];
      if (closed.length) {
        this.menu = menu.filter((r) => {
          if (r.menulevel) {
            return closed.indexOf(r.menulevel) < 0;
          }
          return true;
        });
      }

      // 园所资讯
      this.$api.http("info", { page: 1, limit: 4, type: 2 }, (e) => {
        this.info = e;
      });
      this.appIsLogin(
        (e) => {
          this.isEditBabyInfo =
            +e.is_it_bound === 2 && e.is_baby_information === 0;
          this.isBindWx = e.openid === "";
        },
        () => {}
      );
    },
    once(a) {
      this.title = a.name;
      this.$demo.title(a.name);
      this.tel = (a.nursery_ext || {}).contact;
      this.telName = (a.nursery_ext || {}).contacts;
    },
  },
  mounted() {
    let a = this.appGetConfig();
    if (!a.name) {
      // eslint-disable-next-line
      let id = demo.getUrl().id;
      if (id > 0) {
        this.$api.http("config", {}, (e) => {
          a = e;
          this.once(a);
        });
      }
    } else {
      this.once(a);
    }
    this.menu = this.$js.def.indexRoute;
    this.init();
  },
};
</script>
<style lang='less' scoped>
.index {
  overflow-y: scroll;
  padding-bottom: 30px;
  .h {
    height: 210px;
  }
  li {
    width: 25%;
    text-align: center;
    color: #444;
    margin-top: 8px;
    position: relative;
    p {
      padding: 7px 0;
      font-size: 12px;
      font-weight: 550;
    }
    .p {
      width: 100%;
    }
    .dot {
      position: absolute;
      right: 0;
      top: 0;
    }
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
  .banner {
    box-sizing: border-box;
    height: 180px;
    overflow: hidden;
    position: relative;
    margin-top: 10px;
    .van-swipe {
      height: 100%;
      background-color: rgb(245, 245, 245);
      border-radius: 8px;
      overflow: hidden;
    }
  }
  .notice {
    > div {
      margin-bottom: 2px;
    }
  }
  .location {
    background-color: #fff;
    font-size: 14px;
    padding: 0 10px;
    margin: 2px 0;
    line-height: 40px;
    height: 40px;
    border-radius: 20px;
    a {
      color: #999;
      flex: 1;
      b {
        color: #666;
        font-weight: 650;
      }
    }
    .van-icon {
      vertical-align: middle;
    }
    > span {
      padding: 0 10px;
    }
  }
}
</style>
