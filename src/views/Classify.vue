<template>
  <div class="classify" v-if="bigCategoryLists">
    <van-tree-select
      height="100vh"
      :items="bigCategoryLists"
      :main-active-index.sync="active"
      @click-nav="showMiddleList"
    >
      <template #content>
        <van-grid :column-num="3" icon-size="70px">
          <van-grid-item
            v-for="(item, index) in middleLists"
            :key="index"
            :icon="item.image"
            :text="item.title"
            @click="goSmallClassify(bigCategoryLists[active].miniWallkey, item.title)"
          />
        </van-grid>
      </template>
    </van-tree-select>
  </div>
</template>

<script>
export default {
  name: "Classify",

  data() {
    return {
      // 左边导航栏的当前显示下标
      active: 0,
      // 保存大分类的数据
      bigCategoryLists: null,
      // 保存中分类的数据
      middleLists: null,
    };
  },

  created() {
    // 获取大分类的数据
    this.getBigCategoryLists();
  },

  methods: {
    // 获取大分类数据的方法
    getBigCategoryLists() {
      // 启动加载提示
      this.$toast.loading({
        // 提示文本内容
        message: "加载中...",
        // 禁止穿透点击
        forbidClick: true,
        // 展示时长，0表示不限制，不关闭
        duration: 0,
      });

      // 请求大分类的数据
      this.axios({
        url: this.beauty + "/category",
      })
        .then((res) => {
          let lists = res.data.data.category.list;
          // 修改请求回来的数据格式
          let arrLists = [];
          lists.forEach((item) => {
            arrLists.push({
              text: item.title,
              maitKey: item.maitKey,
              miniWallkey: item.miniWallkey,
            });
          });
          // 保存到data里面去
          this.bigCategoryLists = arrLists;

          // 获取左边第一个的中分类数据 的参数
          let maitKey = this.bigCategoryLists[0].maitKey;

          // 成功，请求第一个大分类里面的中分类数据
          this.axios({
            url: this.beauty + "/subcategory",
            params: {
              maitKey,
            },
          })
            .then((res) => {
              this.middleLists = res.data.data.list;
              this.$toast.clear();
            })
            .catch((err) => {
              console.log(err);
              this.$toast.clear();
            });
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    // 点击了左边的导航栏那一个分类就获取对应的中分类的数据的方法
    showMiddleList(index) {
      this.axios({
        url: this.beauty + "/subcategory",
        params: {
          maitKey: this.bigCategoryLists[index].maitKey,
        },
      }).then((res) => {
        this.middleLists = res.data.data.list;
      });
    },

    goSmallClassify(miniWallkey,title){
      this.$router.push({name: "SmallClassify",query: {miniWallkey, title}});
    }
  },
};
</script>

<style lang="less" scoped>
.classify {
  padding-bottom: 50px;

  /deep/ .van-sidebar {
    width: 60px;
  }
  /deep/ .van-tree-select__nav {
    -webkit-flex: 0.6;
    flex: 0.6;
  }
  /deep/ .van-tree-select__nav-item {
    text-align: center;
  }
  /deep/ .van-sidebar-item--select::before {
    width: 2px;
    height: 100%;
    background-color: #ff5777;
  }
  /deep/ .van-grid-item__content {
    padding: 8px;
  }
}
</style>