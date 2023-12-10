<template>
  <div class="user_baby_info">
    <v-tool-title></v-tool-title>
    <v-b></v-b>
    <div class="foot">
      <van-button block type="danger" @click="onSub">解绑</van-button>
    </div>
  </div>
</template>

<script>
import vB from "./_b.vue";
export default {
  data() {
    return {};
  },
  components: { vB },
  inject: ["appBack", "appGetInfo", "appPath"],
  methods: {
    onSub() {
      let user = this.$demo.$session.get("user", {});
      // user.binding_number === 0 主账户解绑
      let s = user.binding_number === 0;
      this.$model.model("是否解除对该宝宝的绑定", "", (res) => {
        if (res) {
          this.$api.http("bindacc", {}, (res) => {
            let token = res.filter((r) => {
              return r.id === user.binding_number;
            });

            this.$api.http("userUnBindBaby", {}, () => {
              this.$model.info("解绑成功", 2);
              this.$demo.$session.set("app-time-user", 0);
              if (!s) {
                if (token[0]) {
                  this.$demo.$local.set("token", token[0].access_token);
                  this.$demo.$session.reset();
                  this.$toast("解绑副账号成功，正在切换成主账号");
                  setTimeout(() => {
                    this.appPath("/");
                  }, 500);
                } else {
                  this.$demo.$session.reset();
                  this.$demo.$local.set("token", "");
                  this.$toast("主账号失效，请重新登录");
                  setTimeout(() => {
                    this.appPath("/login");
                  }, 500);
                }
              } else {
                this.appGetInfo(() => {
                  this.appBack(true);
                });
              }
            });
          });
        }
      });
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.user_baby_info {
  overflow-y: scroll;
  background-color: #f7f7f7;
  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 33;
    height: 44px;
  }
}
</style>
