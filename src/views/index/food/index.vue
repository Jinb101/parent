<template>
  <div class="food">
    <v-tool-title>
      <span class="col_green" @click="appPath('/foods_history')">
        历史食谱
      </span>
    </v-tool-title>
    <div class="pub_page">
      <p class="time">{{ time }}</p>
      <section
        v-for="(i, j) in item"
        :key="j + '-f'"
        class="van-hairline--bottom"
      >
        <template v-if="detail.type === '1'">
          <h6 @click="onToggle(i, j)">
            <b>{{ i.day }}({{ i.week }}) </b>
            <span class="arrow">
              <van-icon
                :name="i.check ? 'arrow-up' : 'arrow-down'"
                size="15"
                color="#999"
              />
            </span>
          </h6>
          <transition name="moveright">
            <div class="show" v-if="i.check">
              <article v-for="(x, y) in i.list" :key="y + '-w'">
                <h5>{{ x.title }}</h5>
                <p class="content">{{ x.content }}</p>
                <!-- <p class="desc">主要食材：{{ x.desc }}</p> -->
                <div class="imgs flex fw" v-if="x.img_url && x.img_url.length">
                  <div
                    class="img"
                    v-for="(q, w) in x.img_url"
                    :key="w + '-img'"
                  >
                    <van-image
                      :src="q"
                      fit="cover"
                      @click.stop="appShowImage(x.img_url, w)"
                    ></van-image>
                  </div>
                </div>
              </article>
            </div>
          </transition>
        </template>
        <template v-else>
          <div class="flex fw" v-if="i.list && i.list.length">
            <div class="imgw" v-for="(x, y) in i.list" :key="y + '-img'">
              <van-image
                :src="x"
                fit="cover"
                @click="appShowImage(i.list, y)"
              ></van-image>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: {},
      detail: {},
      item: [],
    };
  },
  computed: {
    time() {
      let val = "";
      if (this.detail.start_time === this.detail.end_time) {
        val = this.detail.start_time;
      } else {
        val = this.detail.start_time + "~" + this.detail.end_time;
      }
      return val + "食谱";
    },
  },
  inject: ["appPath", "appShowImage", "appGetTheme"],
  methods: {
    onToggle(e, j) {
      this.item = this.item.map((s, v) => {
        s.check = j === v ? !e.check : false;
        return s;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.$api.http("foodGetDetail", {}, (e) => {
      this.detail = e;
      this.item = (this.detail.recipes || []).map((s, v) => {
        s.check = v === 0;
        return s;
      });
    });
  },
};
</script>
<style lang='less' scoped>
.food {
  .pub_page {
    overflow-y: scroll;
    .time {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #888;
      padding: 0 10px;
    }
    > section {
      padding: 10px;
      font-size: 15px;
      h6 {
        padding: 8px 0;
        font-weight: 650;
        position: relative;
        .arrow {
          position: absolute;
          right: 0;
          top: 8px;
        }
      }
      .imgw {
        width: 100%;
        padding: 2px;
        box-sizing: border-box;
      }
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
