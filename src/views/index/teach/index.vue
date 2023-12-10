<template>
  <div class="teach">
    <v-tool-title></v-tool-title>
    <v-page title="教师风采" api="info" bottom :ext="{ type: 1 }">
      <template #list="{ item }">
        <div class="flex" @click="appPath('/teach_detail/' + item.id)">
          <div class="ico">
            <van-image
              :src="item.image[0]"
              fit="cover"
              radius="5px"
            ></van-image>
          </div>
          <div class="stro">
            <h6 class="van-ellipsis">{{ item.title }}</h6>
            <p class="van-multi-ellipsis--l2" v-if="item.content">
              <b>简介：</b>{{ item.content }}
            </p>
            <p class="van-multi-ellipsis--l2" v-if="item.declaration">
              <b>教育宣言：</b>{{ item.declaration }}
            </p>
          </div>
        </div>
      </template>
    </v-page>
  </div>
</template>

<script>
import vPage from "../../private/page.vue";
export default {
  data() {
    return {};
  },
  inject: ["appPath"],
  components: { vPage },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.teach {
  .flex {
    padding: 15px;
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
      max-height: 32px;
      margin-bottom: 5px;
      b {
        color: #999;
      }
    }
  }
}
</style>
