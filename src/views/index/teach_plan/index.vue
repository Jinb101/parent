<template>
  <div class="teach_plan">
    <v-tool-title></v-tool-title>
    <div class="pub_page">
      <section v-for="(i, j) in item" :key="j + '-s'">
        <span class="time">{{ appTimeout(i.created_time, "ymd") }}</span>
        <h6>{{ i.nickname }}</h6>
        <div class="ava">
          <van-image
            :src="i.img_url"
            fit="cover"
            @click="appShowImage(i.img_url)"
          ></van-image>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { item: [] };
  },
  inject: ["appTimeout", "appShowImage"],
  methods: {},
  mounted() {
    this.$api.http("teachPlan", {}, (e) => {
      this.item = e;
    });
  },
};
</script>
<style lang='less' scoped>
.teach_plan {
  font-size: 16px;
  .pub_page {
    overflow-y: scroll;
  }
  section {
    padding: 10px;
    padding-top: 30px;
    position: relative;
    margin-bottom: 15px;
    h6 {
      font-weight: 650;
      line-height: 35px;
      height: 35px;
    }
    .time {
      position: absolute;
      height: 20px;
      top: 15px;
      left: 0;
      right: 0;
      margin: auto;
      background-color: #eee;
      color: #999;
      font-size: 12px;
      line-height: 20px;
      width: 120px;
      text-align: center;
      border-radius: 10px;
      opacity: 0.6;
    }
    .ava {
      height: 200px;
      border-radius: 5px;
      overflow: hidden;
    }
  }
}
</style>
