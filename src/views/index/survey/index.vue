<template>
  <div class="survey">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty v-if="!item.length" description="暂无调研记录" />
      <section v-for="(i, j) in item" :key="j + '-w'" @click.stop="onDetail(i)">
        <p class="time">{{ appTimeout(i.create_time) }}</p>
        <div class="box">
          <p class="name">
            <b>{{ i.name }}</b>
          </p>
          <p>
            选择题：<b class="col_primary">{{ i.choice }}道</b>
          </p>
          <p>
            问答题：<b class="col_primary">{{ i.ask_and_answer }}道</b>
          </p>
          <span class="status" v-if="+i.status === 1">
            <van-image :src="$js.def.icon.end.icon"></van-image>
          </span>
          <van-button
            v-else
            round
            size="small"
            :color="theme.bgc"
            @click.stop="onSend(i)"
          >
            去答题
          </van-button>
        </div>
      </section>
    </v-tool-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: {},
      item: [],
      pageOpen: 0,
      pageEnd: false,
    };
  },
  inject: ["appGetTheme", "appTimeout", "appPath"],
  methods: {
    onDetail(e) {
      if (!e.status) return 0;
      this.appPath("/survey_detail/" + e.id + "&" + e.r_id);
    },
    onSend(e) {
      this.appPath("/survey_add/" + e.id + "&" + e.r_id);
    },
    onPage(e) {
      this.$api.http("feedBack", { page: e, limit: 20 }, (r) => {
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
    this.theme = this.appGetTheme();
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.survey {
  background-color: #f5f5f5;
  font-size: 15px;
  section {
    padding: 15px;
    .time {
      padding: 5px 10px;
      margin: 0 auto 10px;
      background-color: #dfdfdf;
      color: #fff;
      text-align: center;
      width: 120px;
      border-radius: 5px;
      transform: scale(0.8);
    }
    .box {
      background-color: #fff;
      padding: 15px 10px;
      position: relative;
      border-radius: 2px;
      .name {
        font-weight: 650;
        color: #333;
      }
      .status {
        position: absolute;
        right: 0;
        top: 0;
        width: 66px;
        height: 58px;
      }
      .van-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
        min-width: 75px;
      }
      p {
        line-height: 1.2;
        margin-bottom: 5px;
        color: #888;
        b {
          font-weight: 600;
        }
      }
    }
  }
}
</style>
