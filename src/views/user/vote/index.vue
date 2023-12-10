<template>
  <v-view header index="500" ref="view">
    <template #menu>
      <span @click="open1 = true">投票筛选</span>
    </template>
    <transition name="van-slide-down">
      <div class="vote_search" v-if="open1">
        <van-field
          v-model="search.activity_name"
          label="活动名称"
          placeholder="请输入活动名称,选填"
          label-width="5em"
        />
        <van-field label="活动类型" label-width="5em" readonly>
          <template #button>
            <van-radio-group
              v-model="search.activity_type"
              direction="horizontal"
            >
              <!-- <van-radio name="0">全部</van-radio> -->
              <van-radio name="1">全园</van-radio>
              <van-radio name="2">班级</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-cell title="活动状态"></van-cell>
        <div class="s">
          <van-radio-group v-model="search.type" direction="horizontal">
            <!-- <van-radio name="0">全部</van-radio> -->
            <van-radio name="1">进行中</van-radio>
            <!-- <van-radio name="2">未开始</van-radio> -->
            <van-radio name="3">已结束</van-radio>
          </van-radio-group>
        </div>
        <div class="b">
          <van-button block round type="info" @click="onPage(1)"
            >点击搜索</van-button
          >
          <van-button block round @click="open1 = false">取消</van-button>
        </div>
      </div>
    </transition>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <ul>
        <li v-for="(i, j) in item" :key="j" class="flex" @click.stop="ondet(i)">
          <div class="logo">
            <img :src="i.cover_image" alt="" class="db_image" />
          </div>
          <div class="text">
            <h2 v-html="totitle(i.activity_name)"></h2>
            <p>{{ +i.activity_type === 1 ? "全园" : "班级" }}活动</p>
            <p>参与人数：{{ i.number }}人</p>
            <p>总得分：{{ i.total_score }}分</p>
            <p>浏览量：{{ i.visits }}</p>
            <p>活动时间：{{ appTimeout(i.start_time, "alls") }}</p>
            <p>{{ appTimeout(i.end_time, "alls") }}</p>
          </div>
        </li>
      </ul>
    </v-page>
    <template #fixed>
      <v-fixed
        v-model="open3"
        bgc="#f8f7fa"
        index="610"
        retreat
        :header="false"
      >
        <span @click="onshare" class="share_btn">分享</span>
        <v-c v-model="child" @end="onPage(1)"></v-c>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vD from "./det.vue";
import vC from "./child.vue";
import vS from "../../newpublic/search.vue";
export default {
  data() {
    return {
      open1: false,
      open2: false,
      open3: false,
      item: [],
      search: {
        activity_type: "",
        activity_name: "",
        type: "1",
      },
      ext: {},
      child: {},
      params: {},
    };
  },
  components: { vD, vC, vS },
  inject: ["appTimeout", "appPath"],
  watch: {
    open3(n) {
      if (!n) {
        this.appPath("/vote/" + this.params.id, true);
      }
    },
    open2(n) {
      if (!n) {
        this.appPath("/vote", true);
      }
    },
  },
  methods: {
    totitle(e) {
      if (!e) {
        return "";
      }
      let t = (e + "").split("/#br#/").join("<br>");
      return t;
    },
    onshare() {
      this.$toast("请点击微信右上角...进行分享");
      this.$refs.view.$share();
    },
    onshowchild(e) {
      this.appPath("/vote/" + this.params.id + "&" + e);
      // this.$api.http("a2023052304", { voters_id: e }, (r) => {
      //   this.child = r;
      //   this.open3 = true;
      // });
    },
    ondet(e) {
      this.appPath("/vote/" + e.vote_id);
      // this.$api.http("a2023052302", { vote_id: e.vote_id }, (r) => {
      //   this.params.id = e.vote_id;
      //   this.ext = r;
      //   this.open2 = true;
      //   if (this.params.cid) {
      //     this.onshowchild(this.params.cid);
      //   }
      // });
    },
    onPage(page, f) {
      this.open1 = false;
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let os = {
        ...this.search,
      };
      if (+os.activity_type === 0) {
        os.activity_type = "";
      }
      if (+os.type === 0) {
        os.type = "";
      }
      this.$api.http("a2023052301", { page, ...os }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
  },
  mounted() {
    this.params = this.$route.params;
    if (this.params.id) {
      this.ondet({ vote_id: this.params.id });
    }
  },
};
</script>
<style lang='less' scoped>
.vote_search {
  position: fixed;
  left: 0;
  top: 50px;
  z-index: 20;
  background-color: #fff;
  width: 100%;
  padding: 10px 0;
  border-radius: 0 0 40px 40px;
  .s {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }
  .b {
    margin: 30px auto 10px;
    width: 65%;
    .van-button + .van-button {
      margin-top: 10px;
    }
  }
}
li {
  width: 96%;
  margin: 0 auto 10px;
  background-color: #fff;
  font-size: 15px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 10px;
  .logo {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .text {
    width: calc(100% - 110px);
    h2 {
      padding: 8px 0;
      font-weight: 650;
    }
    p {
      line-height: 1.3;
      color: #999;
      font-size: 14px;
    }
  }
}
.share_btn {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 14px;
  padding: 10px;
  z-index: 30;
}
</style>
