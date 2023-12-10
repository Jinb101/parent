<template>
  <div class="index_album">
    <v-tool-title></v-tool-title>
    <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
      <van-empty v-if="!item.length" description="暂无"></van-empty>
      <section v-for="(i, j) in item" :key="j">
        <van-cell :title="i.time" :value="i.age"></van-cell>
        <div class="list" :class="{ buy: !i.isbuy }">
          <div class="i" v-for="(x, y) in i.list" :key="y + '-' + j">
            <span class="close" @click.stop="ondelimgs(y, j)" v-if="i.isbuy"
              ><van-icon name="cross"></van-icon
            ></span>
            <span v-else-if="y > 0" class="lock" @click.stop="onlock"
              >点击解锁</span
            >
            <van-image
              :src="x.picture"
              fit="cover"
              @click="onclickimage(i, y)"
            ></van-image>
          </div>
        </div>
      </section>
    </v-tool-page>
    <div class="app_btn_add" @click="onadd">
      <div class="add_cover"><van-icon name="plus" /></div>
      <p>添加</p>
    </div>
    <v-f v-model="open" :index="570" text="添加相片">
      <div class="pad">
        <v-i @path="onImage" :size="1000"></v-i>
      </div>
      <div class="w60">
        <van-button block round type="info" @click="onput">发布</van-button>
      </div>
    </v-f>
    <v-f v-model="open1" :index="570" text="解锁相册">
      <div class="app_frame_content auto" v-html="det.content"></div>
      <div class="bh"></div>
      <div class="bottom">
        <van-button block round type="danger" @click="onpay"
          >点击解锁(￥{{ +det.price }})</van-button
        >
      </div>
    </v-f>
  </div>
</template>

<script>
import vI from "../../private/image.vue";
import vF from "../../newpublic/fixed.vue";
export default {
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
      open: false,
      image: [],
      open1: false,
      det: {},
    };
  },
  components: { vI, vF },
  inject: ["appShowImage"],
  methods: {
    onpay() {
      let os = {
        price: this.det.price,
        checkcode: true,
        nid: this.$demo.$local.get("nid"),
        token: this.$demo.$local.get("token"),
      };
      let user = this.$demo.$session.get("user", {});
      if (user.openid) {
        os.openid = user.openid;
      }
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = this.$js.api.h5 + "h5/poster/?type=album_pay&h5=" + a;
      if (!this.$demo.es6().isWx()) {
        console.log(url);
        return 0;
      }
      window.location.href = url;
    },
    onlock() {
      this.open1 = false;
      this.$api.http("a2023031801", {}, (r) => {
        if (!r.price) {
          this.$toast("园所暂未开放该功能");
        } else {
          this.det = r;
          this.open1 = true;
        }
      });
    },
    onclickimage(i, y) {
      if (!i.isbuy) {
        if (y === 0) {
          return this.appShowImage(i.list[0].picture);
        }
        return this.onlock();
      }
      this.appShowImage(i.list, y, "picture");
    },
    onadd() {
      this.open = true;
    },
    onImage(e) {
      this.image = e;
    },
    onput() {
      if (!this.image.length) {
        return this.$toast("请上传相片");
      }
      let e = this.image.map((s) => {
        return s.path;
      });
      // let t = this.$demo.timeout("", "array");
      this.$api.http("schoolPhotoadd", { picture: e.join(",") }, () => {
        this.$toast("上传成功");
        this.open = false;
        this.onPage(1);
      });
    },
    ondelimgs(j, y) {
      this.$model.model("", "是否删除", (r) => {
        if (r) {
          let list = this.item[y].list;
          let data = list[j];
          let os = {
            term_album_id: this.item[y].id,
            term_album_picture_id:
              list.length > 1 ? [data.term_album_picture_id] : [],
          };
          this.$api.http("schoolPhotodel", os, () => {
            this.$toast("删除成功");
            this.item[y].list = list.filter((r) => {
              return r.term_album_picture_id !== data.term_album_picture_id;
            });
          });
        }
      });
    },
    onPage(page) {
      this.$api.http("schoolPhoto", { page, limit: 20 }, (e) => {
        this.pageOpen++;
        let es = e.map((s) => {
          let thumb = s.term_album_picture || [];
          let list = thumb.map((k) => {
            let index = k.picture.split("/uploads/")[1];
            k.src = "/uploads/" + index;
            return k;
          });
          let os = {
            time: s.years,
            age: s.age,
            id: s.id,
            list,
            // isbuy: +s.is_visible === 1,
            isbuy: true,
          };
          return os;
        });
        es = es.filter((r) => {
          return r.list.length > 0;
        });
        if (page === 1) {
          this.item = es;
          return 0;
        }
        this.item = this.item.concat(es);
        this.pageEnd = es.length !== 20;
      });
    },
  },
  mounted() {
    this.onPage(1);
  },
};
</script>
<style lang='less' scoped>
section {
  margin: 8px 8px 0;
  box-sizing: border-box;
  position: relative;
  font-size: 15px;
  .van-cell {
    background: transparent;
  }
  .list {
    padding: 15px 0;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .i {
      width: 119px;
      height: 119px;
      box-sizing: border-box;
      padding: 1px;
      position: relative;
    }
    .close {
      position: absolute;
      right: 1px;
      top: 1px;
      width: 24px;
      height: 24px;
      display: flex;
      font-size: 18px;
      justify-content: center;
      color: #fff;
      background-color: tomato;
      z-index: 5;
      border-radius: 0 0 0 100%;
      overflow: hidden;
    }
    .lock {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }
    &.buy {
      .i {
        margin-bottom: 1px;
        overflow: hidden;
        border-radius: 5px;
        .van-image {
          filter: blur(20px);
        }
        &:first-child {
          border-radius: 0;
          .van-image {
            filter: blur(0);
          }
        }
      }
    }
  }
}
li {
  margin-bottom: 10px;
  text-align: center;
  padding: 10px 0;
  > p {
    font-weight: 650;
    font-size: 16px;
  }
  .none {
    font-size: 14px;
    color: #999;
    padding: 20px 0;
    display: block;
  }
  .img {
    margin-right: 12px;
    margin-top: 12px;
    width: 110px;
    height: 110px;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
.pad {
  padding: 10px;
}
.bh {
  height: 80px;
}
.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 600;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
