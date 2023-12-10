<template>
  <div class="classs_detail">
    <v-tool-title :text="title" back @on-back="back">
      <span class="more" @click="onDetail">
        <van-icon name="ellipsis" size="20" />
      </span>
    </v-tool-title>
    <div class="mains">
      <!-- 发布时间 -->
      <div class="tool flex">
        <span class="time">{{ toTime(item.release_time) }}</span>
        <div class="btn">
          <span
            class="good"
            :class="{ active: +item.is_like === 1 }"
            @click="onClickLike(item)"
          >
            <van-icon name="good-job" size="20" />
            {{ appCountNum(item.likes_count) }}
          </span>
        </div>
      </div>
      <!-- 文字 -->
      <div class="contents" v-html="item.content"></div>
      <!-- 图片/视频 -->
      <div v-if="item.imgs && item.imgs.length">
        <div class="images flex fw" v-if="+item.type === 1">
          <article
            class="cava"
            :class="x.cls"
            v-for="(x, y) in toImage(item.imgs)"
            :key="y + '-img'"
            @click="appShowImage(item.imgs, y, 'img')"
          >
            <van-image :src="x.img" fit="cover"></van-image>
          </article>
        </div>
        <div class="video" v-else>
          <v-v
            :item="item.imgs"
            :wh="wh"
            :ids="'class-video-detail-' + index"
          ></v-v>
        </div>
      </div>
      <!-- 点赞 -->
      <div class="goods flex fw" v-if="item.likes && item.likes.length">
        <van-icon name="good-job" size="20" color="tomato" />
        <span>{{ toLikes(item.likes) }}</span>
      </div>
      <!-- 评论列表 -->
      <div
        class="comments van-hairline--top"
        v-if="item.comment && item.comment.length"
      >
        <h6>
          评论({{ num }})
          <span @click="onClickComment({})"
            ><van-icon name="chat-o" size="18" />我要评论</span
          >
        </h6>
        <ul>
          <li v-for="(q, w) in toComment(comment)" :key="w + '-com'">
            <span class="names" @click="onClickComment(q, 1)">{{
              q.name
            }}</span>
            <span class="to" v-if="q.to_name" @click="onClickComment(q, 2)">
              回复 {{ q.to_name }}
            </span>
            :
            <b v-html="q.comment" style="display: inline-block"></b>
          </li>
        </ul>
      </div>
    </div>
    <!-- 点赞/评论 -->
    <div class="foot"></div>
  </div>
</template>

<script>
import vV from "../../private/video2.vue";
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: { type: [String, Number], default: 0 },
  },
  components: { vV },
  computed: {
    title() {
      return this.item.nickname + "发的班级圈";
    },
    num() {
      return this.comment.length;
    },
  },
  data() {
    return {
      wh: { width: "100%", height: "4.6667rem" },
      comment: [],
    };
  },
  watch: {
    "item.comment": {
      handler(n) {
        let s = this.$demo.copy(n);
        this.comment = s.splice(0, 9);
        this.initd();
      },
      deep: true,
    },
  },
  inject: ["appShowImage", "appCountNum"],
  methods: {
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
    toComment(e) {
      let v = this.$demo.copy(e);
      let o = v.splice(0, 100);
      return o;
    },
    toTime(v) {
      return this.$demo.timeout(v);
    },
    toImage(e) {
      let len = e.length;
      return e.map((s) => {
        return {
          img: s.img,
          cls: len > 4 ? "c4" : len === 3 ? "c3" : len === 2 ? "c2" : "c1",
        };
      });
    },
    onClickLike() {
      this.$emit("on-like", this.index);
    },
    onClickComment(i = {}, j) {
      this.$emit("on-comment", { index: this.index, i, j });
    },
    onDetail() {
      this.$emit("on-detail", this.index);
    },
    back() {
      this.$emit("on-close");
    },
    getComment(id) {
      let os = {
        s_id: this.item.id,
        id,
      };
      this.$api.http("classCommentAll", os, (e) => {
        this.comment = this.comment.concat(e);
        if (e.length === 10) {
          this.getComment(this.comment[this.comment.length - 1].id);
        }
      });
    },
    initd() {
      if (this.comment.length) {
        let id = this.comment[this.comment.length - 1].id;
        this.getComment(id);
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.comment = this.$demo.copy(this.item.comment);
      this.initd();
    }, 500);
  },
};
</script>
<style lang='less' scoped>
.classs_detail {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% - 50px);
  z-index: 62;
  background-color: #fff;
  overflow-y: scroll;
  .mains {
    padding: 10px 15px;
    box-sizing: border-box;
    .time {
      font-size: 13px;
      padding: 5px 0;
      color: #999;
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
    .goods {
      font-size: 14px;
      line-height: 20px;
      padding: 5px 0;
      span {
        margin-left: 4px;
        color: #5b76b4;
      }
    }
    .comments {
      padding-top: 5px;
      h6 {
        line-height: 35px;
        font-size: 15px;
        font-weight: 650;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          left: -5px;
          top: 0;
          bottom: 0;
          margin: auto;
          width: 2px;
          height: 8px;
          background-color: #38f;
        }
        > span {
          position: absolute;
          right: 0;
          top: 0;
          font-weight: 400;
          font-size: 13px;
          color: #999;
          padding: 0 8px;
          .van-icon {
            vertical-align: middle;
          }
        }
      }
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
    .cava {
      width: 100%;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 6px;
      &.c2 {
        width: 48%;
        height: 100px;
        & + .c2 {
          margin-left: 4%;
        }
      }
      &.c3 {
        width: 32%;
        height: 92px;
        & + .c3 {
          margin-left: 2%;
        }
        &:nth-child(4n + 1) {
          margin-left: 0;
        }
      }
      &.c4 {
        width: 23%;
        height: 92px;
        & + .c4 {
          margin-left: 2.66%;
        }
        &:nth-child(4n + 1) {
          margin-left: 0;
        }
      }
    }
  }
  .foot {
  }
}
</style>
