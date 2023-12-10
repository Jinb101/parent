<template>
  <v-a title="登录" ref="login" @chengeid="onchengeid" @user="onuser">
    <h6>手机号</h6>
    <van-field
      label=""
      v-model="acc"
      placeholder="请输入手机号"
      left-icon="phone"
      label-width="4em"
      maxlength="15"
      @focus="showwx = false"
      @blur="showwx = true"
    />
    <van-cell
      v-if="change"
      title="选择园所"
      :value="t1.text ? t1.text : '请先输入手机号'"
      is-link
      @click="isclick ? (open = !open) : null"
    ></van-cell>
    <h6>密码</h6>
    <van-field
      label=""
      v-model="pwd"
      placeholder="请输入密码"
      left-icon="lock"
      label-width="4em"
      maxlength="20"
      :type="showpwd ? 'text' : 'password'"
      @focus="showwx = false"
      @blur="showwx = true"
    >
      <template #button>
        <span class="eye" @click="showpwd = !showpwd">
          <van-icon name="closed-eye" v-if="showpwd" />
          <van-icon name="eye-o" v-else />
        </span>
        <span class="col_ash" @click="appPath('/login_reset')">忘记密码？</span>
      </template>
    </van-field>
    <div class="agree">
      <van-checkbox icon-size="13" v-model="check"></van-checkbox>
      <b @click="check = !check">阅读并同意</b>
      <span class="col_green" @click="onOpenAgree">《用户协议》</span>
    </div>
    <van-button block round :color="$js.btnColor" @click="onSub"
      >登录</van-button
    >
    <div class="reg" @click="onreg">
      没有账号?<b class="col_info">立即注册</b>
    </div>
    <!-- <div class="foot_btn" v-if="iswx && showwx">
      <div class="wx_btn" @click="onwx">
        <van-icon name="wechat" />
        微信登录
      </div>
    </div> -->
    <v-s v-model="t1" :list="g" :open="open" noselect @change="ont1"></v-s>
  </v-a>
</template>

<script>
import vA from "../temp.vue";
import vS from "../../newpublic/select.vue";
export default {
  data() {
    return {
      acc: "",
      pwd: "",
      check: false,
      iswx: false,
      change: false,
      g: [],
      open: false,
      t1: {},
      isclick: false,
      showwx: true,
      showpwd: false,
    };
  },
  watch: {
    acc(n) {
      this.isclick = false;
      if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(n)) {
        this.isclick = true;
        this.checks();
      }
    },
  },
  inject: ["appPath"],
  components: { vA, vS },
  methods: {
    ont1() {
      // eslint-disable-next-line
      demo.$local.set("nid", this.t1.id);
      // eslint-disable-next-line
      demo.$local.clear("select-nid");
    },
    checks() {
      if (!this.change) return 0;
      let load = this.$toast.loading({ duration: 0 });
      this.$api.http("a1130", { phone: this.acc, type: 1 }, (r) => {
        if (load) {
          load.clear();
          load = null;
        }
        this.g = r.map((s) => {
          let a = s.nursery || {};
          return {
            id: a.id,
            text: a.name,
          };
        });
        if (this.g.length) {
          // eslint-disable-next-line
          let t1 = demo.$local.get("select-nid", {});
          this.t1 = t1.id ? t1 : this.g[0];
          this.ont1();
        }
      });
      setTimeout(() => {
        if (load) {
          load.clear();
          load = null;
        }
      }, 8e3);
    },
    onchengeid() {
      this.change = true;
    },
    onOpenAgree() {
      this.$refs.login.open = true;
    },
    onSub() {
      if (!this.check) return this.$toast("请先阅读用户协议");
      this.$api.http(
        "login",
        // eslint-disable-next-line
        { phone: this.acc, password: md5(this.pwd) },
        (r) => {
          this.$toast("登录成功");
          // eslint-disable-next-line
          demo.$session.reset();
          // eslint-disable-next-line
          demo.$local.set("token", r.access_token);
          // eslint-disable-next-line no-undef
          demo.$local.set('not_wx_admin', '1')
          // eslint-disable-next-line
          demo.pwd({ account: this.acc, password: this.pwd }, () => {}, demo);
          this.appPath("/index");
        }
      );
    },
    onreg() {
      if (this.iswx) {
        this.$refs.login.wxreg();
        return 0;
      }
      this.appPath("/login_reg");
    },
    onwx() {
      this.$refs.login.wxlogin();
    },
    onuser(e) {
      if (e.phone) {
        // let currentUrl = window.location.href;
        // this.appPath("/index");
        // if (currentUrl.indexOf('tulis') > -1) {
        // }
        this.$model.model(
          "检测你已登录，账号为" + e.phone + ",是否跳转至首页",
          "温馨提示",
          (r) => {
            if (r) {
              this.appPath("/index");
            }
          }
        );
      }
    },
  },
  mounted() {
    // eslint-disable-next-line
    if (demo.es6().isWx()) {
      // eslint-disable-next-line no-undef
      if (demo.$local.get('not_wx_admin') === '1') {
          this.wx = false;
      // eslint-disable-next-line no-undef
      } else {
        this.wx = true
      }
    } else {
      this.wx = false;
    }
    // this.iswx = demo.es6().isWx();
    // eslint-disable-next-line
    let a = demo.pwd({}, () => {}, demo);
    if (a.length > 0) {
      this.acc = a[0].account;
      this.pwd = window.atob(a[0].pwd);
      this.check = true;
    }
  },
};
</script>
<style lang='less' scoped>
.agree,
.reg {
  font-size: 13px;
  padding: 20px;
  display: flex;
  b {
    padding: 0 5px;
  }
}
.reg {
  margin-top: 10px;
  justify-content: center;
}
.checks {
  padding: 10px 20%;
}
.login_wx {
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 0 10% 40px;
  text-align: center;
  font-size: 28px;
  width: 100%;
  z-index: 4;
  display: flex;
  justify-content: center;
  .btns {
    color: #29b043;
    text-align: center;
    .icon {
      width: 40px;
      height: 40px;
      border: 1px solid #f9f9f9;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
    }
    p {
      font-size: 14px;
      transform: translateY(-5px);
    }
  }
}
.foot_btn {
  margin-top: 50px;
  position: sticky;
  bottom: 0;
  padding: 15px 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  .wx_btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;
    font-size: 14px;
    color: #29b043;
    .van-icon {
      font-size: 30px;
      margin-bottom: 5px;
    }
  }
}
h6 {
  font-weight: 700;
  font-size: 17px;
  padding: 10px;
}
.eye {
  line-height: 16px;
  padding: 0 5px;
  font-size: 16px;
  transform: translateY(3px);
  display: inline-block;
}
</style>
