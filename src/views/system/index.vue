<template>
  <div class="system x_bgc_body">
    <v-tool-title background
                  tran></v-tool-title>
    <div class="covers_bgc"></div>
    <!-- <div class="triangle triangle_top"></div> -->
    <!-- <div class="triangle triangle_bottom"></div> -->
    <x-content></x-content>
    <x-content v-for="(i, j) in line"
               :key="j + '-line'">
      <van-cell :title="i.t"
                is-link
                :value="i.v"
                @click="onDetail(i)"></van-cell>
    </x-content>
    <x-content v-if="debug">
      <x-box title="开发者功能">
        <template #icon>
          <x-radius size="35"
                    color="#38f">
            <van-icon name="smile"
                      color="#fff"
                      size="23"
                      class="icon" />
          </x-radius>
        </template>
        <van-cell :title="i.t"
                  is-link
                  :value="i.v"
                  @click="onDetail(i)"
                  v-for="(i, j) in env"
                  :key="j + '-env'"></van-cell>
      </x-box>
    </x-content>
    <x-content></x-content>
    <transition name="van-slide-left">
      <div class="app_show_fixed top auto"
           v-if="show"
           style="z-index: 600">
        <v-tool-title back
                      @on-back="show = false"
                      text="切换宝贝">
          <span class="col_green"
                @click="appPath('/bind_baby/0')">绑定新的</span>
        </v-tool-title>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell :title="i.nickname"
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
      line: [
        { t: "用户协议", v: "查看", p: "/lib_agree" },
        { t: "绑定微信", v: "去绑定", p: "/wx_bind" },
        { t: "帮助", v: "查看帮助", p: "/help" },
        // { t: "收货地址", v: "点击设置/编辑", p: "/address" },
        { t: "清除缓存", v: "清除缓存", type: "clear" },
        { t: "上传信息", v: "", type: "info" },
        { t: "注销登录", v: "", type: "exit" },
      ],
      env: [
        { t: "远程调试", p: "/remote_debug" },
        // { t: "微信付款 (测试)" },
        { t: "招生海报", p: "/poster" },
        { t: "家庭教育", v: "测试版", p: "/education" },
        { t: "家庭教育订单", v: "测试版", p: "/educationorder" },
        { t: "切换", v: "切换到另一个宝贝", type: "check" },
      ],
      debug: false,
      show: false,
      binds: [],
      user: {},
      radio: "",
    };
  },
  inject: ["appPath", "appGetInfo"],
  computed: {
    ver() {
      return this.$demo.version;
    },
  },
  methods: {
    toBindLabel(i) {
      if (+i.binding_number === 0) return "主账户";
      let s = "副账户";
      let v = ["未绑定", "审核中", "", "驳回"][i.is_it_bound];
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
          this.$toast("切换成主账户");
          return;
        }
        if (+obj.is_it_bound !== 2) {
          return this.$toast(this.toBindLabel(obj));
        }
        this.$toast("切换成副账户");
        toToken();
      } else {
        this.$toast("切换失败");
      }
    },
    onDetail(e) {
      if (e.p) {
        this.appPath(e.p);
        return 0;
      }
      switch (e.type) {
        case "exit":
          this.onExit();
          break;
        case "check":
          this.$api.http("bindacc", {}, (res) => {
            this.show = true;
            this.binds = res;
          });
          break;
        case "clear":
          this.$model.model("是否清除", "", (r) => {
            if (r) {
              let nid = this.$demo.$local.get("nid");
              let token = this.$demo.$local.get("token");
              this.$demo.$local.reset();
              this.$demo.$session.reset();
              this.$demo.$local.set("nid", nid);
              this.$demo.$local.set("token", token);
              this.$toast("清除完成");
              this.$router.back();
            }
          });
          break;
        case "info":
          // eslint-disable-next-line
          sdkerror.setMsg({ type: "日志上传" });
          // eslint-disable-next-line
          sdkerror.uploadinfo();
          this.$toast("成功");
          break;
        default:
          this.onMessage("开发中");
          console.log(e);
      }
    },
    onExit() {
      this.showModel(
        "是否清除所有数据还原至初始版本？\n 注意：清除后将重新登录！",
        () => {
          this.$demo.$local.reset();
          this.$demo.$session.reset();
          this.onMessage("清除完成，请重新登录");
          this.appPath("/login");
        }
      );
    },
    onMessage(val) {
      this.$model.info(val, 2);
    },
    showModel(err, fn) {
      this.$model.model(err, "确认操作", (res) => {
        if (res) {
          fn();
        }
      });
    },
  },
  mounted() {
    this.debug = this.$js.env || this.$demo.getUrlParam("debug");
    this.appGetInfo((e) => {
      this.user = e;
      this.radio = e.id;
    });
  },
};
</script>
<style lang='less'
       scoped>
      .system {
        overflow-y: scroll;
        font-size: 14px;

        .icon {
          line-height: 35px;
        }
      }

      .covers_bgc {
        position: fixed;
        left: 0;
        top: 0;
        height: 200px;
        border-radius: 0 0 30px 30px;
        background-color: #38f;
        z-index: -1;
        width: 100%;
      }
    </style>
