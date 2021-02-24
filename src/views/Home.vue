<template>
  <div class="home">
    <!-- 公告栏 -->
    <van-notice-bar
      left-icon="volume-o"
      text="欢迎光临NiceMall商城！该APP只是黄恺个人学习，下单一律不发货！"
      color="#fff"
      background="#ff5777"
    />

    <!-- 搜索框 -->
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      background="#ff5777"
      shape="round"
      @focus="$router.push({name: 'Search'})"
    />

    <!-- 轮播图 -->
    <div class="banner">
      <!-- 美丽说轮播图 -->
      <van-swipe :autoplay="3000" indicator-color="#f52a4f">
        <van-swipe-item v-for="(item, index) in beautyBannerDatas" :key="index">
          <a :href="item.link">
            <img :src="item.image" />
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 宫格盒子 -->
    <van-grid :border="false">
      <!-- 美丽说的推荐 -->
      <van-grid-item
        v-for="(item, index) in beautyRecommendDatas"
        :key="index"
        @click="goRemmLists(item)"
      >
        <van-image :src="item.image" width="50" height="50" :round="true" />
        <div class="recommend-title">{{ item.title }}</div>
      </van-grid-item>
      <van-grid-item
        v-for="item in beautyRecommendDatas"
        :key="item.acm"
        @click="goRemmLists(item)"
      >
        <van-image :src="item.image" width="50" height="50" :round="true" />
        <div class="recommend-title">{{ item.title }}</div>
      </van-grid-item>
      
    </van-grid>

    <!-- 灰色间隔 -->
    <div class="gap"></div>

    <!-- 本周流行 -->
    <div class="fashion-box">
      <a :href="weekHref">
        <img src="../assets/recommend_bg.jpg" class="auto-img" />
      </a>
    </div>

    <!-- 产品盒子 start -->
    <div class="product-box">
      <div>
        <div class="pro-title-box">
          <span class="pro-title">热卖推荐</span>
        </div>

        <!-- 列表插件盒子 -->
        <HotList
          :showListDatas="showListDatas"
          @concat-data="concatData"
        ></HotList>
      </div>
    </div>
    <!-- 产品盒子 end -->

    <router-view></router-view>
  </div>
</template>

<script>
import HotList from "../components/HotList.vue";

export default {
  name: "Home",

  components: {
    HotList,
  },

  data() {
    return {
      // input输入框的value值
      value: null,
      // 轮播图的数据
      beautyBannerDatas: null,
      // 保存美丽说推荐数据
      beautyRecommendDatas: [
        {
          image: require("../assets/images/remm1.png"),
          title: "流行",
          type: "pop",
          bg: require("../assets/images/pop_bg.jpg"),
        },
        {
          image: require("../assets/images/remm2.png"),
          title: "新款",
          type: "new",
          bg: require("../assets/images/new_bg.jpg"),
        },
        {
          image: require("../assets/images/remm3.png"),
          title: "热销",
          type: "sell",
          bg: require("../assets/images/sell_bg.jpg"),
        },
        {
          image: require("../assets/images/remm4.png"),
          title: "流行",
          type: "pop",
          bg: require("../assets/images/pop_bg.jpg"),
        },
      ],
      // 页数
      page: 1,
      // 列表所有数据
      listDatas: null,
      // 列表展示的数据
      showListDatas: null,
      // 本周流行跳转的href
      weekHref: null,
    };
  },

  created() {
    this.getBeautyMultiDatas();
    this.getRemmListsData();
  },

  methods: {
    // 获取美丽说Home的数据
    getBeautyMultiDatas() {
      // 启动加载提示
      this.$toast.loading({
        // 提示文本内容
        message: "加载中...",
        // 禁止穿透点击
        forbidClick: true,
        // 展示时长，0表示不限制，不关闭
        duration: 0,
      });

      this.$axios({
        method: "get",
        url: this.beauty + "/home/multidata",
      })
        .then((res) => {
          this.beautyBannerDatas = res.data.data.banner.list;

          // 本周流行跳转的href
          this.weekHref = res.data.data.banner.list[0].link;

          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);

          this.$toast.clear();
        });
    },

    // 跳到美丽说推荐列表页
    goRemmLists(currentRemm) {
      // 路由跳转
      this.$router.push({ name: "RemmLists", query: { currentRemm } });
      localStorage.setItem("currentRemm",JSON.stringify(currentRemm));
    },

    // 初始化加载前4条数据
    getRemmListsData() {
      // 启动加载提示
      this.$toast.loading({
        // 提示文本内容
        message: "加载中...",
        // 禁止穿透点击
        forbidClick: true,
        // 展示时长，0表示不限制，不关闭
        duration: 0,
      });

      this.axios({
        method: "get",
        url: this.beauty + "/home/data",
        params: {
          type: 'pop',
          page: 1,
        },
      })
        .then((res) => {
          this.listDatas = res.data.data.list;
          this.showListDatas = this.listDatas.slice(0, 4);
          this.page++;

          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);

          this.$toast.clear();
        });
    },

    // 下拉加载更多，并拼接到数据后面
    concatData(list) {
      this.listDatas = list;
      if(this.listDatas && this.showListDatas){
        this.showListDatas = this.showListDatas.concat(
          this.listDatas.slice(this.page * 4, (this.page + 1) * 4)
        );
        this.page++;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  background-color: #eee;
  padding-bottom: 60px;

  .gap {
    background-color: #eee;
    width: 100%;
    height: 16px;
  }

  .banner {
    padding: 10px 10px 16px;
    background-color: #fff;
  }
  .van-swipe {
    border-radius: 10px;
  }
  /deep/ .van-swipe-item {
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .recommend-title {
    font-size: 14px;
    margin-top: 10px;
  }
  .coffer-title {
    width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  /deep/ .van-grid-item__content {
    padding-top: 0;
  }

  .product-box {
    margin-top: 10px;

    .pro-title-box {
      padding: 10px 0;
      background-color: #fff;
    }

    .pro-title {
      display: inline-block;
      background-color: #ff5777;
      color: #fff;
      font-size: 13px;
      padding: 0 14px;
      height: 32px;
      line-height: 32px;
      border-top-right-radius: 16px;
    }

    .products {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 10px;

      .pro-item {
        width: 49%;
        background-color: #fff;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 8px;
        margin-top: 10px;

        .pro-info {
          font-size: 15px;
          color: #646566;
          margin-top: 10px;

          .pro-enname {
            margin: 5px 0 10px 0;
            font-size: 12px;
            color: #999;
          }

          .pro-price {
            color: #ff5777;
            font-weight: bold;
            font-size: 0.42667rem;
          }
        }
      }
    }
  }
}
</style>