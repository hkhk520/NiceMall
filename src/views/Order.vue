<template>
  <div class="order">
    <!-- 头部导航栏 -->
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />
    <!-- 顶部背景颜色板 -->
    <div class="bg"></div>

    <div class="order-container">
      <div class="order-box">
        <!-- tab标签栏 -->
        <van-tabs v-model="active" title-active-color="#fc3e61" animated>
          <van-tab title="全部">
            <!-- 当全部订单没有东西先展示的空状态 -->
            <van-empty
              :image="require('../assets/images/empty_order.jpg')"
              :description="
                _token ? '你还没有相关的订单' : '你还未登录呐，去登录吧~~'
              "
              v-if="
                !_token
                  ? true
                  : allOrders == null
                  ? !allOrders
                  : allOrders.length == 0
              "
            >
              <div class="self-desc" v-if="_token">可以去看看有哪些想买滴~</div>
              <van-button color="#ff5777" @click="goHomeOrLogin">{{
                _token ? "逛一逛" : "去登录"
              }}</van-button>
            </van-empty>

            <ul v-else>
              <OrderItem
                v-for="(item, index) in allOrders"
                :key="index"
                :curOrderData="item"
                ><div slot="right">
                  <span v-show="!item.completed" @click="orderCompleted(item)"><van-button color="#ff5777" size="mini">确定收货</van-button></span>
                  <span class="del" v-show="item.completed"
                    >已完成
                    <van-icon
                      name="delete-o"
                      size="17"
                      @click.stop="delCurItem(item)"
                  /></span>
                </div>
              </OrderItem>
            </ul>
          </van-tab>
          <van-tab title="进行中">
            <!-- 当进行中订单没有东西先展示的空状态 -->
            <van-empty
              :image="require('../assets/images/empty_order.jpg')"
              :description="
                _token ? '你还没有相关的订单' : '你还未登录呐，去登录吧~~'
              "
              v-if="
                !_token
                  ? true
                  : proceedOrders == null
                  ? !proceedOrders
                  : proceedOrders.length == 0
              "
            >
              <div class="self-desc" v-if="_token">可以去看看有哪些想买滴~</div>
              <van-button color="#ff5777" @click="goHomeOrLogin">{{
                _token ? "逛一逛" : "去登录"
              }}</van-button>
            </van-empty>

            <ul v-else>
              <OrderItem
                v-for="(item, index) in proceedOrders"
                :key="index"
                :curOrderData="item"
                ><div slot="right" @click="orderCompleted(item)">
                  <span><van-button color="#ff5777" size="mini">确定收货</van-button></span>
                </div>
              </OrderItem>
            </ul>
          </van-tab>
          <van-tab title="已完成">
            <!-- 当已完成订单没有东西先展示的空状态 -->
            <van-empty
              :image="require('../assets/images/empty_order.jpg')"
              :description="
                _token ? '你还没有相关的订单' : '你还未登录呐，去登录吧~~'
              "
              v-if="
                !_token
                  ? true
                  : completedOrders == null
                  ? !completedOrders
                  : completedOrders.length == 0
              "
            >
              <div class="self-desc" v-if="_token">可以去看看有哪些想买滴~</div>
              <van-button color="#ff5777" @click="goHomeOrLogin">{{
                _token ? "逛一逛" : "去登录"
              }}</van-button>
            </van-empty>

            <ul v-else>
              <OrderItem
                v-for="(item, index) in completedOrders"
                :key="index"
                :curOrderData="item"
                ><div slot="right">
                  <span class="del"
                    >已完成
                    <van-icon
                      name="delete-o"
                      size="17"
                      @click.stop="delCurItem(item)"
                  /></span>
                </div>
              </OrderItem>
            </ul>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import OrderItem from "../components/OrderItem.vue";

export default {
  name: "Order",

  components: {
    OrderItem,
  },

  data() {
    return {
      active: 0,
      // 全部订单
      allOrders: null,
      // 保存用户登录的_token
      _token: null,
    };
  },

  created() {
    // 一进页面就获取本地缓存中的所有订单的数据
    this.allOrders = JSON.parse(localStorage.getItem("buyNowArr"));

    // 判断是否有登录了，有登录才向下执行代码
    this._token = localStorage.getItem("_token");
    if (!this._token) {
      this.$dialog
        .confirm({
          title: "温馨提醒",
          message: "你还未登录呐，去登录吧~~",
          confirmButtonColor: "#fa3156",
          cancelButtonText: "先逛逛",
          confirmButtonText: "去登录",
        })
        .then(() => {
          this.$router.push({ name: "Login" });
        })
        .catch(() => {
          this.$toast("那先去逛逛吧~~");
        });

      return;
    }
  },

  computed: {
    // 进行中的订单
    proceedOrders() {
      if (this.allOrders) {
        return this.allOrders.filter((item) => {
          return !item.completed;
        });
      }
    },

    // 已完成的订单
    completedOrders() {
      if (this.allOrders) {
        return this.allOrders.filter((item) => {
          return item.completed;
        });
      }
    },
  },

  methods: {
    // 点击了删除按钮
    delCurItem(clickItem) {
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "你确定要删除么？？",
          confirmButtonColor: "#fa3156",
          cancelButtonText: "再看看",
          confirmButtonText: "删除",
        })
        .then(() => {
          this.allOrders = this.allOrders.filter((item) => {
            return item.itemId != clickItem.itemId;
          });
        })
        .catch(() => {
          // on cancel
        });
    },

    orderCompleted(item) {
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "你确定已经收货了么？？",
          confirmButtonColor: "#fa3156",
          cancelButtonText: "再看看",
          confirmButtonText: "已确定",
        })
        .then(() => {
          item.completed = true;
        })
        .catch(() => {
          // on cancel
        });
    },

    // 返回上一个页面
    goBack() {
      if (this.allOrders) {
        localStorage.setItem("buyNowArr", JSON.stringify(this.allOrders));
      }
      this.$router.push({ name: "Me" });
    },

    goHomeOrLogin() {
      if (this.allOrders) {
        localStorage.setItem("buyNowArr", JSON.stringify(this.allOrders));
      }
      this.$router.push({ name: this._token ? "Home" : "Login" });
    },
  },
};
</script>

<style lang="less" scoped>
.order {
  width: 100vw;
  height: 100vh;
  background-color: #f7f7f7;
  /deep/ .van-nav-bar__title {
    color: #ff5777;
  }
  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__text {
    color: #ff5777;
  }
  .bg {
    height: 100px;
    background-color: #ff5777;
  }
  .order-container {
    padding: 0 10px;
    box-sizing: border-box;
    width: 100%;
    margin-top: -20px;
    .order-box {
      background-color: #f7f7f7;
      width: 100%;
      height: 100%;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      /deep/ .van-tabs__line {
        background-color: #fc3e61;
      }

      .del {
        /deep/ .van-icon {
          top: 4px;
        }
      }
    }
  }

  /deep/ .van-empty {
    padding-top: 10px;
    border-radius: 8px;
    overflow: hidden;
  }
  /deep/ .van-empty__image {
    width: 100%;
    height: auto;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
  }
  /deep/ .van-button--normal {
    border-radius: 6px;
  }
  /deep/ .van-button {
    height: 36px;
  }
  /deep/ .van-button--normal {
    padding: 0 22px;
  }
  /deep/ .van-empty__description {
    color: #555353;
    width: 100%;
    background-color: #fff;
    margin: 0;
    text-align: center;
    font-size: 16px;
    padding-top: 10px;
    margin-top: -10px;
  }
  /deep/ .van-empty__bottom {
    width: 100%;
    text-align: center;
    margin-top: 0;
    padding: 10px 0 20px;
    background-color: #fff;
  }
  .self-desc {
    font-size: 12px;
    color: #6b6969;
    width: 100%;
    margin-bottom: 20px;
  }
  /deep/ .van-button--mini{
    height: 24px;
    border-radius: 12px;
  }
}
</style>