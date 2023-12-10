<template>
  <div class="listen_detail_2">
    <v-tool-title></v-tool-title>
    <v-v
      class="player"
      :wh="{ width: '100%', height: '100%' }"
      :item="[{ img, cover }]"
    ></v-v>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage" class="view">
      <van-empty v-if="!item.length" description="暂无故事" />
      <section
        v-for="(i, j) in item"
        :key="j + '-v'"
        class="flex van-hairline--bottom"
        :class="{ active: img === i.video }"
        @click="onPlayed(i)"
      >
        <div class="p" v-if="img !== i.video">
          <van-icon name="play" />
        </div>
        <div class="log">
          <van-image :src="i.schoolroom.cover"></van-image>
        </div>
        <div class="text">
          <h5>{{ i.head }}</h5>
          <p class="desc van-multi-ellipsis--l3">{{ i.schoolroom.courses }}</p>
        </div>
      </section>
    </v-tool-page>
  </div>
</template>

<script>
import vV from "../private/video2.vue";
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
      img: "",
      cover: "",
    };
  },
  inject: ["appTimeout"],
  components: { vV },
  methods: {
    onPlayed(e) {
      this.img = e.video;
      this.cover = e.schoolroom.cover;
    },
    onPage(e) {
      this.$api.http(
        "storeParentDetail",
        { schoolroom_id: this.id, page: this.page, limit: 20 },
        (r) => {
          this.pageOpen++;
          if (e === 1) {
            this.item = r;
            if (r.length) {
              this.onPlayed(r[0]);
            }
            return 0;
          }
          this.item = this.item.concat(r);
          this.pageEnd = r.length !== 20;
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.listen_detail_2 {
  .player {
    height: 210px;
  }
  .view {
    height: calc(100% - 256px);
  }
  section {
    padding: 15px;
    font-size: 15px;
    position: relative;
    .p {
      position: absolute;
      width: 30px;
      height: 30px;
      left: 50px;
      top: 25px;
      text-align: center;
      font-size: 25px;
      z-index: 25;
      color: #fff;
      .van-icon {
        line-height: 30px;
      }
    }
    .log {
      width: 100px;
      height: 56px;
      margin-right: 4px;
      border-radius: 5px;
      overflow: hidden;
    }
    .text {
      color: #999;
      font-size: 12px;
      line-height: 15px;
      width: calc(100% - 100px);
      h5 {
        font-weight: 650;
        font-size: 15px;
        padding: 3px 0;
        color: #333;
      }
      .desc {
        height: 45px;
      }
    }
    &.active {
      .text {
        color: #bdcca0;
        h5 {
          color: #99cc33;
        }
      }
    }
  }
}
</style>
