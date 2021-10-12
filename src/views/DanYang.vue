<template>
  <div class="dan-yang">
    <!-- 头部导航栏 -->
    <van-nav-bar
      title="丹阳"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
      :safe-area-inset-top="true"
    />

    <div class="swipe-container">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in swipeImgs" :key="index">
          <img
            :src="item"
            width="100%"
            height="auto"
            class="swipe-img"
            @click="
              isPreview = !isPreview;
              previewIndex = index;
            "
          />
        </van-swipe-item>
      </van-swipe>
      <!-- 点击图片，进行图片预览 -->
      <van-image-preview
        v-model="isPreview"
        :images="swipeImgs"
        :closeable="true"
        :startPosition="previewIndex"
      >
      </van-image-preview>
    </div>

    <van-tabs v-model="active" title-active-color="#ff5777">
      <van-tab title="视频">
        <video width="100%" controls>
          <source src="../assets/gentle.mp4" type="video/mp4" />
        </video>
      </van-tab>
      <van-tab title="音乐">
        <video
          width="100%"
          controls
          v-for="(item, index) in songs"
          :key="index"
        >
          <source :src="item" type="video/mp4" />
        </video>
      </van-tab>
      <van-tab title="图片">待定</van-tab>
      <van-tab title="其他">待定</van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "DanYang",

  data() {
    return {
      active: "true",
      swipeImgs: [
        require("../assets/images/dan1.jpg"),
        require("../assets/images/dan2.jpg"),
      ],
      isPreview: false,
      previewIndex: 0,
      songs: [require("../assets/song1.mp4"), require("../assets/song2.mp4")],
    };
  },

  created() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.dan-yang {
  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__text {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__title {
    color: #ff5777;
    font-weight: bold;
  }
  .van-swipe {
    border-radius: 10px;
  }
  .swipe-container {
    padding: 8px;
    overflow: hidden;
    .swipe-img {
      border-radius: 10px;
    }
  }
}
</style>