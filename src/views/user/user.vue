<template>
  <div class="user x_bgc_body">
    <x-header :color="$theme.color"
              class="h"></x-header>
    <x-content> </x-content>
    <x-content>
      <x-box :header="false"
             size="big">
        <span class="by"
              :style="$theme.bgc_linear">
          <span v-if="vip > 0">剩余{{ vip }}天</span>
          <span v-else
                @click="onToByVip">已过期</span>
        </span>
        <div class="flex head">
          <div class="ava"
               @click="appPath('/user_info')">
            <van-image fit="cover"
                       round
                       :src="user.avatar"></van-image>
          </div>
          <div class="text">
            <p class="name van-ellipsis">
              {{ user.nickname }}
              <van-tag v-if="authorjob"
                       type="primary">{{ authorjob }}</van-tag>
            </p>
            <p class="phone">
              <span v-if="+user.is_it_bound === 0"
                    @click="appPath('/bind_baby/0')">未绑定</span>
              <span v-else-if="+user.is_it_bound === 1"
                    @click="appPath('/bind_baby/1')">待审核</span>
              <span v-else-if="+user.is_it_bound === 3"
                    @click="appPath('/bind_baby/2')">已驳回</span>
              <span v-else
                    @click="appPath('/user_baby_info')">
                {{ baby.class_name }} {{ baby.name }}
              </span>
            </p>
          </div>
        </div>
      </x-box>
    </x-content>
    <x-content>
      <x-box :header="false">
        <ul class="flex fw">
          <li v-for="(i, j) in nav"
              :key="j + '-item1'"
              @click="onDetail(i)">
            <!-- <div class="dot" v-if="i.num > 0">
              <van-badge :content="i.num"> </van-badge>
            </div> -->
            <x-radius :color="i.color">
              <van-image :src="i.icon"
                         fit="cover"></van-image>
            </x-radius>
            <p class="van-ellipsis">
              {{ i.title }}
              <van-badge :content="i.num"
                         v-if="i.num > 0"> </van-badge>
            </p>
          </li>
        </ul>
      </x-box>
    </x-content>
    <x-content>
      <!-- 联系客服 -->
      <a class="lines flex van-hairline--bottom"
         :href="'tel:' + tel">
        <van-icon name="phone"
                  size="16"
                  color="#71beff" />
        <b>联系客服</b>
        <span class="tel">{{ tel }}</span>
        <van-icon name="arrow" />
      </a>
      <div class="lines flex van-hairline--bottom"
           @click="onToCheck">
        <van-icon name="friends-o"
                  size="16"
                  color="#71beff" />
        <b>切换宝宝</b>
        <span></span>
        <van-icon name="arrow" />
      </div>
      <div class="lines flex"
           @click="onToFood">
        <van-icon name="shop"
                  size="16"
                  color="#71beff" />
        <b>食材小店</b>
        <span></span>
        <van-icon name="arrow" />
      </div>
      <div class="lines flex m10"
           @click="appPath('/educationorder')"
           v-if="+pid === 7">
        <van-icon name="bill-o"
                  size="16"
                  color="#71beff" />
        <b>家庭教育订单</b>
        <span></span>
        <van-icon name="arrow" />
      </div>
      <!-- 设置 -->
      <div class="lines flex m10"
           @click="appPath('/system')">
        <van-icon name="setting"
                  size="16"
                  color="#71beff" />
        <b>设置</b>
        <span></span>
        <van-icon name="arrow" />
      </div>
    </x-content>
    <x-content>
      <van-button block
                  color="#fff"
                  @click="onExit">
        <b class="col_danger">退出登录</b>
      </van-button>
    </x-content>
    <transition name="van-slide-left">
      <div class="app_show_fixed top auto"
           v-if="show_bind"
           style="z-index: 600">
        <v-tool-title back
                      @on-back="show_bind = false"
                      text="切换宝贝">
          <span class="col_green"
                @click="appPath('/bind_baby/0')">绑定新的</span>
        </v-tool-title>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell :title="i.child_name"
                      clickable
                      @click="radio = i.id"
                      v-for="(i, j) in binds"
                      :key="j + 'b'"
                      :label="toBindLabel(i)">
              <template #right-icon>
                <van-radio :name="i.id" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="w60">
          <van-button block
                      round
                      type="primary"
                      @click="onCheckBind">点击切换</van-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      theme: {},
      baby: {},
      userTheme: "",
      headImage: "",
      nav: [],
      height: 100,
      menuNum: 3,
      tel: "",
      vip: "",
      cid: false,
      show_bind: false,
      binds: [],
      radio: "",
      pid: "",
    };
  },
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
  },
  inject: [
    "appGetBabyInfo",
    "appGetTheme",
    "appPath",
    "appGetConfig",
    "appGetParams",
  ],
  methods: {
    toBindLabel(i) {
      if (+i.binding_number === 0) return "主账户";
      let s = "副账户";
      let v = ["待审核", "审核中", "", "驳回"][i.is_it_bound];
      if (v) {
        s += "(" + v + ")";
      }
      return s;
    },
    onCheckBind() {
      let val = this.radio;
      let obj = this.binds.filter((r) => {
        return +r.id === +val;
      });
      let id = this.user.id;
      let toToken = () => {
        this.show_bind = false;
        this.$demo.$local.set("token", obj.access_token);
        this.$demo.$session.reset();
        setTimeout(() => {
          this.appPath("/");
        }, 500);
      };
      if (obj.length) {
        obj = obj[0];
        if (obj.id === id) {
          return this.$toast("当前账户已登录");
        }
        if (obj.binding_number === 0) {
          // 切换成主账户
          toToken();
          this.$toast("切换成主宝宝");
          return;
        }
        if (+obj.is_it_bound !== 2) {
          return this.$toast(this.toBindLabel(obj));
        }
        this.$toast("切换成副宝宝");
        toToken();
      } else {
        this.$toast("切换失败");
      }
    },
    onToCheck() {
      this.$api.http("bindacc", {}, (res) => {
        this.show_bind = true;
        this.binds = res;
      });
    },
    onToFood() {
      let v = this.$demo.es6().encrypt(
        {
          token: this.$demo.$local.get("token"),
          id: this.$demo.$local.get("nid"),
          type: "web",
          // page: "detail/62",
          local: "youeryuanweb" + this.appGetParams("id"),
          old: "true",
        },
        "food"
      );
      window.location.replace(this.$js.api.h5 + "h5/foods/?h5=" + v);
    },
    onExit() {
      this.$model.model("是否退出登录", "", (res) => {
        if (res) {
          this.$api.exit();
          this.$model.info("退出成功", 2);
          this.$demo.$local.set("login-status-type", false);
          this.appPath("/login");
        }
      });
    },
    onToByVip() {
      let s = +this.user.guardian === 1;
      let d = +this.user.bind_last_day <= 0;
      if (!this.baby.no) {
        this.appPath("/bind_baby/0");
        return this.$model.info("请先绑定宝贝", 2);
      }
      if (!s && d) {
        return this.$model.info("不可缴费，主监护人未完成缴费", 2);
      }
      this.appPath("/pay_renew");
    },
    onDetail(e) {
      if (e.url) {
        this.appPath(e.url);
      }
    },
  },
  mounted() {
    this.nav = this.$js.def.users;
    let c = this.appGetConfig();
    this.pid = this.appGetParams("id");
    this.tel = c.tel;
    this.appGetBabyInfo((e, b) => {
      this.user = e;
      this.baby = b;
      this.radio = e.id;
      this.cid = +e.c_id === 0;
      this.vip = e.bind_is_expire * 1 ? 0 : Math.floor(e.bind_last_day || 0);
      // 监护人判断
      let a = +e.guardian === 1;
      if (!a) {
        this.nav = this.nav.filter((s) => {
          return s.level !== 1;
        });
      }
      // 宝贝在线续费判断
      let d = +e.bind_last_day <= 0;
      if (!d || (d && !a)) {
        this.nav = this.nav.filter((s) => {
          return s.level !== 2;
        });
      }
      // 缴费判断
      let c = +e.show_payment === 2;
      if (!c) {
        this.nav = this.nav.filter((s) => {
          return s.level !== 3;
        });
      } else {
        try {
          let index = this.nav
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
      }
      // 喂药
      if (!this.baby.no) {
        this.nav = this.nav.filter((s) => {
          return s.level !== 5;
        });
      }
      if (this.cid) {
        this.nav = this.nav.filter((s) => {
          return s.level !== 4;
        });
      }
    });
  },
};
</script>
<style lang='less'
       scoped>
      .user {
        overflow-y: scroll;
        padding-bottom: 30px;

        .h {
          height: 210px;
        }

        li {
          width: 33.33%;
          text-align: center;
          color: #444;
          margin: 8px 0;
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

        .lines {
          padding: 10px;
          line-height: 35px;
          background-color: #fff;
          color: #333;
          font-size: 13px;

          .van-icon {
            line-height: 35px;
            width: 30px;
            text-align: center;
          }

          span {
            flex: 1;
            text-align: right;
            letter-spacing: 1px;
            font-weight: 600;
          }
        }

        .m10 {
          margin-bottom: 10px;
        }

        .by {
          font-size: 10px;
          position: absolute;
          right: -10px;
          top: 0;
          color: #fff;
          border-radius: 10px 0 0 10px;
          z-index: 9;
          padding: 5px;
        }

        .head {
          position: relative;

          .ava {
            width: 64px;
            height: 64px;
            margin-right: 12px;
          }

          .text {
            width: calc(100% - 76px);

            .name {
              padding: 10px 0;
              font-size: 18px;
              font-weight: 600;

              b {
                font-size: 12px;
                font-weight: 400;
              }

              span {
                margin-left: 5px;
              }
            }

            .phone {
              font-size: 14px;
            }
          }
        }
      }
    </style>
