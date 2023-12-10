<template>
  <div class="link"></div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
    };
  },
  inject: ["appGetParams"],
  methods: {
    init() {
      let page = this.id.split("____").join("/");
      let v = this.$demo.es6().encrypt(
        {
          token: this.$demo.$local.get("token"),
          id: this.$demo.$local.get("nid"),
          type: "web",
          page,
          // page: "detail/62",
          local: "youeryuanweb" + this.appGetParams("id"),
          old: "true",
        },
        "food"
      );
      window.location.replace(this.$js.api.h5 + "h5/foods/?h5=" + v);
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.init();
  },
};
</script>
<style lang='less' scoped>
</style>
