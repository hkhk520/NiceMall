<template>
  <li class="order-item">
    <!-- 订单信息盒子 -->
    <div class="order-box">
      <div class="title">
        <div><slot name="left"></slot></div>
        <div class="last"><slot name="right"></slot></div>
      </div>
      <!-- 商品信息 -->
      <van-card
        :num="curOrderData.selectShopCount"
        :price="curOrderData.price"
        :desc="desc"
        :title="curOrderData.title"
        :thumb="curOrderData.selectImg"
      />
      <!-- 分割线 -->
      <div class="circle">
        <span class="circle-left"></span>
        <van-divider
          dashed
          :style="{ color: '#b1afaf', borderColor: '#b1afaf' }"
        />
        <span class="circle-right"></span>
      </div>
      <div class="order-time">{{ curOrderData.orderTime }}</div>
      <div class="total-box">
        <div class="total-num">共计 {{ curOrderData.selectShopCount }} 件</div>
        <div class="total-price">合计 ￥{{ totalPrice }}</div>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "OrderItem",

  props: ["curOrderData"],

  computed: {
    // 商品的描述信息
    desc() {
      return (
        this.curOrderData.selectColor + "; " + this.curOrderData.selectSize
      );
    },

    // 计算总价的计算属性
    totalPrice() {
      return (this.curOrderData.price * this.curOrderData.selectShopCount).toFixed(2);
    },
  },
  
};
</script>

<style lang="less" scoped>
.order-item {
  font-size: 14px;
  color: #64657f;
  .order-box {
    background-color: #fff;
    border-radius: 8px 8px 0 0;
    padding: 10px;
    margin-top: 10px;

    /deep/ .van-card {
      background-color: #fff;
      padding: 6px 0;
    }
    /deep/ .van-card__price {
      color: #fa4163;
    }
    /deep/ .van-card__title {
      font-size: 13px;
      margin-bottom: 2px;
    }

    .circle {
      width: 100%;
      height: 20px;
      position: relative;
      .circle-left,
      .circle-right {
        position: absolute;
        top: -10px;
        width: 20px;
        height: 20px;
        background-color: #f7f7f7;
        border-radius: 50%;
      }
      .circle-left {
        left: -20px;
      }
      .circle-right {
        right: -20px;
      }
    }

    .order-time {
      font-size: 12px;
    }
    .total-box {
      display: flex;
      justify-content: space-between;
      padding: 8px 0 0;
      .total-price {
        color: #fa3e61;
        font-weight: bold;
      }
    }
    .title {
      display: flex;
      justify-content: space-between;
      .last {
        color: #333;
      }
    }
  }
}
</style>