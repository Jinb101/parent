<template>
  <div class="pub_line_people flex" :class="{ h: !list.length && !add }">
    <div class="po" @click="onShow" v-if="list.length || add">
      <div
        class="ava"
        v-for="(i, j) in list"
        :key="j + '-s'"
        :style="toStyle(j)"
      >
        <van-image :src="i.logo" round fit="cover"></van-image>
      </div>
      <div
        class="add"
        v-if="add && max > list.length"
        :style="toAddStyle"
        @click.stop="onAdd"
      >
        <van-icon name="add-o" size="26" />
      </div>
    </div>
    <div class="more" v-if="more && list.length" @click="onMore">
      <slot name="more" />
      <span><van-icon name="ellipsis" /></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
    len: { type: [String, Number], default: 9 },
    max: { type: [String, Number], default: 9e3 },
    more: { type: Boolean, default: true },
    keys: {
      type: Object,
      default: () => {
        return {
          logo: "avatar",
          name: "name",
          job: "job_name",
        };
      },
    },
    add: { type: Boolean, default: false },
  },
  data() {
    return {
      list: [],
    };
  },
  inject: ["appObject"],
  watch: {
    item: {
      handler() {
        this.init();
      },
      deep: true,
    },
  },
  computed: {
    toAddStyle() {
      let le = this.list.length > 0 ? 43 : 0;
      let sm = this.list.length < 6 && this.list.length > 1 ? 35 : 17;
      return {
        left: this.list.length * sm + le + "px",
      };
    },
  },
  methods: {
    onShow() {
      this.$emit("on-click");
      this.$emit("on-line");
    },
    onMore() {
      this.$emit("on-more");
      this.$emit("on-line");
    },
    onAdd() {
      this.$emit("on-add");
    },
    toStyle(num) {
      let sm = this.list.length < 6 ? 25 : 0;
      return {
        left: (17 + sm) * num + 5 + "px",
        "z-index": this.len + 1 - num,
      };
    },
    init() {
      let o = [];
      let item = this.item;
      let k = this.keys;
      for (let i = 0; i < item.length; i++) {
        o.push({
          logo: item[i][k.logo],
          name: item[i][k.name],
          job: item[i][k.job],
        });
      }
      this.list = o.splice(0, this.len);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='less' scoped>
.pub_line_people {
  height: 50px;
  .po {
    position: relative;
    width: 70%;
  }
  &.h {
    height: 0;
    border: 0;
  }
  .more {
    width: 30%;
    padding: 5px;
    text-align: right;
    box-sizing: border-box;
    line-height: 40px;
    color: #999;
    font-size: 20px;
  }
  .ava {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 5px;
    box-shadow: 3px 0 10px rgb(156, 156, 156);
    border-radius: 50%;
  }
  .add {
    position: absolute;
    z-index: 15;
    width: 40px;
    height: 40px;
    top: 5px;
    text-align: center;
    color: #999;
    .van-icon {
      line-height: 40px;
    }
  }
}
</style>
