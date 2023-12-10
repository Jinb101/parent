<template>
  <v-view bar footbar>
    <div class="view_page" v-if="menu.length > 0">
      <div class="app_top" v-if="menu.length > 1">
        <van-tabs
          @click="ontabs"
          v-model="active"
          title-active-color="#38f"
          color="#38f"
        >
          <van-tab
            :title="i.name"
            v-for="(i, j) in menu"
            :key="j"
            :name="i.id"
          ></van-tab>
        </van-tabs>
      </div>
      <div class="list_box">
        <div class="l" v-if="is_left">
          <section
            v-for="(i, j) in menu2"
            :key="j + '-2'"
            @click="ontab2(i.id, i)"
            :class="{ active: active2 === i.id }"
          >
            {{ i.name }}
          </section>
        </div>
        <div class="list" :class="{ r: is_left }">
          <v-page ref="page" @on-page="onPage">
            <van-tabs
              @click="ontab3"
              v-model="active3"
              title-active-color="#99cc33"
              color="#99cc33"
              v-if="menu3.length"
            >
              <van-tab
                :title="i.name"
                v-for="(i, j) in menu3"
                :key="j + '-3'"
                :name="i.id"
              ></van-tab>
            </van-tabs>
            <van-empty v-if="!item.length"></van-empty>
            <x-content></x-content>
            <x-content v-for="(x, y) in item" :key="y + 'c'">
              <div class="flex sec" @click="ondetail(x)">
                <div class="logo">
                  <van-image :src="x.cover_picture" fit="cover"></van-image>
                </div>
                <div class="text">
                  <h6>
                    <b>{{ y + 1 }}、</b>{{ x.title }}
                  </h6>
                  <div class="p">
                    <template v-if="x.duration > 0">
                      <van-tag v-if="x.duration < x.free_time">未看</van-tag>
                      <van-tag v-else type="primary">已看</van-tag>
                    </template>
                    <template v-else>
                      <van-tag>未看</van-tag>
                    </template>
                  </div>
                </div>
              </div>
            </x-content>
            <x-content></x-content>
          </v-page>
        </div>
      </div>
    </div>
    <van-empty v-else description="暂无"></van-empty>
  </v-view>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
      menu2: [],
      menu3: [],
      active: "",
      active2: "",
      active3: "",
      level: 1,
      item: [],
    };
  },
  computed: {
    is_left() {
      return +this.level === 2;
    },
    istabid() {
      return [this.active, this.active2, this.active3].join("_");
    },
  },
  watch: {
    active() {
      this.active2 = "";
      this.active3 = "";
    },
    active2() {
      this.active3 = "";
    },
    istabid(n) {
      // eslint-disable-next-line
      demo.$local.set("temp_edu_page", n);
    },
    // active3(n) {
    // console.log(n);
    // },
  },
  inject: ["appPath"],
  methods: {
    ontab3(e) {
      this.onPage(1);
      this.$nextTick(() => {
        this.appPath("/education/" + this.istabid, true);
      });
    },
    ondetail(e) {
      this.appPath("/educations/" + e.curriculum_id);
    },
    ontab2(id, e) {
      this.active2 = id;
      if (e.children.length) {
        this.menu3 = e.children || [];
        this.$nextTick(() => {
          this.active3 = e.children[0].id;
          this.onPage(1);
          this.appPath("/education/" + this.istabid, true);
        });
        return 0;
      }
      this.onPage(1);
      this.$nextTick(() => {
        this.appPath("/education/" + this.istabid, true);
      });
    },
    ontabs(name, title) {
      let val = this.menu.filter((r) => {
        return r.id === name;
      });
      this.menu3 = [];
      this.onmenu(val[0]);
      this.$nextTick(() => {
        this.onPage(1);
        this.appPath("/education/" + this.istabid, true);
      });
    },
    onlist() {},
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      let classify_id = this.active3 || this.active2 || this.active;
      this.$api.http("edulist", { classify_id, page, limit: 20 }, (e) => {
        this.item = this.item.concat(e);
        this.$refs.page.onFinish(e.length < 20);
      });
    },
    onmenu(r, arr = []) {
      this.level = r.children.length ? 2 : 1;
      this.menu2 = this.is_left ? r.children : [];
      this.active = r.id;

      this.$nextTick(() => {
        if (arr.length) {
          let aid =
            this.menu2.filter((r) => {
              return r.id === +arr[1];
            })[0] || {};
          if (aid.id) {
            this.active2 = aid.id;
            if (aid.children && aid.children.length) {
              this.menu3 = aid.children || [];
              this.active3 = +arr[2];
              this.$nextTick(() => {
                this.active3 = +arr[2];
              });
            }
            return 0;
          }
        }
        let a2 = this.menu2[0] || {};
        if (a2.children && a2.children.length) {
          this.menu3 = a2.children || [];
          this.active3 = this.menu3[0].id;
        }
        this.active2 = a2.id || "";
      });
    },
  },
  mounted() {
    let id = this.$route.params.id;
    if (!id) {
      // eslint-disable-next-line
      let a = demo.$local.get("temp_edu_page");
      if (a) {
        id = a;
      }
    }
    let ids = id ? (id + "").split("_") : [];
    this.$api.http("eduify", {}, (r) => {
      this.menu = r;
      if (ids.length) {
        let val = r.filter((r) => {
          return +r.id === +ids[0];
        });
        this.onmenu(val[0], ids);
      } else {
        this.onmenu(r[0], true);
      }
    });
  },
};
</script>
<style lang='less' scoped>
.list_box {
  display: flex;
  .l {
    background-color: #f7f8fa;
    width: 90px;
    height: calc(100% - 44px);
    position: absolute;
    left: 0;
    top: 44px;
    box-sizing: border-box;
    padding: 8px 0;
    section {
      font-size: 15px;
      position: relative;
      padding: 10px 10px;
      line-height: 1.2;
      transition: all 0.3s;
      border-radius: 0 20px 20px 0;
      margin-bottom: 2px;
      &::before {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 3px;
        height: 14px;
        background-color: #38f;
        opacity: 0;
        transition: all 0.3s;
      }
      &.active {
        background-color: rgb(225, 238, 255);
        &::before {
          opacity: 1;
        }
      }
    }
  }
  .list {
    width: 100%;
    box-sizing: border-box;
    &.r {
      // width: calc(100% - 90px);
      padding-left: 90px;
    }
  }
}
.sec {
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: #fff;
  .logo {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .text {
    width: calc(100% - 110px);
    font-size: 14px;
    h6 {
      font-weight: 650;
      padding: 3px 0;
      font-size: 15px;
    }
    .p {
      margin-top: 5px;
    }
  }
}
</style>
