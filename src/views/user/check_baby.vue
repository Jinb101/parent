<template>
  <div class="check_baby">
    <template v-if="babylen > 1">
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            clickable
            @click="radio = i.id"
            v-for="(i, j) in list"
            :key="j + 'b'"
            :label="toBindLabel(i)"
          >
            <template #title>
              {{ i.child_name }}
              <van-tag
                type="primary"
                v-if="sort > 0 && +sort === +i.id && radio !== i.id"
                >上次切换</van-tag
              >
            </template>
            <template #right-icon>
              <van-radio :name="i.id" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="btn">
        <van-button block round type="primary" @click="onCheckBind"
          >点击切换</van-button
        >
      </div>
    </template>
    <template v-else>
      <p class="error">家长抱歉，当前绑定不是多个宝宝，无需切换</p>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    babylen() {
      return this.list.length;
    },
  },
  data() {
    return {
      list: [],
      radio: "",
      sort: "",
    };
  },
  inject: ["appPath"],
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
      let obj = this.list.filter((r) => {
        return +r.id === +val;
      });
      let id = this.user.id;
      let toToken = (o) => {
        this.$demo.$local.set("token", o.access_token);
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
        this.$demo.$local.set("babystatusindex", id);
        if (obj.binding_number === 0) {
          // 切换成主账户
          toToken(obj);
          this.$toast("切换成主宝宝");
          return;
        }
        // if (+obj.is_it_bound !== 2) {
        //   return this.$toast(this.toBindLabel(obj));
        // }
        this.$toast("切换成副宝宝");
        toToken(obj);
      } else {
        this.$toast("切换失败");
      }
    },
  },
  mounted() {
    this.$api.http("bindacc", {}, (res) => {
      this.list = res;
      this.radio = this.user.id;
      this.sort = this.$demo.$local.get("babystatusindex");
    });
  },
};
</script>
<style lang='less' scoped>
.error {
  padding: 40px 15px;
  line-height: 1.5;
  box-sizing: border-box;
  text-align: center;
  font-size: 15px;
}
.btn {
  padding: 30px 18%;
  box-sizing: border-box;
}
</style>
