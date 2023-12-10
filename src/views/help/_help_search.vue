<template>
  <div class="help_search">
    <v-s v-model="val" @search="init" focus unauto></v-s>
    <template v-if="issearch">
      <v-page ref="page" @on-page="onPage">
        <van-empty v-if="!item.length"></van-empty>
        <van-cell
          v-for="(q, w) in item"
          :key="w + '-3'"
          :title="q.problem"
          is-link
          @click="ondetail(q)"
        ></van-cell>
      </v-page>
    </template>
    <template v-else>
      <div class="box" v-if="localitem.length">
        <h5>搜索历史</h5>
        <span class="del" @click="onclear">
          <van-icon name="delete-o" />
        </span>
        <div class="list flex fw">
          <van-tag
            size="large"
            color="#f1f1f1"
            text-color="#999"
            v-for="(i, j) in localitem"
            :key="j + '-l'"
            @click="ondetlocal(i)"
          >
            {{ toLocalText(i) }}
          </van-tag>
        </div>
      </div>
      <div class="box" v-if="list.length">
        <h5>你可能感兴趣</h5>
        <div class="list flex fw">
          <van-tag
            :type="tocolor()"
            size="large"
            v-for="(i, j) in list"
            :key="j"
            @click="onmenus(i)"
            >{{ i.title }}</van-tag
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import vS from "../newpublic/search.vue";
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      val: "",
      item: [],
      issearch: false,
      local: "eventhelpsearch",
      localitem: [],
      searchname: "",
    };
  },
  components: { vS },
  methods: {
    toLocalText(e) {
      let v = (e + "").split("");
      if (v.length > 8) {
        v = v.splice(0, 8);
        v.push("...");
      }
      return v.join("");
    },
    setlocal(val) {
      let arr = this.localitem.filter((r) => {
        return r !== val;
      });
      if ((val + "").length > 1) {
        arr.unshift(val);
        arr = arr.splice(0, 30);
        // eslint-disable-next-line
        demo.$local.set(this.local, arr);
        this.$nextTick(() => {
          this.localitem = arr;
        });
      }
    },
    tocolor() {
      // eslint-disable-next-line
      return ["primary", "success", "warning"][demo.rand(0, 2)];
    },
    ondetlocal(e) {
      this.val = e;
      this.init(e);
    },
    init(e) {
      this.searchname = e;
      if (this.issearch) {
        this.onPage(1);
      }
      this.issearch = true;
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http("helplist", { page, problem: this.searchname }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
        if (e.length > 0 && page === 1) {
          this.setlocal(this.searchname);
        }
      });
    },
    ondetail(e) {
      this.$emit("detail", e);
    },
    onmenus(e) {
      let id = e.id;
      let id2 = "";
      if (e.children && e.children.length) {
        id2 = e.children[0].id;
      }
      this.$emit("change", id, id2);
    },
    onclear() {
      this.$js.model("", "是否清除搜索记录", (r) => {
        if (r) {
          // eslint-disable-next-line
          demo.$local.clear(this.local);
          this.localitem = [];
          this.$toast("清除完成");
        }
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    this.localitem = demo.$local.get(this.local, []);
  },
};
</script>
<style lang='less' scoped>
.box {
  margin: 10px 10px 0;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  .del {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 40px;
    height: 40px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h5 {
    font-size: 15px;
    font-weight: 650;
    padding: 8px 0;
  }
  .list {
    margin-top: 10px;
    .van-tag {
      margin: 0 10px 10px 0;
    }
  }
}
</style>
