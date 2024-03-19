<template>
  <v-view bar
          @on-user="onUser"
          :index="600"
          footbar>
    <div class="class_view">
      <v-page ref="page"
              @on-page="onPage">
        <van-empty v-if="!item.length"
                   description="暂无"> </van-empty>
        <!-- 点击头像 进入 该用户朋友圈主页
      点击图片 放大预览
      点击评论 触发 @评论
      点击 tool 无反应
      点击其他 进入详情 -->
        <section class="l_box flex van-hairline--bottom"
                 v-for="(i, j) in item"
                 :key="j"
                 @click.stop="onDetail(i, j)">
          <div class="avatar"
               @click.stop="onUserClass(i, j)">
            <van-image :src="i.avatar"></van-image>
          </div>
          <div class="strong">
            <h2>{{ i.nickname }}</h2>
            <p class="text"
               v-html="i.content"></p>
            <template v-if="+i.type === 2">
              <!-- video -->
              <div class="video_box">
                <template v-if="i.play">
                  <div :id="'player-' + j"
                       @click.stop=""></div>
                </template>
                <template v-else>
                  <div class="poster">
                    <van-image :src="i.imgs[0] ? i.imgs[0].cover : ''"
                               fit="cover"></van-image>
                    <div class="player"
                         @click.stop="onCreatePlayer(i, j)">
                      <van-icon name="play-circle-o" />
                    </div>
                  </div>
                </template>
              </div>
            </template>
            <template v-else>
              <!-- image -->
              <div class="image_box flex fw">
                <div class="pic"
                     :class="toLenOfClass(i.imgs.length)"
                     v-for="(x, y) in tocoverImage(i.imgs)"
                     :key="y + '-' + j">
                  <van-image :src="x.img"
                             fit="cover"
                             @click.stop="
                               appShowImage(
                                 i.imgs.map((s) => {
                                   return s.img;
                                 }),
                                 y
                               )
                               "
                             lazy-load></van-image>
                </div>
                <div class="pic pic_mini pic_more"
                     v-if="i.imgs.length > maxshowimage">
                  <van-icon name="weapp-nav" />
                  <p>更多{{ i.imgs.length - maxshowimage }}</p>
                </div>
              </div>
            </template>
            <div class="tool flex">
              <span class="time">{{ appTimeout(i.release_time, true) }}</span>
              <v-more v-model="i.open"
                      class="tag"
                      :item="toTag(i, j)"
                      @change="onTagChange"></v-more>
            </div>
            <div class="comment_to_like flex">
              <div class="key"
                   @click.stop="
                     onTagChange({
                       ext: i,
                       type: 'like',
                       index: j,
                     })
                     ">
                <div class="icon">
                  <img :src="classicon[+i.is_like === 1 ? 0 : 1]"
                       alt=""
                       class="db_image" />
                </div>
                <b>{{ +i.is_like === 1 ? "取消" : "" }}点赞 ({{
                  i.likes.length
                }})</b>
              </div>
              <div class="key"
                   @click.stop="
                   onTagChange({
                     ext: i,
                     type: 'comment',
                     index: j,
                   })
                     ">
                <div class="icon">
                  <img :src="classicon[2]"
                       alt=""
                       class="db_image" />
                </div>
                <b>评论 ({{ i.comment_count }})</b>
              </div>
            </div>
            <div class="likes flex"
                 v-if="i.likes && i.likes.length">
              <i><img :src="classicon[0]"
                     alt=""
                     class="db_image" /></i>
              <div class="flex fw like">
                <template v-for="(x, y) in i.likes">
                  <template v-if="y > 19"> </template>
                  <template v-else>
                    <b :key="y + 'likes'"
                       v-if="y > 0">、</b>
                    <span :key="y + 'like'">{{ x.like_nickname }}</span>
                  </template>
                </template>
                <template v-if="i.likes.length > 19">
                  <b>等{{ i.likes.length }}人觉得很赞</b>
                </template>
              </div>
            </div>
            <div v-show="i.comment.length > 0"
                 class="commeents flex">
              <review :item="i"
                      :curIndex="j"
                      @deleteCommentItem="deleteCommentItem"
                      @oepnComment="onCommentAt"
                      @details="onCommentMore"
                      :user="user"></review>
            </div>
          </div>
        </section>
      </v-page>
    </div>
    <div class="app_btn_add"
         @click="show = true">
      <div class="add_cover"><van-icon name="plus" /></div>
      <p>发布</p>
    </div>
    <template #fixed>
      <van-action-sheet v-model="show"
                        :actions="actions"
                        cancel-text="取消"
                        close-on-click-action
                        @cancel="show = false"
                        @select="onadd" />
      <transition name="van-fade">
        <div class="app_show_fixed tran top"
             v-if="comment.open"
             style="z-index: 502">
          <span class="comment_cover"
                @click="onCommentReset"></span>
          <v-c v-model="comment.message"
               @change="onCommentSubmit"></v-c>
        </div>
      </transition>
      <v-fixed v-model="child_open"
               :footer="false"
               text="Ta的班级圈"
               :index="402">
        <v-u v-model="id"
             @change="onchangechild"></v-u>
      </v-fixed>
      <v-fixed v-model="detail_open"
               :footer="false"
               text="班级圈详情"
               :index="403">
        <v-d v-model="detail"
             :user="user"
             @comment="(e) => {
               comment = e;
             }
               "
             @del="onTagChange"
             @close="detail_open = false"
             @joinus="onTagChange"></v-d>
      </v-fixed>
      <v-fixed text="加入我的智能相册"
               v-model="show2"
               index="451">
        <van-checkbox-group v-model="result">
          <div class="img flex fw">
            <div class="i"
                 v-for="(i, j) in show2item"
                 :key="j"
                 @click.stop="ontoggle(i.id, i.join_or_not)">
              <div class="radio"
                   v-if="i.join_or_not === 0">
                <van-checkbox :name="i.id"></van-checkbox>
              </div>
              <van-image :src="i.img"
                         fit="cover"></van-image>
            </div>
          </div>
        </van-checkbox-group>
        <van-button block
                    round
                    type="info"
                    :disabled="!result.length"
                    @click="onjoinresult"
                    class="btnjoin">加入宝宝相册</van-button>
      </v-fixed>
    </template>
  </v-view>
</template>

<script>
import vC from "./comment.vue";
import vU from "./child.vue";
import vD from "./detail.vue";
import vMore from "../newpublic/moremodel.vue";
import review from "./review.vue";
export default {
  data() {
    return {
      item: [],
      player: [],
      user: {},
      comment: {
        open: false,
        message: "",
      },
      id: "",
      child_open: false, // 判断个人朋友圈
      detail_open: false, // 详情
      detail: {},
      load: null,
      classdata: {},
      maxshowimage: 9,
      childext: {},
      actions: [
        { name: "发布图文", value: 1 },
        { name: "发布视频", value: 2 },
      ],
      show: false,
      show2: false,
      show2item: [],
      result: [],
      classicon: [200, 201, 202].map((s) => {
        // eslint-disable-next-line
        return siteConfig().icon(s, "private");
      }),
    };
  },
  components: { vC, vU, vD, vMore, review },
  inject: ["appShowImage", "appTimeout", "appPath"],
  watch: {
    "$route.params.id"(n) {
      if (n) {
        this.id = n;
      }
    },
    child_open(n) {
      if (!n) {
        this.appPath("/class", true);
        this.id = "";
      }
    },
    id(n) {
      if (n > 0) {
        // this.child_open = true;
      }
    },
    detail_open(n) {
      if (!n) {
        let obj = { ...this.detail };
        if (obj.id) {
          let index = obj.$index;
          delete obj.$index;
          delete obj.$more;
          delete obj.$comment;
          this.item.splice(index, 1, obj);
        }
      }
    },
  },
  methods: {
    // 删除评论
    deleteCommentItem(c, i) {
      console.log(c, i);
      console.log(this.item);
      this.$api.http('delComment', {
        comment_id: c.id
      }, (r) => {
        this.item.forEach((item) => {
          item.comment.forEach((comment, index) => {
            if (comment.id === c.id) {
              // 删除对应的 comment 数据
              item.comment.splice(index, 1);
              item.comment_count--;
            }
          });
        });
        this.$toast("删除成功");
      })
    },
    onjoinresult() {
      this.$api.http("schoolclassadd", { show_imgs_id: this.result }, () => {
        this.$toast("加入成功");
        this.result = [];
        this.show2 = false;
        this.show2item = [];
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
    onchangechild(e) {
      this.detail = { ...e };
      this.detail_open = true;
    },
    tocoverImage(e) {
      if (e.length > this.maxshowimage) {
        let a = [...e].splice(0, this.maxshowimage);
        return a;
      }
      return e;
    },
    onadd(e) {
      this.appPath("/class_add/" + e.value);
    },
    onUser(e) {
      this.user = e;
    },
    // 返回操作按钮组
    toTag(e, index) {
      // 评论
      // 点赞/不点赞 评论 屏蔽/不屏蔽 删除
      let a = [8];
      if (+e.type === 2) {
        // 下载 3
        a.push(3);
      }
      if (+e.u_id === +this.user.id) {
        // 删除 1
        a.push(1);
      }

      if (+e.is_like === 1) {
        // 取消点赞 2
        a.push(2);
      } else {
        // 点赞 0
        a.push(0);
      }

      if (+e.type === 1 && e.imgs.length) {
        // 加入相册
        a.push(16);
      }
      // eslint-disable-next-line
      return siteConfig().text.tag(a, { index, ext: e });
    },
    // 检测图片数量 并返回 布局
    toLenOfClass(len) {
      let s = "pic_mini";
      switch (len) {
        case 1:
          s = "pic_big";
          break;
        case 2:
        case 4:
          s = "pic_small";
          break;
        default:
      }
      return s;
    },
    // 主方法 请求数据
    onPage(page, f) {
      if (!f) {
        return this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        if (this.player.length) {
          this.player.forEach((k) => {
            if (k.video) {
              k.destroy();
            }
          });
        }
        this.item = [];
      }
      this.$api.http("classList", { page, limit: 20 }, (e) => {
        this.item = this.item.concat(
          e.map((s) => {
            s.play = null;
            s.open = false;
            return s;
          })
        );
       this.$nextTick(() => {
        this.$refs.page.onFinish(e.length < 20);
       })
      });
    },
    // 创建播放器 播放视频
    onCreatePlayer(e, index) {
      e.play = true;
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player[index] = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-" + index),
            video: {
              url: e.imgs[0].img,
              pic: e.imgs[0].cover,
            },
            mutex: true,
            preload: "none",
          });
          this.player[index].play();

          this.player[index].on("error", () => {
            this.player[index].switchVideo({
              url: e.imgs[0].img + "?v" + Date.now(),
              pic: e.imgs[0].cover,
            });
          });
        }
      });
    },
    // 操作中控
    onTagChange(e) {
      let edata = e.ext;
      let ts = this;
      // console.log(e);
      switch (e.type) {
        case "like":
        case "unlike":
          let f = +edata.is_like === 0; // 未点赞
          let c = edata.likes_count;
          let cs = edata.likes || [];
          this.$api.http("classGood", { s_id: edata.id }, () => {
            if (f) {
              c += 1;
              cs.push({ like_nickname: ts.user.nickname });
            } else {
              c -= 1;
              cs = cs.filter((r) => {
                return r.like_nickname !== ts.user.nickname;
              });
            }
            this.$set(this.item[e.index], "is_like", f ? 1 : 0);
            this.$set(this.item[e.index], "likes_count", c);
            this.$set(this.item[e.index], "likes", cs);
            c = null;
            cs = null;
          });
          break;
        case "del":
          this.$model.model("是否删除班级圈", "", (res) => {
            if (res) {
              this.$api.http("classDel", { s_id: edata.id }, () => {
                this.item.splice(e.index, 1);
                this.$toast("删除成功");
              });
            }
          });
          break;
        case "del_end":
          this.item.splice(e.index, 1);
          break;
        case "comment":
          this.$nextTick(() => {
            this.comment = { open: true, message: "", $index: e.index, ...edata };
            this.comment.open = true;
          });
          break;
        case "down":
          let url = (edata.imgs[0] || {}).img;
          // eslint-disable-next-line
          let h5 = this.$js.api.h5 + "h5/player/down.html?url=" + url;
          if (url) {
            window.location.href = h5;
          } else {
            this.$toast("不支持下载");
          }
          break;
        case "joinus":
          this.show2 = true;
          this.show2item = edata.imgs;
          break;
        default:
      }
    },
    // 评论重置
    onCommentReset() {
      this.comment = {
        open: false,
        message: "",
      };
    },
    // 评论提交
    onCommentSubmit(e) {
      this.load = this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      let index = this.comment.$index;
      let obj = this.comment.obj || {};
      if (obj.r_id) {
        let toname = "@" + this.comment.name + "：";

        if (e.indexOf(toname) < 1) {
          obj = {};
        }
        e = e.replace(toname, "");
      }
      let os = {
        comment: ["<b>", e, "</b>"].join(""),
        parent_id: "",
        r_id: "",
        reply_client: "",
        s_id: this.comment.id,
        ...obj,
      };

      this.$api.http("classComment", os, (r) => {
        let d = { ...os, name: this.user.nickname, ...r };
        if (obj.r_id) {
          d.to_name = this.comment.name;
        }
        let val = this.comment.comment || [];
        let count = this.comment.comment_count + 1;
        if (val.length > 6) {
          val.pop();
        }
        val.unshift(d);
        this.onCommentReset();
        if (index === undefined) {
          this.load.close();
          return 0;
        }
        if (val.length < 11) {
          this.$set(this.item[index], "comment", val);
        }
        this.$set(this.item[index], "comment_count", count);
        if (this.detail_open) {
          this.detail = {
            ...this.item[index],
            $index: index,
            $comment: val.length < 11 ? null : d,
          };
        }
      });
      // setTimeout(() => {
      //   if (this.load && this.load.close) {
      //     this.load.close();
      //   }
      // }, 2000);
      this.$nextTick(() => {
        if (this.load && this.load.close) {
          this.load.close();
        }
      })
    },
    // @评论
    onCommentAt(e, index) {
      let uid = this.user.id;
      // 点击自己时
      if (uid === e.u_id) {
        this.comment = {
          open: true,
          message: "",
          $index: index,
          ...e,
          comment: this.item[index].comment,
          comment_count: this.item[index].comment_count,
          id: this.item[index].id,
        };
        return 0;
      }
      this.comment = {
        open: true,
        message: "@" + e.name + "：",
        $index: index,
        ...e,
        comment: this.item[index].comment,
        comment_count: this.item[index].comment_count,
        id: this.item[index].id,
        obj: {
          parent_id: e.id,
          r_id: e.u_id,
          reply_client: e.from_client,
        },
      };
    },
    // 更多评论 进入详情
    onCommentMore(e, index) {
      this.detail = { ...e, $index: index, $more: true };
      this.detail_open = true;
    },
    // 点击头像 进入个人班级圈
    onUserClass(e, index) {
      // this.detail = { ...e, $index: index, $more: true };
      this.appPath("/class/" + e.u_id, true);
    },
    // 查看详情
    onDetail(e, index) {
      this.detail = { ...e, $index: index };
      this.detail_open = true;
    },
  },
  mounted() {
    let p = this.$route.params;
    // 首次进入 检测是否进入 个人班级圈
    this.id = p.id;
    if (p.did > 0) {
      // 获取详情
      this.$api.http("classdet", { s_id: p.did }, (r) => {
        this.onchangechild(r);
      });
    }
  },
  destroyed() {
    if (this.player.length) {
      this.player.forEach((k) => {
        if (k.video) {
          k.destroy();
        }
      });
    }
  },
};
</script>
<style lang='less' scoped>
.l_box {
  padding: 15px 10px;
  font-size: 15px;
  background-color: #fff;

  .avatar {
    width: 45px;
    height: 45px;
    background-color: #f7f7f7;
    border-radius: 2px;
    overflow: hidden;
  }

  .strong {
    width: calc(100% - 45px);
    box-sizing: border-box;
    padding-left: 10px;
    color: #171518;
    position: relative;

    h2 {
      padding: 5px 0;
      font-weight: 650;
      color: #646788;
    }

    .text {
      line-height: 1.5;
      word-break: break-all;
      margin-bottom: 2px;
    }

    .is_shield {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      color: #999;
    }
  }

  .tool {
    padding: 8px 0;
    line-height: 20px;

    .time {
      color: #c9c9c9;
      font-size: 13px;
      flex: 1;
      letter-spacing: 1px;
    }

    .tag {
      position: relative;
      padding: 0 5px 0 15px;
      font-size: 20px;

      &::before {
        position: absolute;
        content: "";
        width: 150%;
        height: 200%;
        left: -25%;
        top: -50%;
      }
    }
  }

  .image_box {
    position: relative;

    .pic {
      background-color: #f7f7f7;
      margin-bottom: 5px;
      margin-right: 7px;
      border-radius: 3px;
      overflow: hidden;

      &.pic_more {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;

        .van-icon {
          font-size: 22px;
          margin-bottom: 5px;
        }

        background-color: rgba(78, 78, 78, 0.6);
        color: #fff;
        position: absolute;
        right: 0;
        bottom: 5px;
        margin: 0;
      }

      &.pic_big {
        width: 200px;
        height: auto;
        min-height: 200px;
      }

      &.pic_small {
        width: 146px;
        height: 146px;

        &:nth-child(2n) {
          margin-right: 0;
        }
      }

      &.pic_mini {
        width: 95px;
        height: 95px;

        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }

  .likes,
  .commeents {
    background-color: #f7f7f7;
    padding: 8px;
    line-height: 16px;
    border-radius: 5px 5px 0 0;

    >i {
      width: 22px;
      height: 22px;

      img {
        transform: scale(0.7) translateY(-10%) translateX(-5%);
      }
    }

    .like,
    ul {
      width: calc(100% - 22px);
      font-size: 13px;
    }
  }

  .commeents {
    border-radius: 0 0 5px 5px;

    li+li {
      margin-top: 3px;
    }

    span {
      color: #3d97c7;
    }

    li>b {
      display: inline-block;
    }
  }

  .video_box {
    height: 170px;
    background-color: #232323;
    border-radius: 5px;
    overflow: hidden;
  }
}

// .class_add {
//   position: fixed;
//   right: 10px;
//   bottom: 60px;
//   background-color: #a8d578;
//   width: 60px;
//   height: 60px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   color: #fff;
//   font-size: 14px;
//   border-radius: 50%;
//   overflow: hidden;
//   box-shadow: 0 0 10px #a8d578;
//   transform: scale(0.9);
//   i {
//     font-size: 20px;
//   }
// }
.class_view {
  padding-bottom: 80px;
  position: relative;
}

.poster {
  height: 100%;
  position: relative;

  .player {
    position: absolute;
    z-index: 5;
    width: 80px;
    height: 80px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 50px;
  }
}

[id^="player"] {
  height: 100%;
  width: 100%;
  display: block;
}

.comment_cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
}

.btnjoin {
  width: 60%;
  margin: 20px auto;
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

.comment_to_like {
  margin-bottom: 5px;

  .key {
    min-width: 33%;
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-right: 5%;
    color: #b9b9b9;

    .icon {
      width: 25px;
      height: 25px;
      margin-right: 2px;
      transform: scale(0.7);
    }
  }
}
</style>
