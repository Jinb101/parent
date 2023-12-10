<template>
  <div class="login">
    <template v-if="!id">
      <v-l list>
        <van-empty v-if="!det.length" description="暂无可选园所">
          <van-button @click="appPath('/login_reg')">去注册</van-button>
        </van-empty>
        <template v-else>
          <p class="h6 col_danger">请选择园所 点击进入</p>
        </template>
        <section v-for="(i, j) in det" :key="j">
          <van-cell :title="i.label" is-link @click.stop="onc(i)"></van-cell>
        </section>
      </v-l>
    </template>
  </div>
</template>

<script>
import vL from "../login/select_group.vue";
export default {
  data() {
    return {
      detail: {},
      det: [],
      id: "",
    };
  },
  components: { vL },
  inject: ["appGetParams", "appPath", "reload"],
  methods: {
    onc(i) {
      this.$demo.$session.clear();
      this.$demo.$local.set("token", i.token);
      this.$demo.$local.set("nid", i.value);
      this.$demo.$local.set("select-id", i.value);
      this.$demo.$cookie.set("token", i.token);
      this.$nextTick(() => {
        // eslint-disable-next-line
        demo.es6().readytojump("get"); // 清除
      });
      this.wxinit();
      let bb = this.$demo.$local.get("babypay");
      if (bb > 0 && bb + 864e5 > Date.now()) {
        return this.appPath("/babypay");
      }
      setTimeout(() => {
        let path = this.$demo.$local.get("login_path");
        if (path) {
          this.appPath(path.replace("#", ""));
          this.$demo.$local.clear("login_path");
        } else {
          this.appPath("/index");
        }
      }, 500);
    },
    wxinit() {
      // eslint-disable-next-line
      if (!demo.es6().isWx()) {
        return 0;
      }
      this.$api.http("wx", {}, (e) => {
        this.$demo.$local.set("wxConfig", e);
        this.$vx();
      });
    },
    init() {
      if (!this.code) {
        this.$toast("登录失败");
        return this.appPath("/login");
      }
      if (this.id > 0) {
        this.$api.http(
          "getToken",
          { code: this.code, n_id: this.id },
          (res, code) => {
            this.detail = res;
            this.$demo.$session.set("app-time-user", 0);
            this.$demo.$session.set("login-status", 0);
            this.$demo.$session.set("work-dot-time", 0);
            // this.$demo.$local.set("token", "");
            // this.$demo.$cookie.del("token");
            if (res && code === 200) {
              this.$demo.$local.set("token", res);
              this.wxinit();
              let bb = this.$demo.$local.get("babypay");
              if (bb > 0 && bb + 864e5 > Date.now()) {
                return this.appPath("/babypay");
              }
              // this.$demo.$cookie.set("token", res);
              setTimeout(() => {
                let path = this.$demo.$local.get("login_path");
                if (path) {
                  this.appPath(path.replace("#", ""));
                  this.$demo.$local.clear("login_path");
                } else {
                  this.appPath("/index");
                }
              }, 1000);
            } else {
              this.$toast("登录失败");
              this.$nextTick(() => {
                this.appPath("/login");
              });
            }
          },
          "post",
          false,
          [200, 411]
        );
      } else {
        this.$api.http("a1130", { code: this.code, nursery_id: 0 }, (r) => {
          this.det = (r || []).map((s) => {
            return {
              label: (s.nursery || {}).name,
              value: s.n_id,
              token: s.access_token,
            };
          });
        });
      }
    },
  },
  mounted() {
    let v = this.$demo.getUrl();
    this.code = v.code;
    this.id = v.id;
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
