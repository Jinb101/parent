<template>
  <div class="food_history">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty description="暂无历史食谱" v-if="!item.length" />
      <section v-for="(i, j) in item" :key="j + '-s'">
        <p class="time">
          <b>{{ i.start_time }}~{{ i.end_time }}食谱</b>
        </p>
        <template v-if="i.type === '1'">
          <van-collapse
            v-model="activeName"
            accordion
            v-if="i.recipes && i.recipes.length"
          >
            <van-collapse-item
              :title="x.day + '(' + x.week + ')'"
              :name="j * 100 + y"
              v-for="(x, y) in i.recipes"
              :key="y + '-w'"
            >
              <article v-for="(q, w) in x.list" :key="w + '-ar'">
                <h5>{{ q.title }}</h5>
                <p class="content">{{ q.content }}</p>
                <!-- <p class="desc">主要食材：{{ q.desc }}</p> -->
                <div class="imgs flex fw" v-if="q.img_url && q.img_url.length">
                  <div
                    class="img"
                    v-for="(t, c) in q.img_url"
                    :key="c + '-img'"
                  >
                    <van-image
                      :src="t"
                      fit="cover"
                      @click.stop="appShowImage(q.img_url, c)"
                    ></van-image>
                  </div>
                </div>
              </article>
            </van-collapse-item>
          </van-collapse>
        </template>
        <template v-else>
          <x-content>
            <div
              class="flex fw"
              v-if="
                i.recipes &&
                i.recipes[0] &&
                i.recipes[0].list &&
                i.recipes[0].list.length
              "
            >
              <div
                class="imgw"
                v-for="(x, y) in i.recipes[0].list"
                :key="y + '-img'"
              >
                <van-image
                  :src="x"
                  fit="cover"
                  @click="appShowImage(i.recipes[0].list, y)"
                ></van-image>
              </div>
            </div>
          </x-content>
        </template>
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
      activeName: "",
      os: {},
    };
  },
  inject: ["appPath", "appShowImage"],
  methods: {
    onPage(e) {
      this.$api.http("foodHistory", { page: e, limit: 20 }, (r) => {
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
.food_history {
  font-size: 15px;
  // overflow-y: scroll;
  section {
    padding: 15px 0;
    .time {
      position: relative;
      text-align: center;
      font-size: 12px;
      line-height: 40px;
      height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
      span {
        position: absolute;
        right: 10px;
        top: 5px;
        padding: 0 10px;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border-radius: 5px;
      }
    }
    .imgw {
      width: 100%;
      padding: 2px;
      box-sizing: border-box;
    }
    article {
      position: relative;
      font-size: 15px;
      color: #777;
      box-sizing: border-box;
      padding-right: 40px;
      .add {
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        height: 40px;
        width: 40px;
        box-sizing: border-box;
        border: 1px dashed #999;
        border-radius: 20%;
        .van-icon {
          line-height: 38px;
        }
      }
      h5 {
        font-weight: 550;
        padding: 8px 0;
        color: #444;
        letter-spacing: 2px;
      }
      .content,
      .desc,
      .imgs {
        line-height: 1.5;
        margin-bottom: 10px;
      }
      .img {
        width: 80px;
        height: 80px;
        margin: 0 10px 10px 0;
        position: relative;
        .del {
          position: absolute;
          right: -15px;
          top: -15px;
          width: 30px;
          height: 30px;
          background-color: tomato;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          transform: scale(0.6);
          .van-icon {
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>
