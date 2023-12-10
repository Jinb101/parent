<template>
  <div class="new_index_food">
    <v-tool-title>
      <span class="col_green" @click="appPath('/food_history')">历史食谱</span>
    </v-tool-title>
    <div class="views">
      <v-d></v-d>
    </div>
  </div>
</template>

<script>
import vD from "./_detail.vue";
export default {
  data() {
    return {};
  },
  inject: ["appPath"],
  components: { vD },
  methods: {},
  mounted() {},
};
</script>
<style lang='less' scoped>
.views {
  height: calc(100% - 46px);
  overflow-y: scroll;
}
</style>
