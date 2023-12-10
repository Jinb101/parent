<template>
  <div class="avatar">
    <van-image :src="imgs" fit="cover" round @click="appShowImage(imgs)">
      <template v-slot:error>
        <van-image :src="sex_icon" fit="cover"></van-image>
      </template>
    </van-image>
    <div class="sex" v-if="sex">
      <van-image :src="sex_icon" round></van-image>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    sex: [String, Number],
    value: null,
    teacher: Boolean,
  },
  inject: ["appShowImage"],
  computed: {
    sex_icon() {
      // sex 1男 2女 3其他
      let arr = this.teacher ? ["sex", "man", "women"] : ["", "boy", "girl"];
      let val = arr[+this.sex] || "";
      if (val) {
        return this.$js.config.icon(val, "private");
      }
      return "";
    },
    pic: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    imgs() {
      if (this.pic) return this.pic;
      if (this.src) return this.src;
      let num = +this.sex > 0 ? +this.sex + 2 : 3;
      if (this.teacher) {
        num += 2;
      }
      return this.$js.config.icon(num, "people");
    },
  },
  watch: {
    pic(n) {
      this.$emit("input", n);
    },
  },
  data() {
    return {
      avatar: "",
    };
  },
  methods: {},
  mounted() {
    this.pic = this.value;
  },
};
</script>
<style lang='less' scoped>
.avatar {
  position: relative;
  width: 50px;
  height: 50px;
  .sex {
    position: absolute;
    right: 0;
    top: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #fff;
  }
}
</style>
