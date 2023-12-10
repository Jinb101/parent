<template>
  <v-view header ref="view">
    <div class="header_v flex" v-if="child.id">
      <div class="covers">
        <img :src="covrimg" class="db_image" alt="" style="object-fit: cover" />
      </div>
      <div class="logo">
        <v-a :src="child.base_map" :sex="child.gender === '男' ? 1 : 2"></v-a>
      </div>
      <div class="text">
        <h2>
          {{ child.name }} <b>{{ [child.gender, child.age].join(" ") }}</b>
        </h2>
        <p>{{ child.class_name }}</p>
      </div>
    </div>
    <v-page ref="page" @on-page="onPage">
      <van-empty v-if="!item.length"></van-empty>
      <ul>
        <li v-for="(i, j) in item" :key="j" @click.stop="oneve(3, i)">
          <div class="h">
            <div
              class="tag"
              v-if="i.observation_library"
              :class="setclass(i.observation_library)"
            >
              {{ i.observation_library.title }}
            </div>
            <div class="f1"></div>
            <div class="status" :class="{ col_green: +i.state === 2 }">
              家长{{ +i.state === 1 ? "未" : "已" }}读
            </div>
          </div>
          <h6>
            观察时间<b>{{ appTimeout(i.observation_time) }}</b>
          </h6>
          <h6>
            工作内容<b>{{ i.work }}</b>
          </h6>
          <div class="tool van-hairline--top flex">
            <div class="time">{{ appTimeout(i.create_time) }} 发布</div>
            <div class="btns">
              <span class="col_primary" @click.stop="oneve(2, i)">分享</span>
            </div>
          </div>
        </li>
      </ul>
    </v-page>
    <template #fixed>
      <v-fixed v-model="open">
        <v-d v-model="ext" @share="onshare"></v-d>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vA from "../../../newpublic/avatar.vue";
import vD from "./det.vue";
export default {
  data() {
    return {
      item: [],
      val: {},
      covrimg: "",
      cls: [
        "bgc_green",
        "bgc_primary",
        "bgc_purple",
        "bgc_info",
        "bgc_warning",
        "bgc_danger",
        "bgc_pink",
      ],
      clstext: [],
      open: false,
      ext: {},
    };
  },
  components: { vA, vD },
  inject: ["appTimeout", "appPath"],
  computed: {
    child() {
      return this.val;
    },
  },
  watch: {
    open(n) {
      if (!n) {
        this.appPath("/record1", true);
      }
    },
  },
  methods: {
    onshare(e) {
      this.$toast("请点击微信右上角...进行分享");
      this.$refs.view.$share();
      let link = this.$js.wxshareh5("observe", {
        id: e.observe_id,
        path: this.$route.path,
      });
      this.$vx({ link, desc: "您的好友分享给你宝宝观察记录" });
    },
    ondet(observe_id) {
      if (this.open) return 0;
      this.appPath("/record1/" + observe_id, true);
      this.$api.http("a2023051902", { observe_id, open_id: "" }, (r) => {
        this.open = true;
        this.ext = r;
      });
    },
    oneve(i, e) {
      switch (i) {
        case 3:
          this.ondet(e.observe_id);
          break;
        default:
          this.onshare(e);
      }
    },
    setclass(e = {}) {
      if (!e.title) return "";
      if (this.clstext.indexOf(e.title) < 0) {
        this.clstext.push(e.title);
      }
      let n = this.clstext.indexOf(e.title);
      return this.cls[n] || "";
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("a2023051901", { page, limit: 20 }, (e) => {
        this.item = this.item.concat(e.list);
        this.val = e.child || {};
        this.$refs.page.onFinish(e.list.length < 20);
      });
    },
  },
  mounted() {
    let id = this.$route.params.id;
    if (id) {
      this.ondet(id);
    }
    // eslint-disable-next-line
    this.covrimg = siteConfig().icon("banner1", "player");
  },
};
</script>
<style lang='less' scoped>
.header_v {
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  color: #fff;
  .covers {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #38f;
  }
  .logo,
  .text {
    position: relative;
    z-index: 5;
  }
  .text {
    width: calc(100% - 50px);
    box-sizing: border-box;
    padding: 5px 10px;
    h2 {
      font-weight: 650;
      font-size: 16px;
      padding: 5px 0;
      b {
        padding-left: 5px;
        font-size: 14px;
        font-weight: 400;
      }
    }
    p {
      font-size: 14px;
    }
  }
}
li {
  padding: 20px 15px 8px;
  background-color: #fff;
  margin-bottom: 8px;
  font-size: 15px;
  .h {
    height: 24px;
    margin-bottom: 15px;
    line-height: 24px;
    display: flex;
    font-size: 14px;
    .tag {
      padding: 0 10px;
      color: #fff;
    }
    .f1 {
      flex: 1;
    }
    .status {
      color: tomato;
    }
  }
  h6 {
    padding: 5px 0;
    margin-bottom: 3px;
    font-weight: 650;
    b {
      font-weight: 400;
      padding-left: 8px;
      color: #999;
    }
  }
  .tool {
    font-size: 14px;
    align-items: center;
    .btns {
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
      span {
        padding: 15px 0 15px 10px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
