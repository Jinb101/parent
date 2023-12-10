<template>
  <div class="garden_honor">
    <!-- <v-tool-title>
      <span @click="onCheckStatus">
        <van-icon name="bars" size="20" color="#999" v-if="state === '0'" />
        <van-icon name="shrink" size="20" color="#999" v-else />
      </span>
    </v-tool-title> -->
    <div class="ava flex fw">
      <div
        class="img"
        :class="{ lang: state === '1' }"
        v-for="(i, j) in image"
        :key="j + '-s'"
        @click="appShowImage(image, j, 'url')"
      >
        <van-image :src="i.url" fit="cover"></van-image>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: [],
      state: "0",
    };
  },
  inject: ["appShowImage"],
  methods: {
    onCheckStatus() {
      let s = this.state === "0" ? "1" : "0";
      this.$demo.$local.set("garden-status", s);
      this.state = s;
    },
  },
  mounted() {
    this.state = this.$demo.$local.get("garden-status", "0");
    this.$api.http("gardenHonor", {}, (e) => {
      this.image = e;
    });
  },
};
</script>
<style lang='less' scoped>
.garden_honor {
  overflow-y: scroll;
  .ava {
    width: 360px;
    margin: 0 auto;
  }
  .img {
    width: 120px;
    height: 120px;
    margin-bottom: 10px;
    box-sizing: border-box;
    padding: 5px;
    transition: all 0.3s;
    &.lang {
      width: 360px;
      height: 200px;
      border-radius: 5px;
      overflow: hidden;
      padding: 0;
    }
  }
}
</style>
