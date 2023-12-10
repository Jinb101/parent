<template>
  <div class="user_atten_image">
    <v-tool-title></v-tool-title>
    <div class="cont">
      <h6>考勤人脸识别图添加/更改</h6>
      <v-u class="ava" :logo="logo" @path="onPath" cover></v-u>
    </div>
  </div>
</template>

<script>
import vU from "../../public/upload.vue";
export default {
  data() {
    return { logo: "", base_map: "" };
  },
  components: { vU },
  methods: {
    onPath(e) {
      this.$api.http(
        "userSetAttendanceImage",
        { base_map: e.path },
        (r, code) => {
          if (code === 411) {
            let s = this.logo;
            this.logo = "false";
            this.$nextTick(() => {
              this.logo = s;
            });
            return this.$model.info("图片过大", 2);
          }
          this.$model.info("更新成功", 2);
          this.base_map = e.path;
          this.logo = e.data;
        },
        "post",
        true,
        [200, 411]
      );
    },
  },
  mounted() {
    this.$api.http("userGetAttendanceImage", {}, (e) => {
      this.logo = e.base_maps;
      this.base_map = e.base_map;
    });
  },
};
</script>
<style lang='less' scoped>
.user_atten_image {
  .cont {
    padding: 15px;
    font-size: 14px;
  }
  h6 {
    margin-bottom: 20px;
  }
  .ava {
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 8px;
    width: 345px;
    height: 345px;
    overflow: hidden;
  }
}
</style>
