<template>
  <div class="growth">
    <v-tool-title></v-tool-title>
    <section
      v-for="(i, j) in item"
      :key="j + '-s'"
      class="flex van-hairline--bottom"
      @click="appPath(i.url)"
    >
      <div class="ico"><van-image :src="i.icon"></van-image></div>
      <p>{{ i.title }}</p>
      <van-icon name="arrow" color="#999" />
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
    };
  },
  inject: ["appPath"],
  methods: {},
  mounted() {
    this.item = this.$js.def.growth;
  },
};
</script>
<style lang='less' scoped>
.growth {
  overflow-y: scroll;
  section {
    padding: 15px;
    font-size: 15px;
    line-height: 40px;
    font-weight: 650;
    .ico {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    p {
      flex: 1;
    }
    .van-icon {
      line-height: 40px;
    }
  }
}
</style>
