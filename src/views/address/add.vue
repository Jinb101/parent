<template>
  <div class="address_add">
    <van-field
      v-model="os.consignee"
      label="姓名"
      placeholder="请输入收货人姓名"
      label-width="5em"
    />
    <van-field
      v-model="os.mobile"
      label="电话"
      placeholder="请输入收货人电话"
      label-width="5em"
    />
    <van-field
      readonly
      label="地址"
      placeholder="请选择收货城市"
      right-icon="arrow"
      label-width="5em"
      @click="city = !city"
      v-model="cityzh"
    />
    <van-field
      v-model="os.address"
      label="详细地址"
      placeholder="请输入详细地址"
      label-width="5em"
    />
    <van-field readonly label="设为默认地址" label-width="7em">
      <template #button>
        <van-switch v-model="checked" size="24px" />
      </template>
    </van-field>
    <div class="w80">
      <van-button block round type="primary" @click="onsubmit">{{
        edit ? "编辑" : "保存"
      }}</van-button>
    </div>
    <v-s
      v-model="a"
      :open="city"
      :list="citys"
      @change="onchangecity"
      noselect
    ></v-s>
  </div>
</template>

<script>
import vS from "../newpublic/select.vue";
export default {
  props: {
    value: null,
    edit: Boolean,
  },
  computed: {
    ext: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  components: { vS },
  watch: {
    ext: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  data() {
    return {
      os: {
        consignee: "",
        mobile: "",
        province_id: "",
        city_id: "",
        county_id: "",
        address: "",
        is_default: "",
      },
      checked: false,
      city: false,
      citys: [],
      a: [],
      cityzh: "",
    };
  },
  methods: {
    onchangecity(e, v) {
      this.os.province_id = e[0].i;
      this.os.city_id = e[1].i;
      this.os.county_id = e[2].i;
      this.cityzh = this.$demo.array(v.e).unique().join("");
    },
    init() {
      this.citys = this.$api.city([], true);
      if (this.edit) {
        let a = this.ext;
        this.onchangecity(
          [{ i: a.province_id }, { i: a.city_id }, { i: a.county_id }],
          { e: [a.province_name, a.city_name, a.county_name] }
        );
        this.os.address = a.address;
        this.os.consignee = a.consignee;
        this.os.mobile = a.mobile;
        this.checked = +a.is_default === 1;
      } else {
        let a = this.$demo.$session.get("user", {});
        for (let i in this.os) {
          this.os[i] = "";
        }
        this.os.consignee = a.nickname || "";
        this.os.mobile = a.phone || "";
      }
    },
    onsubmit() {
      if (!this.os.address) return this.$toast("请输入详细地址");
      if (!this.cityzh) return this.$toast("请选择地区");
      let os = { ...this.os };
      if (this.edit) {
        os.address_id = this.ext.address_id;
      }
      os.is_default = this.checked ? "1" : "";
      this.$api.http("addressadd", os, () => {
        this.$toast((this.edit ? "编辑" : "保存") + "成功");
        this.$emit("end", this.edit);
      });
    },
  },
  mounted() {
    this.ext = this.value;
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
