<template>
  <div class="bind">
    <v-tool-title :text="title"></v-tool-title>
    <div class="pub_page">
      <van-field
        v-model="g"
        label="选择年级"
        placeholder="请选择年级"
        required
        readonly
        right-icon="arrow"
        input-align="right"
        @click="cg"
      />
      <van-field
        v-model="c"
        label="选择班级"
        placeholder="请选择班级"
        required
        readonly
        right-icon="arrow"
        input-align="right"
        @click="cc"
      />
      <van-field
        v-model="value"
        label="学号"
        placeholder="请输入学号"
        required
        type="digit"
        input-align="right"
      />
      <van-field
        v-model="r"
        label="关系"
        placeholder="请选择关系"
        required
        readonly
        right-icon="arrow"
        input-align="right"
        @click="cr"
        v-if="!sr"
      />
      <van-field
        v-model="r"
        label="关系"
        placeholder="请输入关系"
        required
        input-align="right"
        v-else
      />
    </div>
    <transition name="fade">
      <div class="bind_btn" v-if="id === '0'">
        <van-button block :color="theme.linear" @click="onSub">绑定</van-button>
      </div>
    </transition>
    <transition name="fade">
      <div class="app_show_fixed a" v-if="id === '1'">
        <van-icon name="user-o" size="55" :color="theme.bgc" />
        <p class="col_green">正在审核中，请耐心等待。。。</p>
        <div class="w60">
          <van-button block round :color="theme.linear" @click="toBack"
            >返回</van-button
          >
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="app_show_fixed a" v-if="id === '2'">
        <van-icon name="cross" size="55" color="tomato" />
        <p class="col_danger">未通过审核，请重试！</p>
        <p class="col_danger" v-if="err">{{ err }}</p>
        <div class="w60">
          <van-button block round :color="theme.linear" @click="id = '0'"
            >重新申请</van-button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    childData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      id: "",
      theme: {},
      value: "",
      cls: [],
      gid: "",
      g: "",
      cid: "",
      c: "",
      r: "爸爸",
      classes: [],
      relation: [],
      sr: false,
      err: "",
    };
  },
  computed: {
    title() {
      let a = this.id;
      return ["绑定宝宝", "审核中", "未通过审核"][+a];
    },
  },
  watch: {
    childData: {
      handler(n) {
        let d = n.data;
        if (n.type === "change_cls") {
          this.cid = "";
          this.c = "";
          this.gid = d.id;
          this.g = d.name;
          // 获取班级
          if (!d.child.length) {
            this.appGetClass(d.id, (s) => {
              this.classes = this.cls[d.sort].child = s.map((vs) => {
                vs.name = vs.nickname;
                return vs;
              });
            });
          } else {
            this.classes = d.child;
          }
        }
        if (n.type === "change_class") {
          this.cid = d.id;
          this.c = d.name;
        }
        if (n.type === "change_relation") {
          this.sr = d.name === "其他";
          this.r = this.sr ? "" : d.name;
        }
      },
      deep: true,
    },
    id(n) {
      if (+n === 2) {
        this.appGetInfo((e) => {
          this.err = e.examine_reject;
        });
      }
    },
  },
  inject: [
    "appGetTheme",
    "appOpenPopup",
    "appGetClass",
    "appBack",
    "appGetInfo",
  ],
  methods: {
    toBack() {
      this.$demo.$session.set("app-time-user", 0);
      this.appBack(true);
    },
    onSub() {
      if (!this.cid) return this.$model.info("请选择班级", 2);
      if (!this.value) return this.$model.info("请输入学号", 2);
      if (!this.r) return this.$model.info("请选择关系", 2);
      this.$api.http(
        "bindBaby",
        {
          grade: this.gid,
          class_id: this.cid,
          no: this.value,
          sex: "",
          date_of_birth: "",
          relevance: this.r,
        },
        () => {
          this.$model.info("申请成功", 2);
          this.toBack();
        }
      );
    },
    opens(title, types, item) {
      this.appOpenPopup({
        title,
        types,
        item,
      });
    },
    cg() {
      this.opens("选择年级", "change_cls", this.cls);
    },
    cc() {
      this.opens("选择班级", "change_class", this.classes);
    },
    cr() {
      this.opens("选择关系", "change_relation", this.relation);
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.theme = this.appGetTheme();
    this.relation = this.$api.relation();
    this.cls = this.$api.classes().map((r, v) => {
      r.child = [];
      r.sort = v;
      return r;
    });
  },
};
</script>
<style lang='less' scoped>
.bind {
  .pub_page {
    overflow-y: scroll;
    padding-bottom: 44px;
    box-sizing: border-box;
  }
  .bind_btn {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 44px;
    width: 100%;
  }
  .a {
    text-align: center;
    font-size: 14px;
    padding-top: 20%;
    p {
      margin-top: 30px;
    }
  }
}
</style>
