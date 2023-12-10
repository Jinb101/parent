<template>
  <div class="table1">
    <div class="head">
      <slot />
    </div>
    <van-empty description="暂无" v-if="!item.length"></van-empty>
    <section v-for="(i, j) in item" :key="j + '-s'">
      <span v-if="read" class="cover"></span>
      <van-field :label="i.title" readonly v-if="i.type === 'star'">
        <template #button>
          <van-rate
            v-model="os[i.name]"
            :size="25"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
            count="3"
          />
        </template>
      </van-field>
      <van-field
        v-model="os[i.name]"
        :label="i.title"
        placeholder="无"
        v-else-if="i.type === 'text'"
        input-align="right"
      />
      <van-field
        v-model="os[i.name]"
        :label="i.title"
        placeholder="无"
        v-else-if="i.type === 'textarea'"
        type="textarea"
        rows="2"
        autosize
        input-align="right"
      />
      <van-field :label="i.title" readonly v-else-if="i.type === 'num'">
        <template #button>
          <van-stepper v-model="os[i.name]" min="0" max="30" />
        </template>
      </van-field>
    </section>
    <div class="h60" v-if="foot"></div>
    <div class="w80" v-if="foot">
      <van-button block round :color="theme.linear" @click="onSub"
        >添加</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, default: "" },
    text: { type: String, default: "" },
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
    read: { type: Boolean, default: true },
    foot: { type: Boolean, default: false },
  },
  data() {
    return {
      item: [],
      os: {},
      theme: {},
    };
  },
  inject: ["appGetTheme"],
  methods: {
    init() {
      if (this.name && this.text) {
        let ext = this.ext;
        let os = {};
        this.item = this.$demo
          .copy(this.$js.table[this.name][this.text])
          .map((r) => {
            r.val = ext[r.name] ? ext[r.name] : r.val;
            r.val = r.type === "star" ? +r.val : r.val;
            os[r.name] = r.val;
            return r;
          });
        this.os = os;
      }
    },
    onSub() {
      this.$emit("on-sub", this.os, this.item, this.ext);
    },
  },
  mounted() {
    this.init();
    this.theme = this.appGetTheme();
  },
};
</script>
<style lang='less' scoped>
.table1 {
  overflow-y: scroll;
  height: 100%;
  .head {
    padding: 10px;
  }
  .h60 {
    height: 80px;
  }
  section {
    position: relative;
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      background-color: #fff;
      width: 100%;
      height: 100%;
      z-index: 80;
    }
  }
}
</style>
