<template>
  <div class="app_tabbar">
    <van-tabbar
      v-model="active"
      :fixed="fixed"
      :active-color="col[0]"
      :inactive-color="col[1]"
      @change="onChange"
    >
      <van-tabbar-item
        v-for="(i, j) in item"
        :key="j + '-bar'"
        :name="i.name"
        :dot="i.dot > 0"
      >
        <span>{{ i.title }}</span>
        <template #icon="props">
          <img style="z-index: 999;" :src="props.active ? i.icons : i.icon" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fixed: {
      type: Boolean,
      defalut: false,
    },
    select: { type: String, default: "" },
    color: {
      type: Array,
      defalut: () => {
        return [];
      },
    },
    index: { type: Boolean, defalut: false },
    noclass: Boolean,
  },
  data() {
    return {
      active: "",
      item: [],
      col: ["#99cc33", "#222"],
    };
  },
  computed: {
    ...mapState({ vuex_dots: "tabbarStatus" }),
  },
  watch: {
    active(i) {
     console.log(i);
    },
    select() {
      this.setActive();
    },
    vuex_dots: {
      handler(n) {
        if (n.index) {
          this.$set(this.item[n.index], "dot", n.num);
        }
      },
      deep: true,
    },
    noclass(n) {
      this.setList();
    },
  },
  inject: ["appObject", "appPath", "appGetParams"],
  methods: {
    onChange(e) {
      let path = e === "home" ? "index" : e;
      this.appPath("/" + path);
    },
    setIndex() {
      if (this.index) {
        let menulevel = this.$demo.$session.get("menulevel", {});
        let c = menulevel.close || [];
        let vbar = JSON.parse(JSON.stringify(this.$js.def.tabbar));

        // 是否关闭班级圈
        if (!this.noclass) {
          vbar = vbar.filter((r) => {
            return r.name !== "class";
          });
        }

        // 控制权限 写死
        let vid = this.appGetParams("id");
        if (+vid === 7 || this.$js.env) {
          vbar = vbar.filter((r) => {
            return r.name !== "listen";
          });
        } else {
          vbar = vbar.filter((r) => {
            return r.name !== "education";
          });
        }
        this.item = vbar;

        // if (c.length) {
        //   this.item = vbar.map((s) => {
        //     if (s.menulevel && c.indexOf(s.menulevel) >= 0) {
        //       s.name = s.p;
        //       s.title = s.t;
        //     }
        //     return s;
        //   });
        // } else {
        //   this.item = vbar;
        // }
      }
    },
    setColor() {
      let a = this.color || [];
      if (a.length < 2) return 0;
      this.col = [a[0], a[1]];
    },
    setList() {
      if (!this.list.length) {
        this.index ? this.setIndex() : (this.item = []);
        return 0;
      }
      let a = this.appObject({ i: this.list });
      this.item = (a.i || []).map((r) => {
        return {
          name: r.name,
          title: r.title,
          dot: r.dot || 0,
          icon: r.icon || "",
          icons: r.icons || "",
        };
      });
    },
    setActive() {
      let s = this.select === "index" ? "home" : this.select;
      this.active = s;
    },
  },
  mounted() {
    this.setColor();
    this.setList();
    this.active = this.item[0].name;
    this.setActive();
  },
};
</script>
<style lang='less' scoped>
.app_tabbar {
  z-index: 500;
}
</style>
