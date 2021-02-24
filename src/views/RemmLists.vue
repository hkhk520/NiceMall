<template>
  <div class="remm-lists">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar
        :title="currentRemm.title"
        left-text="返回"
        left-arrow
        @click-left="goBack"
        :safe-area-inset-top="true"
      />
    </van-sticky>

    <!-- 导航背景图 -->
    <img :src="currentRemm.bg" class="auto-img" />

    <!-- 列表插件盒子 -->
    <ListItem
      :showListDatas="showListDatas"
      @concat-data="concatData"
    ></ListItem>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ListItem from "../components/ListItem.vue";

export default {
  name: "RemmLists",

  data() {
    return {
      // 列表所有数据
      listDatas: null,
      // 列表展示的数据
      showListDatas: null,
      // 页数
      page: 1,
    };
  },

  created() {
    if (this.currentRemm) {
      // 是从Home页面进来的
      if (this.isHome) {
        // 截取路由参数的当前美丽说推荐项
        let payload = this.$route.query.currentRemm;
        // 拦截路由参数,并向Vuex发送修改事件
        this.$store.commit("changeCurrentRemm", payload);
      }
    }

    // 调用初始化加载前4条数据的方法
    this.getRemmListsData();
  },

  computed: {
    // Vuex的state只能通过计算属性来获取
    ...mapState(["currentRemm", "isHome", "clickListCount"]),
  },

  components: {
    ListItem,
  },

  methods: {
    // 初始化加载前4条数据
    getRemmListsData() {
      // 如果Vuex或者路由参数没有currentRemm，就从本地缓存中获取
      if (!this.currentRemm) {
        let localCurrentRemm = JSON.parse(localStorage.getItem("currentRemm"));
        this.$store.commit("changeCurrentRemm", localCurrentRemm);
      }

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
          type: this.currentRemm.type, // 'pop'  'sell'  'new'
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
      if (this.listDatas && this.showListDatas) {
        this.showListDatas = this.showListDatas.concat(
          this.listDatas.slice(this.page * 4, (this.page + 1) * 4)
        );
        this.page++;
      }
    },

    // 返回上一页
    goBack() {
      // 向Vuex发送修改isHome为true，即重新获取路由参数
      this.$store.commit("toggleIsHome", true);
      // 向Vuex发送修改clickListCount为0，即重新记录点击列表的次数
      this.$store.commit("changeClickListCount", true);
      // 路由返回上一级
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.remm-lists {
  background-color: #eee;

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
  /deep/ .van-button__content {
    font-size: 14px;
  }
  /deep/ .van-button--block {
    padding: 14px 0;
    border-radius: 4px;
  }
}
</style>