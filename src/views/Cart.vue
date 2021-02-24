<template>
  <div class="cart">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar
        title="购物车"
        left-text="返回"
        left-arrow
        @click-left="$router.go(-1)"
        :right-text="isSubmit ? '编辑' : '完成'"
        @click-right="isSubmit = !isSubmit"
      />
    </van-sticky>

    <!-- 当购物车没有东西先展示的空状态 -->
    <van-empty
      :image="require('../assets/images/empty.jpg')"
      :description="_token ? '购物车还是空空滴哦~~' : '你还没有登录哦~~'"
      v-if="
        !_token
          ? true
          : !cartListDatas
          ? !cartListDatas
          : cartListDatas.length == 0
      "
    >
      <van-button color="#ff5777" @click="goHomeOrLogin">{{
        _token ? "逛一逛" : "去登录"
      }}</van-button>
    </van-empty>

    <!-- 购物车的每一条数据 -->
    <ul class="cart-box" v-else>
      <CartItem
        v-for="item in cartListDatas"
        :key="item.itemId"
        :itemData="item"
        :allChecked="allChecked"
        @change-isAll="changeAllChecked"
        ref="cartItem"
        :isClickAll="isClickAll"
      ></CartItem>
    </ul>

    <!-- 底部的提交订单或者删除选择的 -->
    <div class="submit-bar-box" v-if="isSubmit">
      <van-submit-bar
        :price="totalPrice"
        button-text="提交订单"
        @submit="submitOrder"
      >
        <van-checkbox
          v-model="allChecked"
          checked-color="#f7133d"
          @click.stop="isClickAll = true"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
    <div class="delSelect" v-else>
      <van-submit-bar button-text="删除选择" @submit="delChecked">
        <van-checkbox
          v-model="allChecked"
          checked-color="#f7133d"
          @click.stop="isClickAll = true"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
import CartItem from "../components/CartItem.vue";
import { mapState } from "vuex";
export default {
  name: "Cart",

  data() {
    return {
      // 保存购物车的数据
      cartListDatas: null,
      // 控制全选的复选框
      allChecked: false,
      // 控制显示提交订单还是删除选择
      isSubmit: true,
      // 判断是否点击了全选的复选框
      isClickAll: true,
      // 保存购物车列表的item数组
      cartItemArr: null,
      // 保存用户登录的_token
      _token: null,
    };
  },

  created() {
    // 获取本地缓存中的_token
    this._token = localStorage.getItem("_token");

    // 调用获取本地缓存中购物车的数据的方法
    this.getCartDatas();

    // 打印的是空对象，但对象展开里面有属性
    // console.log(this.$refs);
    // 这是vue中dom生成有时间差的，当出现此类情况，也就是打印出来的对象为空但是展开里面是不为空的
    // 使用 nextTick,这样就能获取到里面的元素了.
    this.$nextTick(() => {
      // console.log(this.$refs.cartItem);
      this.cartItemArr = this.$refs.cartItem;
    });
  },

  computed: {
    ...mapState(["buyItemId"]),

    // 计算总价的计算属性
    totalPrice() {
      let total = 0;

      // 当有cartItemArr才进行计算总和
      if (this.cartItemArr) {
        this.cartItemArr.forEach((item) => {
          // 当购物车列表的复选框选中时才算入总和里面去
          if (item.checked) {
            // 单价乘以数量，换算成分单位
            total += item.itemData.price * item.itemData.selectShopCount * 100;
          }
        });
      }

      return total;
    },
  },

  components: {
    CartItem,
  },

  methods: {
    // 跳到Home页面
    goHomeOrLogin() {
      this._token
        ? this.$router.push({ name: "Home" })
        : this.$router.push({ name: "Login" });
    },

    // 获取本地缓存中的购物车数据的方法
    getCartDatas() {
      this.cartListDatas = JSON.parse(localStorage.getItem("selectedRulesArr"));
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
      }
    },

    // 修改全选的复选框
    changeAllChecked() {
      // 不是点击全选复选框
      this.isClickAll = false;
      // 遍历每一个购物车的item
      for (let i = 0; i < this.$refs.cartItem.length; i++) {
        // 只要有一个是false，全选就为false
        if (!this.$refs.cartItem[i].checked) {
          this.allChecked = false;
          return;
        } else {
          this.allChecked = true;
        }
      }
    },

    // 点击了提交订单的按钮的方法
    submitOrder() {
      // 当点击了提交订单按钮，本地缓存没有_token，即为null时
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
      if (!this.cartListDatas) {
        this.$toast("购物车空空汝耶，去逛逛吧~~");
        return;
      }
      // 当购物车没内容时
      if (this.cartListDatas.length == 0) {
        this.allChecked = false;
        this.$toast("购物车空空汝耶，去逛逛吧~~");
        return;
      }

      for (let i = 0; i < this.cartItemArr.length; i++) {
        // 判断是否有勾选的的商品
        if (this.cartItemArr[i].checked) {
          // 只要有一个勾选了，就弹窗提交订单中
          // 启动加载提示
          this.$toast.loading({
            // 提示文本内容
            message: "提交订单中...",
            // 禁止穿透点击
            forbidClick: true,
            // 展示时长，0表示不限制，不关闭
            duration: 0,
          });

          // 在提交订单前判断是否只有一条数据
          if (this.cartListDatas.length == 1) {
            // 只有一条数据，取消全选按钮
            this.allChecked = false;
          }

          // 提交勾选的商品 cartItemArr是个vue对象数组
          this.cartItemArr.forEach((item) => {
            if (item.checked) {
              let storageArr = JSON.parse(
                localStorage.getItem("selectedRulesArr")
              );
              for (let i = 0; i < storageArr.length; i++) {
                // 找到购物车中对应打勾的商品对象信息
                if (item.itemData.itemId == storageArr[i].itemId) {
                  // 把对象解构成订单的对象数据类型
                  let rulesObj = {
                    ...storageArr[i],
                    itemId: this.buyItemId,
                    orderTime: this.parseDate(),
                    completed: false,
                  };

                  // 让Vuex的buyItemId自增
                  this.$store.commit("changeBuyItemId");

                  // 如果本地缓存中有订单数组
                  if (localStorage.getItem("buyNowArr")) {
                    let buyNowArr = JSON.parse(
                      localStorage.getItem("buyNowArr")
                    );
                    // 添加到数组中去
                    buyNowArr.push(rulesObj);
                    // 更新本地缓存中去订单数组
                    localStorage.setItem(
                      "buyNowArr",
                      JSON.stringify(buyNowArr)
                    );
                  } else {
                    let buyNowArr = [];
                    // 添加到数组中去
                    buyNowArr.push(rulesObj);
                    // 保存到本地缓存中去
                    localStorage.setItem(
                      "buyNowArr",
                      JSON.stringify(buyNowArr)
                    );
                  }

                  // 删除已选择的item
                  storageArr.splice(i, 1);
                  // 重新渲染购物车列表
                  this.cartListDatas = storageArr;
                  // 重新修改本地缓存中的值
                  localStorage.setItem(
                    "selectedRulesArr",
                    JSON.stringify(storageArr)
                  );

                  setTimeout(() => {
                    // this.$router.push({ name: "Order" });
                    this.$router.push({
                      name: "Pay",
                      query: { curItemId: rulesObj.itemId },
                    });
                    this.$toast("提交订单成功啦~");
                  }, 800);
                }
              }
            }
          });
          return;
        } else {
          this.$toast("请先勾选要提交订单的商品哦~~");
        }
      }
    },

    // 小于10，补零
    fullZero(num) {
      return num < 10 ? "0" + num : num;
    },

    // 格式化时间
    parseDate() {
      let time = new Date();
      let year = time.getFullYear();
      let month = this.fullZero(time.getMonth() + 1);
      let date = this.fullZero(time.getDate());
      let hour = this.fullZero(time.getHours());
      let minute = this.fullZero(time.getMinutes());
      let second = this.fullZero(time.getSeconds());
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    },

    // 点击了删除选择的按钮的方法
    delChecked() {
      // 当点击了删除选择按钮，本地缓存没有_token，即为null时
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
      if (!this.cartListDatas) {
        this.$toast("购物车空空汝耶，去逛逛吧~~");
        return;
      }

      // 当购物车没内容时
      if (this.cartListDatas.length == 0) {
        this.allChecked = false;
        this.$toast("购物车空空汝耶，去逛逛吧~~");
        return;
      }

      for (let i = 0; i < this.cartItemArr.length; i++) {
        // 判断是否有勾选的的商品
        if (this.cartItemArr[i].checked) {
          // 只要有一个勾选了，就弹窗是否确定删除
          this.$dialog
            .confirm({
              title: "温馨提醒",
              message: "你忍心删除人家么~~",
              confirmButtonColor: "#fa3156",
              cancelButtonText: "不忍心",
              confirmButtonText: "确定",
            })
            .then(() => {
              // 在删除前判断是否只有一条数据
              if (this.cartListDatas.length == 1) {
                // 只有一条数据，取消全选按钮
                this.allChecked = false;
              }

              // 删除勾选的商品
              this.cartItemArr.forEach((item) => {
                if (item.checked) {
                  let storageArr = JSON.parse(
                    localStorage.getItem("selectedRulesArr")
                  );
                  for (let i = 0; i < storageArr.length; i++) {
                    if (item.itemData.itemId == storageArr[i].itemId) {
                      // 删除已选择的item
                      storageArr.splice(i, 1);
                      // 重新渲染购物车列表
                      this.cartListDatas = storageArr;
                      // 重新修改本地缓存中的值
                      localStorage.setItem(
                        "selectedRulesArr",
                        JSON.stringify(storageArr)
                      );
                      // console.log(JSON.parse(localStorage.getItem("selectedRulesArr")));
                      this.$toast("删除成功啦~");

                      return;
                    }
                  }
                }
              });
            })
            .catch(() => {
              // 点击了取消按钮
              this.$toast("就知道你舍不得人家啦~~");
            });

          return;
        } else {
          this.$toast("请先勾选要删除的商品哦~~");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 100vw;
  background-color: #fff;
  padding-bottom: 100px;

  /deep/ .van-nav-bar__title {
    color: #ff5777;
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
  /deep/ .van-empty__image {
    width: 100%;
    height: auto;
  }
  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__text {
    color: #ff5777;
  }

  .cart-box {
    width: 100vw;
    height: 90%;
    background-color: #f0f0f0;
    padding: 12px 10px 2px;
    box-sizing: border-box;
  }

  .submit-bar-box {
    /deep/ .van-submit-bar {
      bottom: 50px;
    }
    /deep/ .van-checkbox__icon--checked .van-icon {
      background-color: #fa4466;
      border-color: #fa4466;
    }
    /deep/ .van-submit-bar__price {
      color: #f71b43;
    }
    /deep/ .van-submit-bar__button--danger {
      background: linear-gradient(to right, #f54f6d, #f7133d);
    }
  }
  .delSelect {
    /deep/ .van-checkbox {
      margin-right: auto;
    }
    /deep/ .van-submit-bar {
      bottom: 50px;
    }
    /deep/ .van-submit-bar__button--danger {
      background: linear-gradient(to right, rgb(241, 78, 78), red);
    }
  }
}
</style>