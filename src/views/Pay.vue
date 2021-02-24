<template>
  <div class="pay" v-if="curOrderData">
    <!-- 头部导航栏 -->
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <div class="pay-box">
      <!-- 选择地址栏 -->
      <div class="select-address">
        <div>
          <span @click="showSelectAddr = !showSelectAddr">
            <div>
              <span class="address-span">选择地址</span>
              <van-icon class="arrow" name="arrow" />
            </div>
            <!-- 显示当前的地址信息的盒子 -->
            <div class="user-box" v-if="currentAddress">
              <div class="user-info">
                <div class="user-name">{{ currentAddress.name }}</div>
                <div class="user-phone">{{ currentAddress.tel }}</div>
                <div class="default-address" v-if="currentAddress.isDefault">
                  默认
                </div>
              </div>
              <div class="detail-address">{{ currentAddress.address }}</div>
            </div>
          </span>
          <van-popup v-model="showSelectAddr" position="bottom" closeable>
            <div class="select-title">选择地址</div>
            <van-address-list
              v-model="currentId"
              :list="list"
              default-tag-text="默认"
              @add="$router.push({ name: 'NewAddress' })"
              @select="selectAddress"
              @edit="editAddress"
            />
          </van-popup>
        </div>
      </div>

      <!-- 订单信息盒子 -->
      <OrderItem :curOrderData="curOrderData"
        ><span slot="left">订单信息</span></OrderItem
      >
    </div>

    <div class="btn-box">
      <van-button type="primary" block round color="#fa2e54" @click="payBox"
        >立即结算</van-button
      >
    </div>
  </div>
</template>

<script>
import OrderItem from "../components/OrderItem.vue";
export default {
  name: "Pay",

  components: {
    OrderItem,
  },

  data() {
    return {
      // 记录当前的订单id
      curItemId: null,
      // 当前订单的信息数据信息
      curOrderData: null,
      // 控制是否展示选择地址的弹窗
      showSelectAddr: false,
      //地址列表
      list: [],
      // 当前显示的地址信息数组
      currentAddress: null,
      // 当前选中的地址id
      currentId: -1,
    };
  },

  created() {
    // 拦截当前路由的查询参数
    this.curItemId = this.$route.query.curItemId;

    // 获取本地缓存中的地址数组，并存到list里面去
    if (localStorage.getItem("addressArr")) {
      // 获取本地缓存中的地址列表
      let addressArr = JSON.parse(localStorage.getItem("addressArr"));
      addressArr.forEach((item) => {
        this.list.push({
          id: item.id,
          name: item.name,
          tel: item.tel,
          address: item.city + item.province + item.county + item.addressDetail,
          postalCode: item.postalCode,
          isDefault: item.isDefault,
        });
      });
    }

    // 根据商品id来获取本地缓存中的当前的订单信息
    if (localStorage.getItem("buyNowArr")) {
      let localBuyArr = JSON.parse(localStorage.getItem("buyNowArr"));
      for (let i = 0; i < localBuyArr.length; i++) {
        if (localBuyArr[i].itemId == this.curItemId) {
          this.curOrderData = localBuyArr[i];
          return;
        }
      }
    }
  },

  methods: {
    // 切换选中的地址时触发
    //选择地址
    selectAddress(item, index) {
      this.currentAddress = item;
      this.currentId = item.id;
      this.showSelectAddr = false;
    },

    // 点击修改地址
    editAddress(item) {
      this.$router.push({ name: "NewAddress", query: { addressInfo: item } });
    },

    //结算提示
    payBox() {
      // 当没有选择地址时，不能提交订单
      if (!this.currentAddress) {
        this.$toast("请先选择地址呐~~");
        return;
      }

      this.$dialog
        .confirm({
          title: "确认订单",
          message: "是否立即结算?",
          confirmButtonColor: "#fa3156",
        })
        .then(() => {
          // 启动加载提示
          this.$toast.loading({
            // 提示文本内容
            message: "提交订单中...",
            // 禁止穿透点击
            forbidClick: true,
            // 展示时长，0表示不限制，不关闭
            duration: 0,
          });

          setTimeout(() => {
            //提交订单，跳转到订单页面
            this.$router.push({ name: "Order" });
            this.$toast("结算成功啦~~");
          }, 800);
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.pay {
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
  /deep/ .van-button--round {
    background-color: #fa3156;
    border: 1px solid #fa3156;
  }

  .pay-box {
    padding: 10px;
    font-size: 14px;
    color: #64657f;

    .select-address {
      > div {
        background-color: #fff;
        border-radius: 8px;
        padding: 10px;
      }

      .select-title {
        padding: 18px 20px 8px;
        font-size: 16px;
      }

      .user-box {
        margin-top: 20px;

        .user-info {
          display: flex;
          line-height: 19px;
        }
        .user-name {
          color: #ff5777;
          margin-right: 20px;
          font-weight: bold;
        }

        .detail-address {
          margin-top: 10px;
          color: #999;
        }
        .default-address {
          font-size: 12px;
          background-color: #ff5777;
          color: #fff;
          width: 40px;
          text-align: center;
          height: 20px;
          line-height: 21px;
          border-radius: 10px;
          margin-left: 20px;
        }
      }
    }
  }

  .btn-box {
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 10px;
    width: calc(~"100% - 20px");
  }
}
</style>