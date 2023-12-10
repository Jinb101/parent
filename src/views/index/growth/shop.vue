<template>
  <div class="grow_shop">
    <v-tool-title>
      <span @click="appShowImage(img)">
        <van-icon name="expand-o" size="20" color="#999" />
      </span>
    </v-tool-title>
    <div class="ava">
      <van-image :src="img" @click="appShowImage(img)"></van-image>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { img: "" };
  },
  inject: ["appShowImage"],
  methods: {},
  mounted() {
    this.$api.http("growIntegralWin", {}, (e) => {
      this.img = e.img;
    });
  },
};
</script>
<style lang='less' scoped>
.grow_shop {
  .ava {
    height: calc(100% - 46px);
  }
}
</style>
