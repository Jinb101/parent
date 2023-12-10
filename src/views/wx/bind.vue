<template>
  <div class="wx_bind">
    <template v-if="title">
      <v-tool-title></v-tool-title>
    </template>
    <p class="c">您{{ open ? "已" : "未" }}绑定微信</p>
    <div class="send">
      <van-button block round :color="avs" @click="onDetail">
        <van-icon name="wechat" size="20" color="#fff" />
        <b>{{ open ? "更改" : "添加" }}微信绑定</b>
      </van-button>
    </div>
    <p>
      注：绑定微信后公众号可向您推送本园的审核与通知信息，以便于第一时间查看
    </p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: { type: Boolean, default: true },
  },
  data() {
    return {
      open: false,
      avs: "",
    };
  },
  inject: ["appGetInfo", "appGetConfig", "appGetParams"],
  methods: {
    onDetail() {
      if (this.open) {
        this.$model.model("此操作不可逆，是否更改绑定？", "", (res) => {
          if (res) {
            this.tos();
          }
        });
      } else {
        this.tos();
      }
    },
    tos() {
      // let nid = this.$demo.$local.get("nid");
      // let token = this.$demo.$local.get("token");
      // let t = this.appGetConfig(true);
      // let p = this.appGetParams();
      // let arr = [p.theme || 0, p.token || 0, p.debug || 0, nid, token].join(
      //   "_"
      // );
      // let c = this.$js.wx(t.appId, arr);
      // window.location.href = c;
      let v = this.$demo.toBindWx(this.appGetParams("id"), "wx_bind_code");
      if (!this.$js.env) {
        window.location.replace(v);
      }
    },
  },
  mounted() {
    this.avs = this.$demo.$alg.gradients(85, "#05b10f", "#0fd01b");
    this.appGetInfo((e) => {
      this.open = e.openid !== "";
    });
  },
};
</script>
<style lang='less' scoped>
.wx_bind {
  .send {
    width: 80%;
    margin: 50px auto 30px;
    .van-icon {
      vertical-align: middle;
    }
  }
  p {
    font-size: 14px;
    color: #999;
    padding: 15px;
    line-height: 1.3;
    &.c {
      text-align: center;
    }
  }
}
</style>
