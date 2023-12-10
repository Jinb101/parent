<template>
  <div class="pri_people">
    <transition name="fade">
      <div class="y" v-if="type === 'yuansuo'">
        <section
          v-for="(i, j) in yuansuo"
          :key="j + '-c'"
          class="flex van-hairline--bottom"
          @click="onDetail(i)"
        >
          <b class="name">{{ i.name }}</b>
          <b>{{ i.staff_count }}</b>
          <van-icon name="arrow" />
        </section>
      </div>
    </transition>
    <transition name="fade">
      <div class="y" v-if="type === 'parent'">
        <section
          v-for="(i, j) in parent"
          :key="j + '-p'"
          class="flex van-hairline--bottom"
          @click="onParent(i)"
        >
          <b class="name">{{ i.nickname }}</b>
          <b>{{ i.parents_count }}</b>
          <van-icon name="arrow" />
        </section>
      </div>
    </transition>
    <transition name="fade">
      <div class="staff" v-if="show">
        <van-empty description="暂无" v-if="!showItem.length" />
        <ul>
          <li
            v-for="(i, j) in showItem"
            :key="j + '-sw'"
            class="flex van-hairline--bottom"
            @click="onChangeThis(i)"
          >
            <div class="ava">
              <van-image :src="i.avatar" fit="cover" round></van-image>
            </div>
            <div class="text">
              <p class="name">{{ i.name }}</p>
              <p class="job">{{ i.job_name }}</p>
            </div>
            <div class="check">
              <van-icon name="success" color="#07c160" v-if="i.checked" />
              <van-icon name="circle" v-else />
            </div>
          </li>
        </ul>
        <!-- {{ showItem }} -->
      </div>
    </transition>
    <transition name="fade">
      <div class="foot_btn flex" v-if="views === 0">
        <van-button
          block
          color="orange"
          @click="onMax"
          v-if="more && lens === 0"
        >
          全部选中
        </van-button>
        <van-button
          block
          color="orange"
          v-if="lens > 0 && cms > 0"
          @click="onClearItem"
          >取消选中</van-button
        >
        <van-button block :color="theme.bgc" @click="onSub">
          确认选中{{ cm }}
        </van-button>
      </div>
    </transition>
    <transition name="fade">
      <div class="foot_btn flex" v-if="show">
        <van-button block color="orange" @click="onMaxChange" v-if="lens === 0">
          全选/反选
        </van-button>
        <van-button block :color="theme.bgc" @click="onSubList">
          确定{{ cn }}
        </van-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    type: { type: String, default: "yuansuo" },
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
    more: { type: Boolean, default: false },
    lens: { type: Number, default: 0 }, // 最大人数 0为无上限
  },
  data() {
    return {
      yuansuo: [],
      parent: [],
      show: false,
      showItem: [],
      changed: { yuansuo: [], parent: [] },
      theme: {},
      views: 0,
    };
  },
  watch: {
    type() {
      this.init();
    },
    ext: {
      handler() {
        this.setExt();
      },
      deep: true,
    },
  },
  computed: {
    cn() {
      let n = this.showItem.filter((r) => {
        return r.checked;
      }).length;
      return n > 0 ? "(" + n + ")" : "";
    },
    cm() {
      let n = this.cms;
      return n > 0 ? "(" + n + ")" : "";
    },
    cms() {
      return this.changed.yuansuo.length + this.changed.parent.length;
    },
    yid() {
      return this.changed.yuansuo.map((s) => {
        return +s.id;
      });
    },
    pid() {
      return this.changed.parent.map((s) => {
        return +s.id;
      });
    },
  },
  inject: ["appGetTheme", "appObject"],
  methods: {
    setExt() {
      let v = this.appObject(this.ext);
      if (v.num > 0) {
        this.changed.yuansuo = v.yuansuo || [];
        this.changed.parent = v.parent || [];
      }
    },
    onClearItem() {
      this.$model.model(
        "是否取消全部选中,当前选中" + this.cm + "人",
        "",
        (res) => {
          if (res) {
            this.changed.yuansuo = [];
            this.changed.parent = [];
            this.showItem = this.showItem.map((r) => {
              r.checked = false;
              return r;
            });
          }
        }
      );
    },
    // 全部选中
    onMax() {
      let f = this.type === "yuansuo";
      let name = f ? "老师" : "家长";
      let api = f ? "getStaffs" : "getParents";
      let os = f ? { is_human: 1 } : {};
      this.$model.model("是否全部选中" + name, "提示", (res) => {
        if (res) {
          this.$api.http(api, os, (e) => {
            this.changed[this.type] = e.map((s) => {
              return {
                avatar: s.avatar,
                id: s.id,
                name: s.name || s.nickname,
                checked: true,
                job_name: s.job_name || "",
              };
            });
            this.onSub();
          });
        }
      });
    },
    // 全选
    onMaxChange() {
      let s = this;
      this.showItem.map((e) => {
        s.onChangeThis(e);
      });
    },
    // 确认选中
    onSub() {
      let os = this.appObject(this.changed, {
        num: this.cm.replace(/\(|\)/g, ""),
      });
      this.$emit("on-change", os);
    },
    // 取消选中
    onClose() {
      this.changed.yuansuo = [];
      this.changed.parent = [];
      this.$emit("on-close");
    },
    // 确认选择
    onSubList() {
      this.show = false;
    },
    onChangeThis(i) {
      if (this.lens <= this.cms && !i.checked && this.lens > 0) {
        return this.$model.info(
          "选中人数超出限制,当前最大可选择" + this.lens + "人",
          2
        );
      }
      i.checked = !i.checked;
      let name = this.type;
      if (i.checked) {
        this.changed[name].push(i);
      } else {
        this.changed[name] = this.changed[name].filter((r) => {
          return r.id !== i.id;
        });
      }
    },
    init() {
      this.onSubList();
      if (this.type === "yuansuo") {
        // 获取部门
        this.$api.http("getGroup", {}, (e) => {
          this.yuansuo = e.map((s) => {
            s.child = [];
            return s;
          });
        });
        // 根据部门获取员工
      } else if (this.type === "parent") {
        // 获取班级
        this.$api.http("getClass", {}, (e) => {
          this.parent = e.map((s) => {
            s.child = [];
            return s;
          });
        });
        // 根据班级获取家长
      }
    },
    onDetail(e) {
      if (e.child.length) {
        this.showItem = e.child;
        this.show = true;
        return 0;
      }
      let i = this.yid;
      this.$api.http("getStaff", { is_human: 1, g_id: e.id }, (r) => {
        this.showItem = e.child = r.map((s) => {
          s.checked = i.indexOf(+s.id) >= 0;
          return s;
        });
        this.show = true;
      });
    },
    onParent(e) {
      if (e.child.length) {
        this.showItem = e.child;
        this.show = true;
        return 0;
      }
      let i = this.pid;
      this.$api.http("getParent", { class_id: e.id }, (r) => {
        this.showItem = e.child = r.map((s) => {
          return {
            avatar: s.avatar,
            id: s.id,
            name: s.nickname,
            checked: i.indexOf(+s.id) >= 0,
            job_name: "",
          };
        });
        this.show = true;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.setExt();
    this.init();
  },
};
</script>
<style lang='less' scoped>
.pri_people {
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 44px;
  .y,
  .staff {
    overflow-y: scroll;
    height: 100%;
  }
  .staff {
    height: calc(100% - 44px);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #fff;
  }
  .foot_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 44px;
    box-sizing: border-box;
  }
  li {
    height: 70px;
    padding: 10px;
    box-sizing: border-box;
    font-size: 13px;
    .ava {
      height: 50px;
      width: 50px;
      margin-right: 10px;
    }
    .name {
      margin: 6px 0;
      font-size: 16px;
    }
    .text {
      width: calc(100% - 90px);
    }
    .check {
      width: 30px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      color: #ccc;
    }
  }
  section {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    color: #656565;
    font-size: 16px;
    .name {
      flex: 1;
      font-weight: 650;
    }
    .van-icon {
      line-height: 50px;
      color: #999;
    }
  }
}
</style>
