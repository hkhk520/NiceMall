<template>
  <div class="like-item">
    <!-- 每一个列表小盒子 -->
    <div
      class="list-box"
      v-for="(item, index) in likeArr"
      :key="index"
      @click="goBeatyDetail(item.iid)"
      ref="currentLikeItem"
    >
      <div class="inline-box">
        <!-- 展示图片 isClassify ? item.img : item.show.img -->
        <img :src="item.showImg" class="auto-img" />
        <!-- 图片下面的详情盒子 -->
        <div class="list-desc-box">
          <!-- 标题 -->
          <p>{{ item.title }}</p>
          <!-- 价格盒子 -->
          <div class="price-box">
            <!-- 左边盒子 -->
            <div class="limit-price-box">
              <span class="limit-price-icon">限时价</span>
              <span>￥{{ item.price }}</span>
            </div>
            <!-- 右边被划掉盒子 -->
            <div class="origin-price">{{ item.oldPrice }}</div>
          </div>
        </div>

        <!-- 选择删除的遮罩层 -->
        <div class="overlay" v-show="del" @click.stop="$emit('change-is-del',item)">
          <div class="icon">
            <van-icon name="passed" :color="item.isDel ? '#f5264c' : '#fff'" size="32" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "LikeItem",

  props: {
    likeArr: {
      type: Array,
      default() {
        return [];
      },
      required: true,
    },
    del: Boolean,
  },

  data() {
    return {
    };
  },

  methods: {
    // 点击每一个列表去到商品详情页
    goBeatyDetail(iid) {
      // 向Vuex发送修改clickListCount的事件
      this.$store.commit("changeClickListCount", false);
      if (this.clickListCount == 1) {
        // 向Vuex发送修改isHome为false
        this.$store.commit("toggleIsHome");
      }

      // 跳到美丽说详情页面
      this.$router.push({ name: "BeatyDetail", params: { iid } });
    },

  },
};
</script>

<style lang="less" scoped>
.like-item {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  .list-box {
    width: 46%;
    border-radius: 10px;
    margin-bottom: 10px;

    img {
      border-radius: 10px 10px 0 0;
    }

    .list-desc-box {
      width: 100%;
      padding: 6px 10px 4px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 0 0 10px 10px;
      p {
        font-size: 13px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
      }

      .price-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 6px 0;

        .limit-price-box {
          display: flex;
          align-items: center;
          .limit-price-icon {
            border: 1px solid #ff5777;
            color: #ff5777;
            // padding: 0 2px;
            font-size: 12px;
          }
        }

        .origin-price {
          font-size: 12px;
          color: #a1a0b7;
          text-decoration: line-through;
        }
      }
    }

    .inline-box{
      position: relative;

      .overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 10px;

        .icon{
          position: absolute;
          top: 10px;
          left: 10px;
          img{
            width: 30px;
            height: 30px;
          }
        }
      }
    }

  }
}
</style>