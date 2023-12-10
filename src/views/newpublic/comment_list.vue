<template>
  <ul class="comment_list">
    <li v-for="(i, j) in commentlist" :key="j" class="van-hairline--bottom">
      <div class="flex" @click.stop="onwritewrite(i, j)">
        <v-a class="logo" :src="i.avatar"></v-a>
        <div class="text">
          <h2>{{ i.name }}</h2>
          <p v-html="tocomment(i.comment)"></p>
        </div>
      </div>
      <div class="child" v-if="i[child] && i[child].length">
        <div
          class="flex"
          v-for="(x, y) in i[child]"
          :key="y + '-' + j"
          @click.stop="onwritewrite(x, j)"
        >
          <v-a class="logo" :src="x.avatar"></v-a>
          <div class="text">
            <h2>{{ x.name }}</h2>
            <p v-html="tocomment(x.comment)"></p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import vA from "./avatar.vue";
export default {
  props: {
    value: null,
    child: { type: String, default: "voters_comment" },
  },
  data() {
    return {};
  },
  components: { vA },
  computed: {
    commentlist: {
      get: function get() {
        return this.value;
      },
      set: function set(v) {
        this.$emit("input", v);
      },
    },
  },
  watch: {
    commentlist: {
      handler(v) {
        this.$emit("input", v);
      },
      deep: true,
    },
  },
  methods: {
    tocomment(e) {
      let str = (e + "").replace(/..\/..\/emoji/g, "../500/emoji");
      return str;
    },
    onwritewrite(e, index = -1) {
      this.$emit("write", e, index);
    },
  },
  mounted() {
    this.commentlist = this.value;
  },
};
</script>
<style lang='less' scoped>
.comment_list {
  box-sizing: border-box;
  padding: 0 10px 80px;
  li {
    padding: 10px 0;
    .logo {
      width: 40px;
      height: 40px;
      margin-right: 8px;
      transform: scale(0.9);
    }
    .text {
      width: calc(100% - 48px);
      font-size: 15px;
      h2 {
        font-weight: 650;
        padding: 5px 0;
      }
      > p {
        color: #999;
        line-height: 1.4;
        word-break: break-all;
        // white-space: pre;
      }
    }
    .child {
      padding-left: 48px;
      margin-top: 10px;
      > div {
        transform: scale(0.8) translateX(-20%);
        width: 135%;
      }
    }
  }
}
</style>
