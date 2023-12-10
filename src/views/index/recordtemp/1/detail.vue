<template>
  <v-view header @on-view="onview" nologin>
    <v-d v-model="ext" :uncomment="isuser"></v-d>
  </v-view>
</template>

<script>
import vD from "./det.vue";
export default {
  data() {
    return {
      ext: {},
      isuser: false,
      params: {},
    };
  },
  components: { vD },
  methods: {
    onview(e) {
      this.params = this.$route.params || {};
      this.isuser = !!e.user.id;
      this.$api.http(
        "a2023051902",
        { observe_id: this.params.id, open_id: "" },
        (r) => {
          this.ext = r;
        }
      );
    },
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
</style>
