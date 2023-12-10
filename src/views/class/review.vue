<template>
  <div class=" review  ">
    <i class=""><img :src="classicon[2]"
           alt=""
           style="height: 22px;width: 22px"
           class="db_image  trans_x " /></i>
    <ul>
      <li v-for="(curItem, index) in   item.comment.slice(0, wherdets ? 10 : 6)  "
          :key="index + 'comm'">
        <div class=" text-hw">
          <span @click.stop="
            onCommentAt(curItem,
              index)"
                :style="curItem.name.length < 4 ? { letterSpacing: '0.3em' } : {}">{{ curItem.name + " :" }}</span>
        </div>
        <div class="com_html"
             @click.stop="onComment(curItem, index)">
          <span v-if="curItem.to_name"
                style="color: #3d97c7;fontSize:12px;margin-left: 4px;">@{{ curItem.to_name }} </span>
          <span v-html="curItem.comment">
          </span>
        </div>
        <div class="del"
             @click.stop="deleteItem(curItem, index)"
             v-if="curItem.u_id === user.id">
          <van-icon name="delete-o" />
        </div>
      </li>
      <li v-if="item.comment_count > 6 && item.comment.length > 6 && !wherdets">
        <span class="col_green"
              @click.stop="oepnModel()">
          更多评论({{ item.comment_count - 6 }})
        </span>
      </li>

      <div v-if="commentlist.length > 0">
        <li v-for="(x, y) in commentlist"
            :key="y + 'comms'">
          <div class=" text-hw">
            <span @click.stop="
              onCommentAt(x,
                j)"
                  :style="x.name.length < 4 ? { letterSpacing: '0.3em' } : {}">{{ x.name }}</span>
            <span>{{ ' :' }}</span>
          </div>
          <div class="com_html"
               @click.stop="onComment(x, j)">
            <span v-if="x.to_name"
                  style="color: #3d97c7;fontSize:12px;margin-left: 4px;">@{{ x.to_name }} </span>
            <span v-html="x.comment">
            </span>
          </div>
          <div class="del"
               @click.stop="deleteItem(x, j)"
               v-if="x.u_id === user.id">
            <van-icon name="delete-o" />
          </div>
        </li>
      </div>
      <div v-show="loding"
           class="loding">
        <van-loading />
      </div>
      <li v-if="!end">
        <span class="col_green"
              @click.stop="onCommentPage(end_id)">
          更多评论({{
            this.item.comment_count - item.comment.length - commentlist.length
          }})
        </span>
      </li>
    </ul>
  </div>
</template>

<script >
export default {
  props: {
    item: null,
    user: null,
    curIndex: null,
    wherdets: {
      default: null,
    },
  },
  data() {
    return {
      end: true,
      comment: [], // 将初始值设置为一个空数组
      loding: false,
      commentlist: [],
      end_id: null,
      classicon: [200, 201, 202].map((s) => {
        // eslint-disable-next-line
        return siteConfig().icon(s, "private");
      }),
    };
  },
  inject: ["appShowImage", "appTimeout", "appPath"],
  methods: {
    // 删除评论
    deleteItem(c, i) {
      this.$model.model("是否删除该评论", "", (res) => {
        if (res) {
          this.$emit('deleteCommentItem', c, i)
        }
      });
    },
    // @评论
    onComment(e, index) {
      this.$emit('oepnComment', e, this.curIndex)
    },
    // 更多
    oepnModel(c, i) {
      this.$emit('details', this.item, this.curIndex)
    },
    onCommentPage(id) {
      try {
        this.loding = true;
        this.$api.http("classCommentAll", { id: id, s_id: this.item.id }, (r) => {
          if (r.length > 0) {
            this.end = r.length !== 10;
            this.$set(this, 'commentlist', [...this.commentlist, ...r]);
            if (!this.end) {
              this.end_id = r[r.length - 1].id;
            }
          }
          this.loding = false;
        });
      } catch (error) {
        console.log(error);
      }
    },

    init() {
      let val = this.item;
      if (val.id) {
        if (val.comment_count > val.comment.length) {
          this.end_id = this.item.comment[this.item.comment.length - 1].id
          this.commentlist = [];
          this.end = this.item.comment.length === this.item.comment_count
          // this.onCommentPage(this.end_id)
        }
      }
    },
  },
  watch: {
  },
  mounted() {
    console.log(this.user);
    // 在这里调用 getBoundingClientRect 方法
    if (this.wherdets && this.item.comment_count > 10) {
      this.init()
    }
    // 处理获取到的位置和尺寸信息
  },
};
</script>

<style lang="less" scoped >
.review {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;

  i {
    width: 10%;
  }

  ul {
    margin-left: 2px;
    width: 90%;
  }

  li {
    margin-bottom: 8px;
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: start;

    .text-hw {
      width: auto;
      font-size: 12px;
      color: #3d97c7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      word-wrap: normal;
      white-space: nowrap;
    }

    .com_html {
      width: 40%;
      font-size: 12px;
      margin-left: 4px;
      word-wrap: break-word;

      span {
        word-wrap: break-word;
      }

    }

  }

  .del {
    display: flex;
    justify-content: end;
    align-items: center;
    width: auto;
    height: 20px;
    font-size: 17px;
    color: gray;
    z-index: 5;

    &.un {
      color: tomato;
    }
  }

}

.trans_x {
  transform: scale(0.7) translateY(-10%) translateX(-5%);
}

.col_green {
  font-size: 13px;
}

.loding {
  width: 100%;
  min-height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
