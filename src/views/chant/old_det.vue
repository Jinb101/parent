<template>
  <div class="chant_detail">
    <h2>{{ ext.name }}</h2>
    <div class="player_video">
      <div class="players" @click.stop>
        <template v-if="play">
          <div id="player-chant" @click.stop=""></div>
        </template>
        <template v-else>
          <div class="poster">
            <van-image
              :src="ext.parent_cover_picture || ''"
              fit="cover"
            ></van-image>
            <div class="player" @click.stop="onCreatePlayerData">
              <van-icon name="play-circle-o" />
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="desc app_frame_content" v-html="ext.content"></div>
    <template v-if="ext.country_study_class === null">
      <div class="v_list">
        <van-empty description="老师还未发布任务哦"></van-empty>
      </div>
    </template>
    <template v-else>
      <div class="v_list">
        <div class="teacher flex">
          <div class="logo">
            <van-image :src="icons(10035, 'people')" fit="cover"></van-image>
          </div>
          <div class="text">
            <h3>发布老师：{{ study.staff_name }}</h3>
            <p>发布时间：{{ appTimeout(study.create_time) }}</p>
          </div>
        </div>
        <v-page ref="page" @on-page="onPage">
          <van-empty v-if="!item.length" description="暂无打卡记录"></van-empty>
          <ul>
            <li
              v-for="(i, j) in item"
              :key="j"
              class="flex"
              @click.stop="ondet(i)"
            >
              <div class="logo">
                <van-image
                  v-lazy
                  :src="i.avatar || i.child_base_map"
                ></van-image>
              </div>
              <div class="text">
                <div class="name" v-if="+i.type === 2">
                  {{ i.nickname }}
                  <van-tag type="primary">家长打卡</van-tag>
                </div>
                <div class="name" v-else>
                  {{ i.child_name }}
                </div>
                <div class="players" @click.stop>
                  <template v-if="i.play">
                    <div :id="'player-' + j" @click.stop=""></div>
                  </template>
                  <template v-else>
                    <div class="poster">
                      <van-image :src="i.picture || ''" fit="cover"></van-image>
                      <div class="player" @click.stop="onCreatePlayer(i, j)">
                        <van-icon name="play-circle-o" />
                      </div>
                    </div>
                  </template>
                </div>
                <div class="content" v-html="i.content"></div>
                <div class="tools flex van-hairline--top">
                  <span @click.stop="onvent('like', i, j)">
                    <img
                      :src="icons(+i.give === 2 ? 201 : 202)"
                      alt=""
                      class="db_image"
                    />
                    <b>点赞({{ tonum(i.like_count) }})</b>
                  </span>
                  <span @click.stop="onvent('comment', i, j)">
                    <img :src="icons(203)" alt="" class="db_image" />
                    <b>评论({{ tonum(i.comment_count) }})</b>
                  </span>
                  <span @click.stop="onvent('share', i, j)">
                    <img :src="icons(200)" alt="" class="db_image" />
                    <b>分享</b>
                  </span>
                </div>
                <div
                  class="comments"
                  v-if="
                    i.country_study_comment && i.country_study_comment.length
                  "
                >
                  <div
                    class="comment_line"
                    v-for="(x, y) in i.country_study_comment"
                    :key="y + 's' + j"
                    @click.stop="onvent('commentparent', i, j, y)"
                  >
                    <b class="names col_primary">{{ x.name }}:</b>
                    <b v-html="x.comment"></b>
                  </div>
                  <div
                    class="comment_line"
                    v-if="i.comment_count > 3"
                    @click.stop="ondet(i)"
                  >
                    <b class="col_info">更多回复</b>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </v-page>
      </div>
      <div class="save_btn_add" v-if="info === 2" @click="onclickout">
        <img :src="save" alt="" class="db_image" />
        <b>打卡</b>
      </div>
      <div class="save_btn_add" v-else-if="info === 1" @click="onclickout">
        <img :src="save" alt="" class="db_image" />
        <b>家长打卡</b>
      </div>
    </template>
    <transition name="van-fade">
      <div
        class="app_show_fixed tran top"
        v-if="comment.open"
        style="z-index: 502"
      >
        <span class="comment_cover" @click="onCommentReset"></span>
        <v-c
          v-model="comment.message"
          @change="onCommentSubmit"
          @end="comend"
        ></v-c>
      </div>
    </transition>
  </div>
</template>

<script>
import vC from "../class/comment.vue";
export default {
  props: {
    value: null,
    save: String,
  },
  data() {
    return {
      ext: {
        country_study_class: null,
      },
      item: [],
      comment: {
        open: false,
        message: "",
      },
      player: [],
      play: null,
      plays: null,
    };
  },
  components: { vC },
  inject: ["appTimeout"],
  computed: {
    detail: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
    study() {
      return this.ext.country_study_class || {};
    },
    info() {
      let a = this.study;
      if (!a.country_study_class_id) {
        return 0;
      }
      if (a.country_study_child && a.country_study_child.length > 0) {
        return 1;
      }
      return 2;
    },
  },
  watch: {
    detail: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    setlikes(g, l, id) {
      let index = this.item
        .map((s) => {
          return s.country_study_child_id === id;
        })
        .indexOf(true);
      if (index >= 0) {
        this.$set(this.item[index], "give", g);
        this.$set(this.item[index], "like_count", l);
      }
    },
    setdels(id) {
      this.item = this.item.filter((r) => {
        return r.country_study_child_id !== id;
      });
    },
    setcomments(c, id) {
      let index = this.item
        .map((s) => {
          return s.country_study_child_id === id;
        })
        .indexOf(true);
      if (index >= 0) {
        this.$set(this.item[index], "comment_count", c);
      }
    },
    onCreatePlayerData() {
      this.play = true;
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.plays = new DEMO_Player({
          // eslint-disable-next-line
          container: demo.$.id("player-chant"),
          video: {
            url:
              +this.ext.audio_type === 2
                ? this.ext.parent_video
                : this.ext.audio,
            pic: this.ext.parent_cover_picture,
            preload: "none",
          },
          mutex: true,
        });
        this.plays.play();
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
              url: e.video,
              pic: e.picture,
            },
            mutex: true,
            preload: "none",
          });
          this.player[index].play();
        }
      });
    },
    comend(id) {
      this.item = this.item.filter((r) => {
        return r.country_study_child_id !== id;
      });
      this.onCommentReset();
    },
    onCommentReset() {
      this.comment = {
        open: false,
        message: "",
      };
    },
    onCommentSubmit(e) {
      if (e === "") return this.$toast("请输入评论");
      let index = this.comment.$index;
      let o = {};
      if (this.comment.$child) {
        let index = this.comment.$childindex;
        o = {
          parent_id: this.comment.country_study_comment[index].parent_id || 0,
          r_id: this.comment.country_study_comment[index].r_id || 0,
        };
        e = "回复" + this.comment.country_study_comment[index].name + "：" + e;
      }
      this.$api.http(
        "a2023042610",
        {
          country_study_child_id: this.comment.country_study_child_id,
          comment: e,
          parent_id: o.parent_id || 0,
          r_id: o.r_id || 0,
          reply_client: 1,
        },
        (r) => {
          // push 到 country_study_comment
          if (this.comment.comment_count < 3) {
            let d = this.comment.country_study_comment;
            d.push(r);
            this.$set(this.item[index], "country_study_comment", d);
          }
          this.$set(
            this.item[index],
            "comment_count",
            this.comment.comment_count + 1
          );
          this.$toast("评论成功");
          this.onCommentReset();
        }
      );
    },
    onvent(type, data, index, child) {
      switch (type) {
        case "comment":
          this.comment = { open: true, message: "", $index: index, ...data };
          this.$nextTick(() => {
            this.comment.open = true;
          });
          break;
        case "commentparent":
          this.comment = {
            open: true,
            message: "",
            $index: index,
            $child: true,
            $childindex: child,
            ...data,
          };
          this.$nextTick(() => {
            this.comment.open = true;
          });
          break;
        case "like":
          let status = +data.give === 2; // 未
          this.$api.http(
            "a2023042609",
            {
              country_study_child_id: data.country_study_child_id,
              status: status ? 1 : 2,
              open_id: "",
            },
            () => {
              this.$set(this.item[index], "give", status ? 1 : 2);
              this.$set(
                this.item[index],
                "like_count",
                status ? data.like_count + 1 : data.like_count - 1
              );
            }
          );
          break;
        case "share":
          this.onshares(data);
          break;
        default:
      }
    },
    tonum(v) {
      return v > 99 ? "99+" : v;
    },
    icons(name, suffix = "parent") {
      // eslint-disable-next-line
      return siteConfig().icon(name, suffix);
    },
    onclickout() {
      let o = {
        country_study_class_id: this.study.country_study_class_id,
        video: "",
        content: "",
        type: this.info === 1 ? 2 : 1,
      };
      this.$emit("send", o);
    },
    init() {
      if (this.detail.country_study_id) {
        // 请求详情
        this.$api.http(
          "a2023042603",
          { country_study_id: this.detail.country_study_id },
          (r) => {
            if (r.classify && r.classify.status === 0) {
              this.$toast("功能未开通");
              this.$emit("error");
              return 0;
            }
            this.ext = r;
          }
        );
      } else if (this.detail.data) {
        // 从父页面来的正常数据
        this.ext = this.detail.data;
      } else {
        // 错误数据
        this.$toast("该课程已被删除");
        this.$emit("error");
      }
    },
    onPage(page, f) {
      if (!f) {
        return this.$refs.page && this.$refs.page.onRefresh();
      }
      if (+page === 1) {
        this.item = [];
      }
      this.$api.http(
        "a2023042605",
        {
          page,
          country_study_class_id: this.study.country_study_class_id,
        },
        (e) => {
          this.item = this.item.concat(
            e.map((s) => {
              s.play = null;
              return s;
            })
          );
          this.$refs.page.onFinish(e.length < 20, page);
          // country_study_class 为null时 不显示打卡按钮与状态
        }
      );
    },
    ondet(e) {
      if (this.player.length) {
        this.player.forEach((k) => {
          if (k.video) {
            k.pause();
          }
        });
      }
      this.$emit("ondet", e);
    },
    onshares(d) {
      this.$toast("请点击微信右上角...进行分享");
      this.$emit("showshare");
      let link = this.onshare(d, true);
      // console.log(link);
      this.$vx({ link, desc: d.child_name + "的经典吟诵" });
    },
    onshare(data, type) {
      let e = this.$demo.$session.get("user", {});
      let os = {
        type: "web",
        nid: this.$demo.$local.get("nid", ""),
        cid: e.id || "",
        path: this.$route.path,
        id: data.country_study_child_id,
        time: Date.now(),
        m: e.openid || "", // openid
      };
      // eslint-disable-next-line
      let a = demo.es6().encrypt(os, "", "poster");
      // eslint-disable-next-line
      let url = this.$js.api.h5 + "h5/poster/?type=chant&h5=" + a;
      if (type) return url;
      // eslint-disable-next-line
      if (!demo.es6().isWx()) {
        console.log(url);
        return this.$toast("请用微信打开");
      }
      window.location.href = url;
    },
  },
  mounted() {
    this.detail = this.value;
    this.init();
  },
  destroyed() {
    if (this.player.length) {
      this.player.forEach((k) => {
        if (k.video) {
          k.destroy();
        }
      });
    }
    if (this.plays && this.plays.video) {
      this.plays.destroy();
    }
  },
};
</script>
<style lang='less' scoped>
.chant_detail {
  h2 {
    padding: 10px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 650;
    text-align: center;
  }
  .player_video {
    height: 210px;
    background-color: #222;
    margin-bottom: 5px;
    .players {
      height: 100%;
    }
  }
  .desc {
    background-color: #fff;
    padding: 8px 10px;
    font-size: 14px;
    color: #999;
  }
  .teacher {
    background-color: #fff;
    margin: 10px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 15px;
    align-items: center;
    overflow: hidden;
    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: #f8f7fa;
      overflow: hidden;
    }
    .text {
      width: calc(100% - 60px);
      box-sizing: border-box;
      font-size: 15px;
      line-height: 1.2;
      h3 {
        font-weight: 600;
      }
      p {
        color: #999;
      }
    }
  }
  ul {
    padding-bottom: 80px;
  }
  li {
    margin: 10px;
    padding-left: 10px;
    box-sizing: border-box;
    .logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 5px;
      overflow: hidden;
      transform: translateY(20px);
    }
    .text {
      width: calc(100% - 55px);
      border-radius: 5px;
      background-color: #fff;
      box-sizing: border-box;
      padding: 10px;
      font-size: 16px;
    }
    .players {
      height: 150px;
      background-color: #222;
      border-radius: 5px;
      overflow: hidden;
      margin: 5px 0;
    }
    .name {
      font-weight: 650;
      padding: 8px 0;
    }
    .content {
      padding: 5px;
      font-size: 14px;
      color: #999;
    }
    .tools {
      height: 40px;
      margin-bottom: 5px;
      font-size: 12px;
      padding-top: 5px;
      span {
        flex: 1;
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          margin-right: 2px;
          transform: scale(0.5);
        }
        b {
          transform: translateX(-6px);
        }
      }
    }
    .comments {
      padding: 0 5px;
      .comment_line {
        font-size: 14px;
        padding: 2px 0;
        color: #999;
        .names {
          vertical-align: top;
        }
        .name {
          padding-right: 5px;
          opacity: 0.9;
        }
        b:last-child {
          display: inline-block;
          word-break: break-all;
        }
      }
    }
  }
}
.save_btn_add {
  position: fixed;
  right: 0;
  bottom: 8px;
  width: 80px;
  height: 80px;
  padding: 5px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 15px;
  transform: scale(0.6);
  box-sizing: border-box;
  z-index: 120;
  border-radius: 50%;
  cursor: pointer;
  &::before {
    position: absolute;
    left: -10%;
    top: -10%;
    width: 120%;
    height: 120%;
    background-color: rgb(135, 217, 255);
    content: "";
    border-radius: 50%;
    overflow: hidden;
    z-index: 121;
    opacity: 0.3;
  }
  b {
    font-weight: 650;
    margin-top: 5px;
    letter-spacing: 2px;
  }
  img,
  b {
    position: relative;
    z-index: 122;
  }
}
.comment_cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
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
</style>
