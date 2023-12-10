<template>
  <div class="class">
    <!-- 发布按钮 -->
    <transition name="fade">
      <div class="class_send" :style="tme" @click="show = true" v-if="showBtn">
        <van-icon name="add-square" size="20" color="#fff" />
        <b>发布</b>
      </div>
    </transition>
    <!-- 列表 -->
    <div class="list">
      <v-tool-page :open="pageOpen" :end="pageEnd" @on-page="onPage">
        <van-empty description="暂无班级圈" v-if="!item.length" />
        <section
          v-for="(i, j) in item"
          :key="j + '-c'"
          class="van-hairline--bottom flex sc"
        >
          <div class="logo">
            <div class="ava" @click="onClickDetail(i, j)">
              <van-image fit="cover" :src="i.avatar" round></van-image>
            </div>
          </div>
          <span class="warn" v-if="+i.from_client === 1 && +i.is_shield === 1">
            <van-icon name="warn-o" />
          </span>
          <span class="more" @click="onDetail(i, j)">
            <van-icon name="ellipsis" />
          </span>
          <article>
            <!-- 名字 -->
            <h6 class="name van-ellipsis">{{ i.nickname }}</h6>
            <!-- 文字 -->
            <div class="contents" v-html="i.content"></div>
            <!-- 图片/视频 -->
            <div v-if="i.imgs && i.imgs.length">
              <div class="images flex fw" v-if="+i.type === 1">
                <article
                  class="cava"
                  :class="x.cls"
                  v-for="(x, y) in toImage(i.imgs)"
                  :key="y + '-img'"
                  @click="appShowImage(i.imgs, y, 'img')"
                >
                  <van-image :src="x.img" fit="cover" lazy-load></van-image>
                </article>
              </div>
              <div class="video" v-else>
                <v-v :item="i.imgs" :ids="'class-video-' + j"></v-v>
              </div>
            </div>
            <!-- tool -->
            <div class="tool flex">
              <span class="time">{{ toTime(i.release_time) }}</span>
              <div class="btn">
                <span
                  class="good"
                  :class="{ active: +i.is_like === 1 }"
                  @click="onClickLike(i)"
                >
                  <van-icon name="good-job" size="20" />
                  {{ appCountNum(i.likes_count) }}
                </span>
                <span class="comment" @click="onClickComment(i, {}, 0, j)">
                  <van-icon name="chat" size="20" />
                  {{ appCountNum(i.comment_count) }}
                </span>
              </div>
            </div>
            <!-- 评论/点赞列表 -->
            <div class="com_list" v-if="scom(i)">
              <!-- 点赞 -->
              <div class="goods flex fw" v-if="i.likes && i.likes.length">
                <van-icon name="good-job" size="20" color="tomato" />
                <span>{{ toLikes(i.likes) }}</span>
              </div>
              <!-- 评论 -->
              <div
                class="comments van-hairline--top flex"
                v-if="i.comment && i.comment.length"
              >
                <van-icon name="chat" size="20" color="#666" />
                <ul>
                  <li v-for="(q, w) in toComment(i.comment)" :key="w + '-com'">
                    <span class="names" @click="onClickComment(i, q, 1, j)">{{
                      q.name
                    }}</span>
                    <span
                      class="to"
                      v-if="q.to_name"
                      @click="onClickComment(i, q, 2, j)"
                    >
                      回复 {{ q.to_name }}
                    </span>
                    :
                    <b v-html="q.comment" style="display: inline-block"></b>
                  </li>
                  <li v-if="i.comment.length >= 5">
                    <span @click="onClickDetail(i, j)">查看更多回复</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </section>
      </v-tool-page>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="show = false"
      @select="onSendDetail"
    />
    <transition name="fade">
      <v-d
        v-if="child"
        :item="childItem"
        :index="childIndex"
        @on-close="child = false"
        @on-like="onChildClickLike"
        @on-comment="onChildClickComment"
        @on-detail="onChildClickDetail"
      ></v-d>
    </transition>
    <transition name="van-slide-left">
      <div class="app_show_fixed top" style="z-index: 502" v-if="open1">
        <v-tool-title back @on-back="open1 = false"></v-tool-title>
        <van-checkbox-group v-model="result">
          <div class="img flex fw">
            <div
              class="i"
              v-for="(i, j) in photoarr"
              :key="j"
              @click.stop="ontoggle(i.id, i.join_or_not)"
            >
              <div class="radio" v-if="i.join_or_not === 0">
                <van-checkbox :name="i.id"></van-checkbox>
              </div>
              <van-image :src="i.img" fit="cover"></van-image>
            </div>
          </div>
        </van-checkbox-group>
        <van-button
          block
          round
          type="info"
          :disabled="!result.length"
          @click="onjoinresult"
          class="btnjoin"
          >加入宝宝相册</van-button
        >
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import vV from "../../private/video2.vue";
import vD from "./detail.vue";
export default {
  props: {
    childData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { vV, vD },
  data() {
    return {
      item: [],
      pageOpen: 0,
      pageEnd: false,
      user: {},
      theme: {},
      show: false,
      actions: [
        { name: "发布图文", value: 1 },
        { name: "发布视频", value: 2 },
      ],
      showBtn: false, // 发布按钮
      child: false, // 查看详情
      childItem: {},
      childIndex: 0,
      open1: false,
      photoarr: [],
      result: [],
    };
  },
  watch: {
    vuex_share: {
      handler(n) {
        this.setEvent(n);
      },
      deep: true,
    },
    vuex_comment: {
      handler(n) {
        if (n.type === "close") {
          this.showBtn = true;
        }
        if (n.type === "send") {
          this.sendComment(n);
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({ vuex_share: "share", vuex_comment: "comment" }),
    tme() {
      return {
        "background-color": this.theme.bgc,
        "box-shadow": "0 0 10px " + this.theme.bgc,
      };
    },
  },
  inject: [
    "appShowImage",
    "appCountNum",
    "appGetInfo",
    "appShare",
    "appGetTheme",
    "appShowComment",
    "appPath",
    "appGetBabyInfo",
  ],
  methods: {
    onjoinresult() {
      this.$api.http("schoolclassadd", { show_imgs_id: this.result }, () => {
        this.$toast("加入成功");
        this.result = [];
        this.open1 = false;
      });
    },
    ontoggle(e, j) {
      if (j !== 0) {
        this.$toast("已加入");
        return 0;
      }
      if (this.result.indexOf(e) > -1) {
        this.result = this.result.filter((r) => {
          return r !== e;
        });
      } else {
        this.result.push(e);
      }
    },
    sendComment(v) {
      let obj = v.ext;
      let index = obj.index;
      obj.comment = v.val;
      delete obj.val;
      delete obj.index;
      this.$api.http("classComment", obj, (e) => {
        this.item[index].comment.push(e);
        this.item[index].comment_count += 1;
        this.$model.info("发表成功", 2);
      });
    },
    setEvent(e) {
      if (e.type !== "class_detail") return 0;
      let index = e.ext.index;
      switch (e.event) {
        case "delete":
          this.onDelete(e.ext.id);
          break;
        case "detail":
          this.onClickDetail(this.item[index], index);
          break;
        case "comment":
          this.onClickComment(this.item[index], {}, 0, index);
          break;
        case "good":
        case "ungood":
          this.onClickLike(null, index);
          break;
        case "down":
          let url = e.ext.imgs[0].img;
          let h5 = this.$js.api.h5 + "h5/player/down.html?url=" + url;
          window.location.href = h5;
          break;
        case "joinphoto":
          this.open1 = true;
          this.photoarr = e.ext.imgs;
          break;
        default:
      }
    },
    // 删除
    onDelete(s_id) {
      this.$model.model("是否删除这条班级圈", "", (res) => {
        if (res) {
          this.$api.http("classDel", { s_id }, () => {
            this.$model.info("删除成功", 2);
            this.item = this.item.filter((r) => {
              return r.id !== s_id;
            });
          });
        }
      });
    },
    // 点赞
    onChildClickLike(index) {
      this.onClickLike(null, index);
    },
    onClickLike(e, index) {
      if (index >= 0) {
        e = this.item[index];
      }
      let f = +e.is_like === 0; // 未点赞
      let num = e.likes_count;
      let com = e.likes;
      let obj = { like_nickname: this.user.nickname };
      this.$api.http(
        "classGood",
        {
          s_id: e.id,
        },
        (r) => {
          e.is_like = r;
          if (r) {
            num = f ? num + 1 : num;
            com.push(obj);
          } else {
            num = f ? num : num - 1;
            com = com.filter((s) => {
              return s.like_nickname !== obj.like_nickname;
            });
          }
          e.likes_count = num;
          e.likes = com;
        }
      );
    },
    // 评论
    onChildClickComment(e) {
      this.onClickComment(this.item[e.index], e.i, e.j, e.index);
    },
    onClickComment(e, i = {}, index, j) {
      let os = {
        val: "",
        s_id: e.id,
        parent_id: "",
        r_id: "",
        reply_client: "",
        index: j,
      }; // 评论传参配置
      let val = "";
      if (i.id) {
        val = "@" + (index === 1 ? i.name : i.to_name) + ":";
        os.val = val;
        os.parent_id = i.id;
        os.r_id = i.u_id;
        os.reply_client = i.from_client;
      }
      this.showBtn = false;
      this.appShowComment(val, os);
    },
    // 进入详情页 弹框
    onClickDetail(e, j) {
      this.child = true;
      this.childItem = e;
      this.childIndex = j;
    },
    onSendDetail(e) {
      this.appPath("/class_add/" + e.value);
    },
    // 打开菜单
    onChildClickDetail(index) {
      this.onDetail(this.item[index], index);
    },
    onDetail(i, j) {
      let o = this.$js.def.shareIcon;
      let ext = this.$demo.copy(i);
      ext.index = j;
      // 查看详情
      // 评论
      let arr = [o.detail, o.comment];
      if (+i.type === 2) {
        arr.push(o.down);
      }
      // 删除  权限 -> 自己发表的
      if (ext.u_id === this.user.id) {
        arr.push(o.delete);
      }
      // 点赞 判断 is_like
      if (+ext.is_like === 1) {
        arr.push(o.ungood);
      } else {
        arr.push(o.good);
      }
      if (+i.type === 1 && i.imgs.length) {
        // 加入相册
        arr.push(o.joinphoto);
      }
      this.appShare(arr, ext, "class_detail", "班级圈");
    },
    scom(i) {
      let a = i.likes && i.likes.length;
      let b = i.comment && i.comment.length;
      return a || b;
    },
    toComment(e) {
      let v = this.$demo.copy(e);
      let o = v.splice(0, 5);
      return o;
    },
    toLikes(e) {
      let s = e.map((r) => {
        return r.like_nickname;
      });
      let len = s.length;
      let txt = "";
      if (len > 9) {
        s = s.splice(0, 9);
        txt = "等" + len + "人觉得很赞";
      }
      return s.join(",") + txt;
    },
    toTime(v) {
      return this.$demo.timeout(v);
    },
    toImage(e) {
      let len = e.length;
      return e.map((s) => {
        return {
          img: s.img,
          cls:
            len > 4
              ? len % 3 === 0
                ? "c3"
                : "c4"
              : len === 3
              ? "c3"
              : len === 2
              ? "c2"
              : "c1",
        };
      });
    },
    onPage(e) {
      this.$api.http("classList", { page: e, limit: 20 }, (r) => {
        this.pageOpen++;
        if (e === 1) {
          this.item = r;
          return 0;
        }
        this.item = this.item.concat(r);
        this.pageEnd = r.length !== 20;
      });
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.appGetBabyInfo((e, f) => {
      this.showBtn = !!f.no;
      this.user = e;
      this.onPage(1);
    });
  },
};
</script>
<style lang='less' scoped>
.class {
  background-color: #fff;
  font-size: 16px;
  .class_send {
    position: fixed;
    right: 20px;
    bottom: 70px;
    width: 50px;
    height: 50px;
    background-color: #38f;
    box-shadow: 0 0 10px #38f;
    border-radius: 50%;
    z-index: 60;
    text-align: center;
    padding-top: 8px;
    box-sizing: border-box;
    color: #fff;
    b {
      display: block;
      font-size: 10px;
    }
  }
  .list {
    height: 100%;
  }
  .sc {
    padding: 15px;
    height: auto;
    position: relative;
    .warn,
    .more {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 20px;
      text-align: center;
      .van-icon {
        line-height: 30px;
      }
    }
    .more {
      transform: rotate(90deg);
    }
    .warn {
      color: orange;
      right: 40px;
    }
    .logo {
      width: 65px;
      box-sizing: border-box;
      padding-right: 10px;
      .ava {
        width: 55px;
        height: 55px;
      }
    }
    article {
      width: calc(100% - 65px);
      .name {
        font-weight: 700;
        height: 30px;
        line-height: 30px;
      }
      .contents {
        color: #333;
        margin-bottom: 5px;
        line-height: 1.2;
      }
      .tool {
        height: 35px;
        line-height: 35px;
        color: #999;
        .time {
          font-size: 10px;
          flex: 1;
        }
        .btn {
          span {
            min-width: 35px;
            height: 35px;
            display: inline-block;
            font-size: 10px;
            .van-icon {
              line-height: 35px;
            }
            &.comment {
              color: #666;
            }
            &.active {
              &.good {
                color: tomato;
              }
            }
          }
        }
      }
      .com_list {
        background-color: #f5f5f5;
        padding: 10px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          background-color: #f5f5f5;
          width: 10px;
          height: 10px;
          left: 10px;
          top: -4px;
          transform: rotate(-45deg);
        }
        .goods {
          font-size: 14px;
          line-height: 20px;
          padding-bottom: 5px;
          span {
            margin-left: 4px;
            color: #5b76b4;
          }
        }
        .van-icon {
          height: 20px;
        }
        .comments {
          padding-top: 5px;
          ul {
            width: calc(100% - 20px);
            font-size: 14px;
            padding-left: 5px;
            color: #999;
            line-height: 20px;
            li {
              margin-bottom: 5px;
            }
            span {
              color: #5b76b4;
            }
          }
        }
      }
      .cava {
        width: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding: 1px;
        &.c2 {
          width: 50%;
        }
        &.c3 {
          width: 33.33%;
        }
        &.c4 {
          width: 25%;
        }
      }
    }
  }
}
.img {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  .i {
    width: 33.33%;
    height: 117px;
    position: relative;
    box-sizing: border-box;
    padding: 1px;
    .radio {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 5;
    }
  }
}
.btnjoin {
  width: 60%;
  margin: 20px auto;
}
</style>
