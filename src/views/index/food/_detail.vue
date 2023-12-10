<template>
  <div class="food_detail">
    <div class="list">
      <section v-for="(i, j) in item" :key="j">
        <van-divider
          content-position="left"
          :style="{
            color: '#ffbc00',
            borderColor: '#ffbc00',
            padding: '0 16px',
            margin: '10px 0 0',
          }"
        >
          {{ i.recipe_date }} {{ i.week }}
        </van-divider>
        <template v-if="i.list && i.list.length">
          <div class="lst" v-for="(x, y) in i.list" :key="y + '-' + j">
            <h6>{{ x.dish_type_name }}</h6>
            <template v-if="x.list && x.list.length">
              <ul>
                <li
                  v-for="(q, w) in x.list"
                  :key="w + '-' + y + '-' + j"
                  class="flex"
                  @click.stop="ondetail(q)"
                >
                  <div class="logo">
                    <van-image
                      :src="q.picture_of_dishes"
                      v-if="q.picture_of_dishes"
                      fit="cover"
                      @click="appShowImage(q.picture_of_dishes)"
                    ></van-image>
                  </div>
                  <p class="name">
                    {{ q.cooked_food_name }}
                    <span>{{ +q.total_ingredients }}g</span>
                    <b class="click">点击查看食材</b>
                  </p>
                </li>
              </ul>
            </template>
            <p v-else>暂无</p>
          </div>
        </template>
        <div class="lst" v-else><p>暂无</p></div>
      </section>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <template v-if="child.nursery_dish && child.nursery_dish.length">
        <van-cell
          v-for="(i, j) in child.nursery_dish"
          :key="j"
          :title="i.goods_name || '*'"
          :value="+i.consumption + 'g'"
        ></van-cell>
      </template>
      <van-empty v-else description="暂未收录食材"></van-empty>
    </van-popup>
    <!-- <x-box :title="i.week" v-for="(i, j) in item" :key="j">
      <template #icon>
        <x-radius size="35" color="#6943f2">
          <van-icon name="point-gift" />
        </x-radius>
      </template>
      <template v-for="(x, y) in i.list">
        <p :key="y + '-'" v-if="x.dish_name === ''"></p>
        <section :key="y + '-'" v-else>
          <span class="type">{{
            ["", "早餐", "早点", "午餐", "午点", "晚餐"][+x.dish_type]
          }}</span>
          <div class="line flex">
            <div class="logo">
              <x-radius size="35">
                <van-image
                  :src="x.menu_thumbnail"
                  fit="cover"
                  lazy-load
                ></van-image>
              </x-radius>
            </div>
            <h5>{{ x.dish_name }}</h5>
          </div>
          <template v-if="x.element && x.element.length">
            <div class="comment flex fw">
              <van-tag type="success" v-for="(q, w) in x.element" :key="w + 's'"
                >{{ q.element }}：{{ q.content }}mg</van-tag
              >
            </div>
          </template>
        </section>
      </template>
    </x-box> -->
  </div>
</template>

<script>
export default {
  props: { fid: { type: [String, Number], default: "" } },
  data() {
    return { item: [], show: false, child: {} };
  },
  inject: ["appShowImage"],
  methods: {
    ondetail(e) {
      this.child = e;
      this.show = true;
    },
  },
  mounted() {
    this.$api.http("foodNewGetDetail", { recipes_id: this.fid }, (res) => {
      this.item = res;
    });
  },
};
</script>
<style lang='less' scoped>
.list {
  font-size: 15px;
}
.b1 {
  width: 120px;
}
.lst {
  padding: 0 10px 10px;
  h6 {
    padding: 8px;
    position: relative;
    font-weight: 650;
    &::before {
      position: absolute;
      content: "";
      left: 0;
      width: 2px;
      height: 12px;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: #38f;
    }
  }
  li {
    color: rgb(119, 119, 119);
    line-height: 40px;
    padding-left: 10px;
    & + li {
      margin-top: 8px;
    }
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: #f9f9f9;
    }
    .name {
      flex: 1;
      position: relative;
      .click {
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 12px;
        color: rgb(226, 225, 225);
        line-height: 1;
      }
    }
  }
}
// section {
//   position: relative;
//   padding: 8px;
//   > span {
//     position: absolute;
//     right: 5px;
//     top: 5px;
//     font-size: 12px;
//     color: #999;
//   }
//   .line {
//     height: 35px;
//     line-height: 35px;
//   }
//   h5 {
//     padding-left: 10px;
//     font-size: 15px;
//     font-weight: 650;
//   }
// }
// .comment {
//   padding: 15px 8px 3px;
//   .van-tag {
//     margin: 0 5px 5px 0;
//   }
// }
</style>
