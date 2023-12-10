<template>
  <v-view header bgc="#f7f8fa" :back="change" @on-back="onback">
    <template #menu>
      <span class="col_danger" @click="del = !del" v-if="!change && item.length"
        >{{ del ? "关闭" : "" }}删除管理</span
      >
    </template>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <van-radio-group v-model="radio">
        <section
          v-for="(i, j) in item"
          :key="j"
          :class="{ change: change }"
          @click="radio = i.address_id"
        >
          <div class="change" v-if="change">
            <van-radio :name="i.address_id" />
          </div>
          <div class="edit" v-else>
            <span
              @click="ondetail(i)"
              :class="del ? 'col_danger' : 'col_warning'"
            >
              <van-icon :name="del ? 'delete-o' : 'edit'" />
            </span>
          </div>
          <div class="name">
            {{ i.consignee }} {{ i.mobile }}
            <van-tag v-if="+i.is_default === 1" type="primary">默认</van-tag>
          </div>
          <div class="address">
            {{ toCity(i) }}
          </div>
        </section>
      </van-radio-group>
    </v-page>
    <div class="add_null"></div>
    <div class="add flex">
      <van-button block type="danger" round icon="plus" @click="open = true"
        >新增</van-button
      >
      <van-button
        :disabled="!radio || radio < 1"
        block
        type="info"
        round
        @click="onchangeaddress"
        v-if="change"
        >选中收货地址</van-button
      >
    </div>
    <template #fixed>
      <v-fixed v-model="open" bgc="#f7f8fa">
        <v-a v-model="det" @end="onend" :edit="detstatus"></v-a>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vA from "./add.vue";
export default {
  props: {
    change: Boolean,
    address_id: [String, Number],
  },
  data() {
    return {
      item: [],
      del: false,
      open: false,
      det: {},
      detstatus: false,
      radio: "",
    };
  },
  watch: {
    open(n) {
      if (!n) {
        this.detstatus = false;
      }
    },
  },
  components: { vA },
  methods: {
    onchangeaddress() {
      let id = this.radio;
      let val = this.item.filter((r) => {
        return +r.address_id === +id;
      });
      this.$emit("change", this.radio, val[0] || {});
      this.$nextTick(() => {
        this.onback();
      });
    },
    onback() {
      this.$emit("close");
    },
    onend() {
      this.open = false;
      this.onPage(1);
    },
    toCity(i) {
      let a = [i.province_name, i.city_name, i.county_name, i.address];
      // eslint-disable-next-line
      return demo.array(a).unique().join("");
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("address", { page, limit: 20 }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    ondetail(e) {
      if (this.del) {
        this.$model.model("删除提示", "是否删除？", (r) => {
          if (r) {
            this.$api.http("addressdel", { address_id: e.address_id }, () => {
              this.$toast("删除成功");
              this.item = this.item.filter((r) => {
                return r.address_id !== e.address_id;
              });
              if (!this.item.length) {
                this.del = false;
              }
            });
          }
        });
      } else {
        this.detstatus = true;
        this.det = e;
        this.open = true;
      }
    },
  },
  mounted() {
    this.radio = this.address_id;
  },
};
</script>
<style lang='less' scoped>
section {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  margin: 10px;
  font-size: 15px;
  padding-right: 50px;
  position: relative;
  min-height: 60px;
  &.change {
    padding-left: 50px;
    padding-right: 10px;
  }
  .name {
    line-height: 22px;
    margin-bottom: 8px;
    font-size: 16px;
    span {
      vertical-align: top;
    }
  }
  .change,
  .edit {
    position: absolute;
    top: 10px;
    z-index: 10;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .edit {
    right: 10px;
    font-size: 20px;
  }
  .change {
    left: 10px;
  }
}
.add_null {
  height: 60px;
}
.add {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  z-index: 30;
  .van-button {
    flex: 1;
    margin-left: 10px;
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
