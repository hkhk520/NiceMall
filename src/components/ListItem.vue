<template>
  <div class="list-item">
    <!-- 列表插件盒子 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 列表大盒子 -->
      <div class="list-big-box">
        <!-- 每一个列表小盒子 -->
        <div
          class="list-box"
          v-for="(item,index) in showListDatas"
          :key="index"
          @click="goBeatyDetail(item.iid)"
        >
          <!-- 展示图片 isClassify ? item.img : item.show.img -->
          <img :src="item.img || item.show.img || defaultImg" class="auto-img" />
          <!-- 图片下面的详情盒子 -->
          <div class="list-desc-box">
            <!-- 标题 -->
            <p>{{ item.title || "I Love U" }}</p>
            <!-- 价格盒子 -->
            <div class="price-box">
              <!-- 左边盒子 -->
              <div class="limit-price-box">
                <span class="limit-price-icon">限时价</span>
                <span>￥{{ item.price || "520" }}</span>
              </div>
              <!-- 右边被划掉盒子 -->
              <div class="origin-price">{{ item.orgPrice || "999" }}</div>
            </div>
            <!-- 立即购买按钮 -->
            <van-button block color="#ff5777" size="mini">立即购买</van-button>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ListItem",

  props: ["showListDatas", "isClassify"],

  data() {
    return {
      // 列表下滑加载更多
      finished: false,
      loading: false,
      defaultImg: require('../assets/images/default.jpg'),
    };
  },

  computed: {
    // Vuex的state只能通过计算属性来获取
    ...mapState(["currentRemm", "isHome", "clickListCount","miniWallkey","type"]),
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

    // 下拉加载更多，添加4条数据
    onLoad() {
      if (this.isClassify) {
        this.axios({
          url: this.beauty + "/subcategory/detail",
          params: {
            miniWallkey: this.miniWallkey,
            type: this.type,
          },
        })
          .then((res) => {
            let list = res.data;

            this.$emit("concat-data", list);

            // 加载状态结束
            this.loading = false;

            // 数据全部加载完成
            if (this.showListDatas && this.showListDatas.length >= 36) {
              this.finished = true;
            }
           
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // 异步更新数据
        // 下拉加载更多
        this.axios({
          method: "get",
          url: this.beauty + "/home/data",
          params: {
            type: this.currentRemm.type, // 'pop'  'sell'  'new'
            page: 1,
          },
        }).then((res) => {
          let list = res.data.data.list;

          this.$emit("concat-data", list);

          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.showListDatas && this.showListDatas.length >= 26) {
            this.finished = true;
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list-item {
  .list-big-box {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    .list-box {
      width: 46%;
      border-radius: 10px;
      margin-top: 10px;

      img {
        border-radius: 10px 10px 0 0;
      }

      .list-desc-box {
        width: 100%;
        padding: 6px 10px 10px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        p {
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
    }
  }
}
</style>