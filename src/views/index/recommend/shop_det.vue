<template>
  <div class="recom_shop_det">
    <v-tool-title></v-tool-title>
    <div class="banner">
      <van-swipe @change="onChange">
        <van-swipe-item v-if="!pic.length">
          <van-image></van-image>
        </van-swipe-item>
        <van-swipe-item v-for="(i, j) in pic" :key="j + '--detai-pic'">
          <van-image :src="i"></van-image>
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator" v-if="pic.length">
            {{ current + 1 }}/{{ pic.length }}
          </div>
        </template>
      </van-swipe>
    </div>
    <div class="head">
      <p class="grade">{{ grade }}积分</p>
      <p class="text van-multi-ellipsis--l2">{{ desc }}</p>
      <div class="tool">
        <span class="total">总量{{ stock }}</span
        ><span class="count">已兑换{{ convert }}</span>
      </div>
    </div>
    <div class="line" v-if="specs.length" @click.stop="show = true">
      <b class="n">选择规格</b>
      <b class="tag">{{ tag }}</b>
      <i class="arrow icon_arrow_right"></i>
    </div>
    <div class="detail">
      <h6 class="title">图文详情</h6>
      <div class="app_frame_content" v-html="content" v-if="content"></div>
      <div class="content pad" v-else>
        <van-empty description="暂无" />
      </div>
    </div>
    <div class="foot">
      <van-button block color="#99CC33" @click.stop="toResult"
        >立即兑换</van-button
      >
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      round
      :style="{ height: '30%' }"
    >
      <div class="select">
        <h6 class="t">选择规格</h6>
        <ul class="s_list">
          <li
            @click.stop="setTag(i)"
            v-for="i in specs"
            :key="i"
            :class="{ active: tag === i }"
          >
            {{ i }}
          </li>
        </ul>
        <div class="btn">
          <van-button block color="#99CC33" @click.stop="toResult"
            >提交兑换</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      grade: 0,
      desc: "",
      stock: 0,
      convert: 0,
      specs: [],
      pic: [],
      current: 0,
      show: false,
      tag: "",
      item: ["32G", "64G", "128G", "256G", "512G"],
      id: null,
      detail: {},
    };
  },
  inject: ["appPath"],
  methods: {
    onChange(i) {
      this.current = i;
    },
    setTag(i) {
      this.tag = i;
    },
    toResult() {
      if (this.specs.length) {
        if (!this.tag) {
          this.show = true;
          return false;
        }
      }
      this.$api.http(
        "recommendShopBuy",
        { goods_id: this.id, specs: this.tag },
        (e) => {
          this.$model.info("兑换成功", 2);
          this.appPath("/recommend_shop_details/" + e);
        }
      );
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.$api.http("recommendShopDetail", { goods_id: this.id }, (e) => {
      this.detail = e;
      this.content = e.synopsis;
      this.grade = e.price;
      this.desc = e.goods_name;
      this.stock = e.stock;
      this.convert = e.convert;
      this.specs = e.specs;
      this.pic = e.pictures;
    });
  },
};
</script>
<style lang='less' scoped>
.recom_shop_det {
  font-size: 15px;
  overflow-y: scroll;
  background-color: #f8f8f8;
  .select {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-top: 15px;
    position: relative;
    .t {
      font-size: 14px;
      color: #333;
      text-indent: 15px;
    }
    .s_list {
      padding: 10px 15px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      li {
        font-size: 13px;
        background-color: #f2f2f2;
        height: 40px;
        padding: 0 30px;
        line-height: 40px;
        border-radius: 5px;
        margin-right: 8px;
        margin-bottom: 10px;
        min-width: 109px;
        box-sizing: border-box;
        text-align: center;
        transition: all 0.3s;
        color: #333;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &.active {
          background-color: #99cc33;
          color: #fff;
        }
      }
    }
    .btn {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .foot,
  .btn {
    height: 50px;
    .van-button {
      height: 50px;
      font-size: 17px;
      font-weight: 700;
      border-radius: 0;
    }
  }
  .van-swipe {
    height: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 15px;
    bottom: 15px;
    border-radius: 12px;
    padding: 5px 8px;
    font-size: 12px;
    color: #fff;
    background: rgba(0, 0, 0, 0.1);
  }
  .banner {
    height: 210px;
    background-color: #eee;
  }
  .head {
    min-height: 112px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 15px;
    margin-bottom: 8px;
    .grade {
      font-weight: 700;
      font-size: 17px;
      color: #99cc33;
      margin-bottom: 10px;
    }
    .text {
      font-size: 16px;
      color: #222;
      margin-bottom: 9px;
      word-break: break-all;
    }
    .tool {
      span {
        display: inline-block;
        margin-right: 10px;
        color: #666;
        font-size: 13px;
      }
    }
  }
  .line {
    height: 50px;
    background-color: #fff;
    margin-bottom: 8px;
    position: relative;
    display: flex;
    box-sizing: border-box;
    padding: 0 27px 0 15px;
    font-size: 15px;
    line-height: 50px;
    .arrow {
      position: absolute;
      width: 6px;
      height: 11px;
      right: 15px;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .n {
      color: #222;
      margin-right: 10px;
    }
    .tag {
      flex: 1;
      text-align: right;
      color: #666;
    }
  }
  .detail {
    font-size: 15px;
    color: #666;
    padding: 15px;
    box-sizing: border-box;
    background-color: #fff;
    > .title {
      font-size: 13px;
      color: #666;
      padding-bottom: 9px;
      border-bottom: 1px solid #ececec;
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .pad {
    padding-top: 50px;
  }
  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
