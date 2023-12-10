<template>
  <div class="pri_list">
    <van-empty description="暂无" v-if="!item.length" class="a" />
    <section
      v-for="(i, j) in item"
      :key="j + '-article'"
      class="flex"
      @click="onDetail(i)"
    >
      <div class="ico">
        <van-image :src="i.image[0]" fit="cover" radius="5px"></van-image>
      </div>
      <div class="stro">
        <h6 class="van-ellipsis">{{ i.title }}</h6>
        <p class="van-multi-ellipsis--l2">{{ i.content }}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  inject: ["appPath"],
  data() {
    return {};
  },
  methods: {
    onDetail(e) {
      this.appPath("/info_detail/" + e.id);
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
.pri_list {
  background-color: #f5f5f5;
  .a {
    background-color: #fff;
  }
  section {
    padding: 10px 0;
    height: 120px;
    margin-bottom: 2px;
    background-color: #fff;
  }
  .ico {
    width: 120px;
    height: 120px;
  }
  .stro {
    width: calc(100% - 120px);
    box-sizing: border-box;
    padding-left: 10px;
    h6 {
      line-height: 18px;
      font-size: 16px;
      height: 18px;
      margin-bottom: 18px;
      padding-top: 8px;
    }
    p {
      font-size: 14px;
      line-height: 16px;
    }
  }
  // .van-image {
  //   width: 100%;
  //   height: 100%;
  //   display: block;
  // }
}
</style>
