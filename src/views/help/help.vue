<template>
  <v-view header>
    <template #menu>
      <span class="search_menu" @click="open = true" v-if="!open">
        <van-icon name="search" />
      </span>
    </template>
    <template v-if="ismenu">
      <div class="app_top hidden">
        <van-tabs v-model="type" swipe-threshold="3">
          <van-tab
            :title="i.title"
            :name="i.id"
            v-for="(i, j) in menu"
            :key="j"
          ></van-tab>
        </van-tabs>
      </div>
      <div class="v flex">
        <div class="l van-hairline--right" v-if="menu2.length">
          <section
            v-for="(x, y) in menu2"
            :key="y + '-2'"
            @click="type2 = x.id"
            :class="{ active: type2 === x.id }"
          >
            {{ x.title }}
          </section>
        </div>
        <div class="r" :class="{ no: menu2.length < 1 }">
          <v-page v-if="start" ref="page" @on-page="onPage">
            <van-empty v-if="!item.length"></van-empty>
            <van-cell
              v-for="(q, w) in item"
              :key="w + '-3'"
              :title="q.problem"
              is-link
              @click="ondetail(q)"
            ></van-cell>
          </v-page>
        </div>
      </div>
    </template>
    <van-empty v-else description="暂无哟，请联系客服添加"></van-empty>
    <template #fixed>
      <v-f v-model="open" :footer="false" text="搜索" :index="500">
        <v-s
          :list="menu"
          @change="onsearchchange"
          @detail="onsearchdetail"
        ></v-s>
      </v-f>
      <v-f v-model="open1" :footer="false" :text="detailtext" :index="510">
        <v-d :pid="pid" @end="tosettext"></v-d>
      </v-f>
    </template>
  </v-view>
</template>

<script>
import vS from "./_help_search.vue";
import vD from "./_help_detail.vue";
import vF from "../newpublic/fixed.vue";
export default {
  data() {
    return {
      menu: [],
      menu2: [],
      type: "",
      type2: "",
      start: false,
      item: [],
      open: false,
      open1: false,
      pid: "",
      detailtext: "",
    };
  },
  components: { vS, vD, vF },
  computed: {
    ismenu() {
      return this.menu.length > 0;
    },
    searchtype() {
      if (this.menu2.length > 0) {
        return this.type2 || this.type;
      }
      return this.type || "";
    },
  },
  inject: ["appPath"],
  watch: {
    type() {
      this.checktype();
    },
    searchtype(n) {
      if (this.start && n) {
        this.topath();
        this.onPage(1);
      }
    },
    open1(n) {
      if (!n) {
        this.pid = "";
        this.topath();
      }
    },
  },
  methods: {
    tosettext(e = {}) {
      this.detailtext = e.problem;
    },
    topath(id = 0) {
      let s = id + "&" + [this.type, this.type2].join("_"); // id type
      this.appPath("/help/" + s, true);
      // 分享
      this.$vx();
    },
    onsearchchange(e, b) {
      this.open = false;
      this.type = e;
      this.type2 = b;
    },
    onsearchdetail(e) {
      this.ondetail(e);
    },
    ondetail(e) {
      this.detailtext = e.problem || "详情";
      this.pid = e.problem_id;
      this.topath(this.pid);
      // 查看详情
      this.open1 = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "helplist",
        { page, classify_id: this.searchtype },
        (e) => {
          this.item = this.item.concat(e);
          this.$refs.page.onFinish(e.length < 20);
        }
      );
    },
    setwait() {
      this.start = true;

      let params = this.$route.params;
      if (params.type && this.menu.length) {
        let v = params.type.split("_");
        this.type = +v[0];
        this.$nextTick(() => {
          if (v[1] > 0) {
            this.type2 = +v[1];
          }
        });
      }
      if (params.id > 0) {
        this.$nextTick(() => {
          this.ondetail({ problem_id: params.id });
        });
      }
    },
    init() {
      this.$api.http("helptype", {}, (r) => {
        this.menu = r;
        this.$nextTick(() => {
          this.setwait();
        });
      });
    },
    checktype() {
      let id = this.type;
      this.menu2 = [];
      this.type2 = "";
      let a =
        this.menu.filter((r) => {
          return +r.id === +id;
        })[0] || {};
      if (a.id) {
        if (a.children && a.children.length) {
          this.menu2 = a.children;
          this.type2 = this.menu2[0].id;
        }
      }
    },
  },
  mounted() {
    // params 一级分类&二级分类&详情id
    this.init();
  },
};
</script>
<style lang='less' scoped>
.v {
  height: calc(100% - 44px);
  .l {
    width: 100px;
    height: 100%;
    overflow-y: scroll;
    section {
      padding: 20px 10px;
      font-size: 14px;
      font-weight: 600;
      color: #666;
      line-height: 1.2;
      position: relative;
      transition: all 0.3s;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 2px;
        height: 16px;
        background-color: #38f;
        content: "";
        opacity: 0;
        transition: all 0.3s;
      }
      &.active {
        background-color: rgb(232, 241, 255);
        color: #222;
        font-size: 15px;
        &::before {
          opacity: 1;
        }
      }
    }
  }
  .r {
    width: calc(100% - 100px);
    &.no {
      width: 100%;
    }
  }
}
.search_menu {
  padding: 5px 10px !important;
  border: 1px solid #ccc;
  border-radius: 15px;
  width: 100px;
  display: inline-block;
  box-sizing: border-box;
  line-height: 1 !important;
  text-align: right;
  transform: translateY(5px);
  position: relative;
  &::before {
    position: absolute;
    content: "点击搜索";
    left: 10px;
    top: 0;
    font-size: 12px;
    color: #ccc;
    bottom: 0;
    margin: auto;
    height: 12px;
  }
}
.hidden {
  height: 0;
  overflow: hidden;
}
</style>
