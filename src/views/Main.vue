<template>
  <div class="main">
    <!-- 底部导航栏 -->
    <div>
      <van-tabbar
        v-model="active"
        route
        active-color="#ff5777"
        inactive-color="#646566"
      >
        <van-tabbar-item
          v-for="(item, index) in tabbarDatas"
          :key="index"
          :icon="item.icon"
          replace
          :to="item.path"
          >{{ item.title }}</van-tabbar-item
        >
      </van-tabbar>
    </div>

    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
// 导入Vuex的辅助函数
import { mapState } from "vuex";
export default {
  name: "Main",

  data() {
    return {
      tabbarDatas: [
        { title: "首页", icon: "home-o", path: "/home", name: "Home" },
        { title: "分类", icon: "qr", path: "/classify", name: "Classify" },
        {
          title: "购物车",
          icon: "shopping-cart-o",
          path: "/cart",
          name: "Cart",
        },
        { title: "我的", icon: "user-o", path: "/me", name: "Me" },
      ],
      active: "Home",
    };
  },

  computed: {
    // 计算属性获取store里面的state的isShowTabBottom,如果同名，可用辅助函数
    // isShowTabBottom(){
    //   return this.$store.state.isShowTabBottom;
    // }
    // 解构辅助函数
    // ...mapState(["isShowTabBottom"]),
  },
};
</script>

<style lang="less" scoped>
.main {
  // #ff5777

  // 底部导航栏边框阴影
  /deep/ .van-tabbar--fixed {
    box-shadow: 0 0 1px 1px #ccc;
  }

  /deep/ .van-tabbar {
    z-index: 10;
  }
}
</style>