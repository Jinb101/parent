<template>
  <div class="task_det">
    <v-tool-title></v-tool-title>
    <van-field label="发表日期" readonly v-model="time" />
    <van-field
      label="作业内容"
      readonly
      v-model="detail.content"
      type="textarea"
      autosize
      rows="2"
    />
    <van-field label="作业图片" readonly v-model="image" />
    <div class="flex fw i" v-if="detail.picture && detail.picture.length">
      <div class="ava" v-for="(i, j) in detail.picture" :key="j + '-s'">
        <van-image
          :src="i"
          fit="cover"
          @click="appShowImage(detail.picture, j)"
        ></van-image>
      </div>
    </div>
    <van-field label="作业附件" readonly />
    <div class="play i">
      <v-v
        :wh="{ width: '100%', height: '100%' }"
        :item="[{ img: detail.video, cover: imageOnce }]"
        ids="task-det-player"
        class="a"
      ></v-v>
    </div>
    <van-field label="当前状态" readonly v-model="state" />
    <div v-if="isstate">
      <van-field
        label="作业内容"
        type="textarea"
        required
        autosize
        rows="3"
        maxlength="66"
        show-word-limit
        v-model="value"
      />
      <van-field label="图片" readonly>
        <template #button>
          <v-i class="b" @path="onPathImage"></v-i>
        </template>
      </van-field>
      <van-field label="视频" readonly>
        <template #button>
          <div class="b">
            <v-u @path="onPathVideo" type="video"></v-u>
          </div>
        </template>
      </van-field>
    </div>
    <div v-else>
      <van-field
        label="提交文本"
        type="textarea"
        readonly
        autosize
        rows="3"
        v-model="detail.task_answers.answer_content"
      />
      <!-- <van-field label="提交图片" type="tel" readonly v-if="imageList.length" /> -->
      <h5 v-if="imageList.length">提交图片</h5>
      <div class="flex fw i" v-if="imageList.length">
        <div class="ava" v-for="(i, j) in imageList" :key="j + '-s'">
          <van-image
            :src="i"
            fit="cover"
            @click="appShowImage(imageList, j)"
          ></van-image>
        </div>
      </div>
      <!-- <van-field
        label="提交附件"
        readonly
        v-if="detail.task_answers.answer_video"
      /> -->
      <h5 v-if="detail.task_answers.answer_video">提交附件</h5>
      <div class="play i" v-if="detail.task_answers.answer_video">
        <v-v
          :wh="{ width: '100%', height: '100%' }"
          :item="[
            {
              img: detail.task_answers.answer_video,
              cover: detail.task_answers.answer_picture[0],
            },
          ]"
          ids="task-det-player-2"
          class="a"
        ></v-v>
      </div>
    </div>
    <div class="foot" v-if="isstate">
      <van-button :color="theme.linear" block @click="onSub"
        >提交作业</van-button
      >
    </div>
  </div>
</template>

<script>
import vV from "../../private/video2.vue";
import vI from "../../private/image.vue";
import vU from "../../public/upload.vue";
export default {
  data() {
    return {
      detail: {},
      theme: {},
      value: "",
      img: "",
      video: "",
    };
  },
  methods: {
    onPathImage(e) {
      this.img = e
        .map((s) => {
          return s.path;
        })
        .join(",");
    },
    onPathVideo(e) {
      this.video = e.path;
    },
    onSub() {
      if (!this.value) return this.$model.info("请输入作业内容", 2);
      this.$api.http(
        "growTaskAdd",
        {
          task_id: this.detail.id,
          answer_content: this.value,
          answer_picture: this.img,
          answer_video: this.video,
        },
        () => {
          this.$model.info("提交成功", 2);
          this.appBack(true);
        }
      );
    },
  },
  components: { vV, vI, vU },
  inject: ["appGetTheme", "appShowImage", "appBack"],
  computed: {
    state() {
      if (this.detail.task_answers && this.detail.task_answers.child_id) {
        return this.detail.task_answers.status * 1 === 1 ? "已提交" : "已完成";
      }
      return "未提交";
    },
    isstate() {
      return this.state === "未提交";
    },
    time() {
      return this.detail.create_time
        ? this.$demo.timeout(this.detail.create_time, "ymd")
        : "";
    },
    image() {
      return this.detail.picture && this.detail.picture.length ? "" : "无";
    },
    imageOnce() {
      return this.detail.picture && this.detail.picture.length
        ? this.detail.picture[0]
        : "";
    },
    imageList() {
      if (this.isstate) return [];
      return this.detail.task_answers.answer_picture || [];
    },
  },
  mounted() {
    this.theme = this.appGetTheme();
    this.$api.http(
      "growthTaskDetail",
      { task_id: this.$route.params.id },
      (e) => {
        this.detail = e;
      }
    );
  },
};
</script>
<style lang='less' scoped>
.task_det {
  padding-bottom: 44px;
  overflow-y: scroll;
  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .ava {
    width: 80px;
    height: 80px;
    margin: 0 5px 5px 0;
  }
  .i {
    padding: 10px;
  }
  .play {
    height: 200px;
  }
  .a {
    height: 100%;
  }
  .b {
    width: 240px;
  }
  h5 {
    font-size: 14px;
    padding: 10px 16px;
  }
}
</style>
