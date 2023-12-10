<template>
  <div class="user_avatar">
    <v-tool-title></v-tool-title>
    <h4>点击下方上传/更换家长人脸识别底图</h4>
    <v-u @path="onSetLogoPath" class="image_logo" :logo="logo"></v-u>
    <template v-if="cover">
      <div class="cover">
        <van-image :src="cover" fit="cover"></van-image>
      </div>
    </template>
  </div>
</template>

<script>
import vU from "../../public/upload.vue";
export default {
  data() {
    return {
      logo: "",
      avatar: "",
      cover: "",
    };
  },
  components: { vU },
  methods: {
    onSetLogoPath(e) {
      this.logo = "false";
      this.$api.http("userSetAvatar", { base_map: e.path }, () => {
        this.avatar = e.path;
        this.logo = e.data;
      });
    },
  },
  mounted() {
    this.$api.http("getFaceConfig", { name: "face_settings" }, (res) => {
      this.cover = res.content || "";
    });
    this.$api.http("userGetAvatar", {}, (e) => {
      this.logo = e.base_maps;
      this.avatar = e.base_map;
    });
  },
};
</script>
<style lang='less' scoped>
.user_avatar {
  overflow-y: scroll;
  h4 {
    text-align: center;
    font-size: 15px;
    padding: 30px 0;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .image_logo {
    width: 220px;
    height: 220px;
    margin: 0 auto;
  }
  .cover {
    width: 300px;
    margin: 20px auto;
    height: 300px;
  }
}
</style>
