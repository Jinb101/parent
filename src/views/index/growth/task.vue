<template>
  <div class="grow_task">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无成长任务" v-if="!item.length" />
      <section v-for="(i, j) in item" :key="j + '-s'" @click="onDetail(i)">
        <van-icon name="arrow" color="#999" />
        <h5>{{ appTimeout(i.create_time, "ymd") }}</h5>
        <p>{{ i.content }}</p>
        <div class="ava" v-if="i.picture && i.picture.length">
          <van-image
            :src="i.picture[0]"
            fit="cover"
            @click.stop="appShowImage(i.picture[0])"
          ></van-image>
        </div>
      </section>
    </v-tool-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
    };
  },
  inject: ["appTimeout", "appShowImage", "appPath"],
  methods: {
    onDetail(e) {
      this.appPath("/growth_task_det/" + e.id);
    },
    onPage(e) {
      this.$api.http("growthTask", { page: e, limit: 20 }, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
  },
  mounted() {
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.grow_task {
  section {
    padding: 10px;
    font-size: 15px;
    position: relative;
    h5 {
      font-weight: 650;
      line-height: 30px;
      height: 30px;
    }
    .van-icon {
      position: absolute;
      right: 10px;
      top: 10px;
      line-height: 30px;
    }
    p {
      padding: 5px 0;
      line-height: 1.2;
    }
    .ava {
      height: 200px;
      border-radius: 5px;
      overflow: hidden;
    }
  }
}
</style>
