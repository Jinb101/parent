<template>
  <div class="class_detail">
    <section class="l_box flex van-hairline--bottom">
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
            <template v-if="play">
              <div id="player-detail"
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
                 v-for="(x, y) in i.imgs"
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
            <b>{{ +i.is_like === 1 ? "取消" : "" }}点赞({{ i.likes.length }})</b>
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
            <b>评论({{ i.comment_count }})</b>
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
        <!-- <div class="commeents flex"
             v-if="i.comment && i.comment.length">
          <i><img :src="classicon[2]"
                 alt=""
                 class="db_image" /></i>
          <ul @click.stop="">
            <li v-for="(x, y) in i.comment"
                :key="y + 'comm'">
              <span @click.stop="onCommentAt(x, j)">{{ x.name }}</span>
              <template v-if="x.to_name">
                <span>@{{ x.to_name }}：</span>
              </template>
              <template v-else>：</template>
              <b v-html="x.comment"
                 @click.stop="onCommentAt(x, j)"></b>
            </li>
            <template v-if="commentlist.length > 0">
              <li v-for="(x, y) in commentlist"
                  :key="y + 'comms'">
                <span @click.stop="onCommentAt(x, j)">{{ x.name }}</span>
                <template v-if="x.to_name">
                  <span>@{{ x.to_name }}：</span>
                </template>
                <template v-else>：</template>
                <b v-html="x.comment"
                   @click.stop="onCommentAt(x, j)"></b>
              </li>
            </template>
            <li v-if="!end">
              <span class="col_green"
                    @click.stop="onCommentPage(end_id)">
                更多评论({{
                  i.comment_count - i.comment.length - commentlist.length
                }})
              </span>
            </li>
          </ul>
        </div> -->

        <div v-if="i.comment.length > 0"
             class="commeents flex">
          <review :item="i"
                  :curIndex="j"
                  @deleteCommentItem="deleteCommentItem"
                  @oepnComment="onCommentAt"
                  :wherdets="true"
                  @details="onCommentMore"
                  :user="user"></review>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import vMore from "../newpublic/moremodel.vue";
import review from "./review.vue";
export default {
  props: {
    value: null,
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      player: null,
      comment: {
        message: "",
        open: false,
      },
      commentlist: [],
      end: true,
      end_id: "",
      classicon: [200, 201, 202].map((s) => {
        // eslint-disable-next-line
        return siteConfig().icon(s, "private");
      }),
      play: false,
    };
  },
  inject: ["appTimeout", "appShowImage", "appPath"],
  components: { vMore, review },
  computed: {
    i: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    j() {
      return this.i.$index;
    },
  },
  watch: {
    i: {
      handler(n) {
        if (n.$comment && n.$comment.name && this.end) {
          this.commentlist.push(n.$comment);
        }
        this.$emit("input", n);
      },
      deep: true,
    },
  },
  methods: {
    // 删除评论
    deleteCommentItem(c, i) {
      this.$model.model("是否删除该评论", "", (res) => {
        if (res) {
          this.$api.http('delComment', {
            comment_id: c.id
          }, (r) => {
            this.value.comment.forEach((comment, index) => {
              if (comment.id === c.id) {
                // 删除对应的comment数据
                this.value.comment.splice(index, 1);
                this.value.comment_count--;
              }
            });
            this.$toast("删除成功");
            this.$emit('details', c, i)
          })
        }
      });
    },
    // 返回操作按钮组
    toTag(e, index) {
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
    // 创建播放器 播放视频
    onCreatePlayer(e, index) {
      this.play = true;
      this.$nextTick(() => {
        if (!e.player) {
          // eslint-disable-next-line
          this.player = new DEMO_Player({
            // eslint-disable-next-line
            container: demo.$.id("player-detail"),
            video: {
              url: e.imgs[0].img,
              pic: e.imgs[0].cover,
            },
            mutex: true,
            preload: "none",
          });
          this.player.play();

          this.player.on("error", () => {
            this.player.switchVideo({
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
            this.$set(this.i, "is_like", f ? 1 : 0);
            this.$set(this.i, "likes_count", c);
            this.$set(this.i, "likes", cs);
            c = null;
            cs = null;
          });
          break;
        case "del":
          this.$model.model("是否删除班级圈", "", (res) => {
            if (res) {
              this.$api.http("classDel", { s_id: edata.id }, () => {
                this.$toast("删除成功");
                this.$emit("del", { ...e, type: "del_end" });
              });
            }
          });
          break;
        case "comment":
          this.comment = { open: true, message: "", $index: e.index, ...edata };
          this.$nextTick(() => {
            this.comment.open = true;
            this.$emit("comment", this.comment);
          });
          break;
        case "down":
          let url = (edata.imgs[0] || {}).img;
          let h5 = this.$js.api.h5 + "h5/player/down.html?url=" + url;
          if (url) {
            window.location.href = h5;
          } else {
            this.$toast("不支持下载");
          }
          break;
        case "joinus":
          this.$emit("joinus", e);
          break;
        default:
      }
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
          comment: this.i.comment,
          comment_count: this.i.comment_count,
          id: this.i.id,
        };
        this.$emit("comment", this.comment);
        return 0;
      }
      this.comment = {
        open: true,
        message: "@" + e.name + "：",
        $index: index,
        ...e,
        comment: this.i.comment,
        comment_count: this.i.comment_count,
        id: this.i.id,
        obj: {
          parent_id: e.id,
          r_id: e.u_id,
          reply_client: e.from_client,
        },
      };
      this.$emit("comment", this.comment);
    },
    // 更多评论 进入详情
    onCommentMore(e, index) {
      this.detail = { ...e, $index: index, $more: true };
      this.detail_open = true;
    },
    onUserClass(e) {
      this.$emit("close");
      this.appPath("/class/" + e.id, true);
    },
    init() {
      let val = this.i;
      if (val.id && val.comment) {
        if (val.comment_count > val.comment.length) {
          let id = val.comment[val.comment.length - 1].id;
          this.commentlist = [];
          this.onCommentPage(id);
        }
      }
    },
    onCommentPage(id) {
      this.$api.http("classCommentAll", { id, s_id: this.i.id }, (r) => {
        this.commentlist = this.commentlist.concat(r);
        this.end = r.length !== 10;
        if (!this.end) {
          this.end_id = r[r.length - 1].id;
        }
      });
    },
  },
  mounted() {
    this.i = this.value;
    this.init();
  },
  destroyed() {
    this.i.play = false;
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.class_detail {
  font-size: 15px;
}

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
    .pic {
      background-color: #f7f7f7;
      margin-bottom: 5px;
      margin-right: 7px;
      border-radius: 3px;
      overflow: hidden;

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
