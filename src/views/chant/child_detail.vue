<template>
  <div class="child_detail">
    <div class="head">
      <div class="a flex">
        <div class="logo">
          <van-image :src="obj.child_base_map"
                     fit="cover"></van-image>
        </div>
        <div class="text">
          <h3>
            {{ obj.child_name }}
            <van-tag v-if="+obj.type === 2"
                     type="primary">家长打卡</van-tag>
          </h3>
          <p>{{ appTimeout(obj.create_time) }}</p>
        </div>
        <span class="status col_danger"
              @click="ondel"
              v-if="ismy">撤销打卡</span>
      </div>
      <div class="c"
           v-html="obj.content"></div>
      <div class="p"
           @click.stop>
        <template v-if="play">
          <div id="player-chant"
               @click.stop=""></div>
        </template>
        <template v-else>
          <div class="poster">
            <van-image :src="obj.picture || ''"
                       fit="cover"></van-image>
            <div class="player"
                 @click.stop="onCreatePlayerData">
              <van-icon name="play-circle-o" />
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="comment">
      <div class="t flex">
        <div class="l">
          <b>{{ obj.comment_count }}</b><b>评论</b>
        </div>
        <div class="r"
             @click="onlike">
          <span>
            <img :src="icons(+obj.give === 2 ? 201 : 202)"
                 alt=""
                 class="db_image" />
          </span>
          {{ obj.like_count }}赞
        </div>
      </div>
      <v-c-l v-model="item"
             child="country_study_comment"
             @write="oncomments"></v-c-l>
      <!-- <ul>
        <li
          class="flex van-hairline--bottom"
          v-for="(i, j) in item"
          :key="j"
          @click.stop="oncomments(i)"
        >
          <div class="logo">
            <van-image :src="i.avatar" fit="cover"></van-image>
          </div>
          <div class="text">
            <h3>{{ i.name }}</h3>
            <p>
              {{ i.to_name ? ["回复", i.to_name, "："].join("") : "" }}
              <b v-html="i.comment"></b>
            </p>
          </div>
        </li>
      </ul> -->
    </div>
    <v-c v-model="cobj.msg"
         @change="onchange"></v-c>
  </div>
</template>

<script>
import vC from "../class/comment.vue";
import vCL from "../newpublic/comment_list.vue";
export default {
  props: {
    ext: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { vC, vCL },
  inject: ["appTimeout"],
  data() {
    return {
      obj: {},
      item: [],
      play: false,
      player: null,
      cobj: {},
    };
  },
  computed: {
    ismy() {
      let baby = this.$demo.$session.get("baby-info", {});
      let user = this.$demo.$session.get("user", {});
      let type = +this.obj.type;
      if (type === 2) {
        return user.id === this.obj.user_id;
      }
      return baby.id === this.obj.child_id;
    },
  },
  methods: {
    oncomments(e, index) {
      this.cobj = {
        msg: "@" + e.name + ":",
        parent_id: e.country_study_comment_id,
        r_id: e.u_id,
        toname: e.name,
        index,
      };
    },
    onlike() {
      let status = +this.obj.give === 2; // 未
      this.$api.http(
        "a2023042609",
        {
          country_study_child_id: this.obj.country_study_child_id,
          status: status ? 1 : 2,
          open_id: "",
        },
        () => {
          this.obj.give = status ? 1 : 2;
          this.obj.like_count = status
            ? this.obj.like_count + 1
            : this.obj.like_count - 1;
          this.$emit(
            "likes",
            this.obj.give,
            this.obj.like_count,
            this.obj.country_study_child_id
          );
        }
      );
    },
    icons(name, suffix = "parent") {
      // eslint-disable-next-line
      return siteConfig().icon(name, suffix);
    },
    onCreatePlayerData() {
      this.play = true;
      this.$nextTick(() => {
        // eslint-disable-next-line
        this.player = new DEMO_Player({
          // eslint-disable-next-line
          container: demo.$.id("player-chant"),
          video: {
            url: this.obj.video,
            pic: this.obj.picture,
          },
          mutex: true,
          preload: "none",
        });
        this.player.play();
      });
    },
    ondel() {
      this.$model.model("是否撤销打卡", "", (r) => {
        if (r) {
          this.$api.http(
            "a2023042608",
            { country_study_child_id: this.ext.country_study_child_id },
            () => {
              this.$toast("撤销完成");
              this.$emit("end", this.ext.country_study_child_id);
            }
          );
        }
      });
    },
    init() {
      this.obj = { ...this.ext };
      this.onbtnshare();
      this.$api.http(
        "a2023042607",
        {
          country_study_child_id: this.ext.country_study_child_id,
          page: 1,
          limit: 200,
        },
        (r) => {
          this.item = r;
        }
      );
    },
    onchange(e) {
      if (e === "") return this.$toast("请输入评论");
      let comment = e;
      let s = "@" + this.cobj.toname + ":";
      if (this.cobj.toname && e.indexOf(s) >= 0) {
        comment = e.replace(s, "回复" + this.cobj.toname + "：");
      } else {
        this.cobj = {
          msg: e,
          index: -1,
        };
      }
      let os = {
        country_study_child_id: this.ext.id || this.ext.country_study_child_id,
        comment,
        parent_id: this.cobj.parent_id || 0,
        r_id: this.cobj.r_id || 0,
        reply_client: 1,
      };
      this.$api.http("a2023042610", os, (res) => {
        this.$toast("评论成功");
        // this.item.push(r);
        if (this.cobj.index >= 0) {
          let a = this.item[this.cobj.index].country_study_comment || [];
          a.push(res);
          this.$set(this.item[this.cobj.index], "country_study_comment", a);
        } else {
          this.item.push(res);
          let num = this.ext.comment_count + 1;
          this.$set(this.obj, "comment_count", num);
          this.$emit("comments", num, this.ext.country_study_child_id);
        }
        this.cobj = {
          msg: "",
        };
      });
    },
    onshares(d) {
      let link = this.onshare(d, true);
      let e = d.type === 2 ? " [家长打卡]" : "";
      this.$vx({ link, desc: d.child_name + "的经典吟诵打卡" + e });
    },
    onbtnshare() {
      this.onshares(this.obj);
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
    this.$nextTick(() => {
      this.init();
    });
  },
  destroyed() {
    if (this.player && this.player.video) {
      this.player.destroy();
    }
  },
};
</script>
<style lang='less'
       scoped>
      .child_detail {
        font-size: 15px;
        padding-bottom: 80px;

        .logo {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          margin-right: 10px;
          overflow: hidden;
          background-color: #e9e9e9;
        }

        .text {
          width: calc(100% - 50px);

          h3 {
            font-weight: 650;
            padding: 5px 0;
          }

          p {
            color: #999;
          }
        }

        .head {
          padding: 15px;
          background-color: #fff;

          .a {
            align-items: center;
            position: relative;

            .status {
              position: absolute;
              top: 0;
              right: 0;
              padding: 5px;
              font-size: 12px;
              z-index: 60;
              letter-spacing: 1px;
            }
          }

          .c {
            padding: 8px 0;
            line-height: 1.2;
            color: #666;
          }

          .p {
            height: 193px;
            background-color: #222;
            border-radius: 8px;
            overflow: hidden;
          }
        }

        .comment {
          margin-top: 10px;
          padding: 10px 15px;
          box-sizing: border-box;
          background-color: #fff;

          .t {

            >.l,
            >.r {
              padding: 10px 0;
            }
          }

          .l {
            flex: 1;
          }

          .r {
            display: flex;
            align-items: center;

            span {
              width: 16px;
              height: 16px;
              margin-right: 5px;
              display: inline-block;
            }
          }
        }

        li {
          padding: 10px 0;
          position: relative;

          .time {
            position: absolute;
            right: 8px;
            top: 8px;
            font-size: 12px;
            color: #999;
          }
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

      [id^="player"] {
        height: 100%;
        width: 100%;
        display: block;
      }
    </style>
