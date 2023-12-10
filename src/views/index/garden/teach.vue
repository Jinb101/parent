<template>
  <div class="teach">
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <section v-for="(i, j) in item" :key="j">
        <div class="flex" @click="ondet(i.id)">
          <div class="ico">
            <van-image :src="i.image[0]" fit="cover" radius="5px"></van-image>
          </div>
          <div class="stro">
            <h6 class="van-ellipsis">{{ i.title }}</h6>
            <p class="van-multi-ellipsis--l2" v-if="i.content">
              <b>简介：</b>{{ i.content }}
            </p>
            <p class="van-multi-ellipsis--l2" v-if="i.declaration">
              <b>教育宣言：</b>{{ i.declaration }}
            </p>
          </div>
        </div>
      </section>
    </v-page>
  </div>
</template>

<script>
import vPage from "../../newpublic/page.vue";
export default {
  data() {
    return {
      item: [],
    };
  },
  inject: ["appPath"],
  components: { vPage },
  methods: {
    ondet(id) {
      this.appPath("/teach_detail/" + id);
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("info", { page, type: 1 }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
.teach {
  .flex {
    padding: 15px;
  }
  .ico {
    width: 120px;
    height: 120px;
  }
  .stro {
    width: calc(100% - 120px);
    box-sizing: border-box;
    padding-left: 10px;
    h6 {
      line-height: 18px;
      font-size: 16px;
      height: 18px;
      margin-bottom: 18px;
      padding-top: 8px;
    }
    p {
      font-size: 14px;
      line-height: 16px;
      max-height: 32px;
      margin-bottom: 5px;
      b {
        color: #999;
      }
    }
  }
}
</style>
