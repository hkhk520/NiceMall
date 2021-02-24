<template>
  <div class="small-classify">
    <!-- 头部导航栏 -->
    <van-nav-bar
      :title="title"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 类型导航栏的分类 -->
    <van-tabs v-model="active" title-active-color="#ee0a24" title-inactive-color="#333" @click="getTypeData(vanTabDatas[active].type)">
      <van-tab v-for="(item,index) in vanTabDatas" :key="index" :title="item.title">

        <!-- 列表插件盒子 -->
        <ListItem
          :showListDatas="showListDatas"
          @concat-data="concatData"
          :isClassify="isClassify"
        ></ListItem>

      </van-tab>
    </van-tabs>


  </div>
</template>

<script>
import ListItem from "../components/ListItem.vue";
import { mapState } from "vuex"

export default {
  name: "SmallClassify",

  data() {
    return {
      title: null,
      // 类型导航栏的分类
      vanTabDatas: [
        {title: "流行", type: "pop"},
        {title: "新款", type: "new"},
        {title: "热销", type: "sell"},
      ],
      // 列表所有数据
      listDatas: null,
      // 列表展示的数据
      showListDatas: null,
      // 页数
      page: 1,
      // 当前的类型下标
      active: 0,
      isClassify: true,
    };
  },

  created() {
    // 截取路由查询参数
    let key = this.$route.query.miniWallkey;
    this.$store.commit("changeMiniWallkey",key);
    this.title = this.$route.query.title;

    // 调用请求小分类里的数据的方法
    this.getSmallClassifyDatas();
  },

  computed: {
    ...mapState(["miniWallkey","type"]),
  },

  components: {
    ListItem,
  },

  methods: {
    // 请求小分类里的数据
    getSmallClassifyDatas() {
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
        url: this.beauty + "/subcategory/detail",
        params: {
          miniWallkey: this.miniWallkey,
          type: this.type,
        },
      })
        .then((res) => {
          this.listDatas = res.data;
          this.showListDatas = this.listDatas.slice(0, 4);

          this.page++;

          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    // 根据不同类型获取不同数据
    getTypeData(type){
      if(this.type == type){
        // console.log("拦截");
        return;
      }
      this.page = 1;
      this.$store.commit("changeType",type);
      this.getSmallClassifyDatas();
    },

    // 下拉加载更多，并拼接到数据后面
    concatData(list) {
      this.listDatas = list;
      if(this.showListDatas){
        this.showListDatas = this.showListDatas.concat(
          this.listDatas.slice(this.page * 4, (this.page + 1) * 4)
        );
        this.page++;
      }
    },

    goBack() {
      this.$router.go(-1);
      this.$store.commit("changeType",'pop');
    },
  },
};
</script>

<style lang="less" scoped>
.small-classify {
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
  /deep/ .van-tabs__line{
    width: 104px;
    height: 1px;
  }

}
</style>