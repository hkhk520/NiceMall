<template>
  <div class="cart-item">
    <div class="check-box">
      <van-checkbox
        v-model="checked"
        checked-color="#fa4466"
        @click.stop="$emit('change-isAll')"
      />
    </div>
    <div class="pro-info-box">
      <van-card
        :price="itemData.price | fixPrice"
        :desc="desc"
        :title="itemData.title"
        :thumb="itemData.selectImg"
      >
        <template #footer>
          <van-stepper v-model="itemData.selectShopCount" theme="round" button-size="20" disable-input />
        </template>
      </van-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartItem",

  props: ["itemData", "allChecked", "isClickAll"],

  data() {
    return {
      // 控制复选框的状态
      checked: false,
    };
  },

  watch: {
    // 监听全选复选框的值的变化
    allChecked(newValue) {
      // 由于代码的执行顺序是先监听到allChecked的变化，再修改isClickAll的值，顺序反了，所以使用延时器，先让isClickAll改变，再监听allChecked的变化
      setTimeout(() => {
        // 判断是否点击了全选复选框来改变值的
        if (this.isClickAll) {
          this.checked = newValue;
        }
      }, 0);
    },

    // 监听数量的变化
    "itemData.selectShopCount"(){
      // 获取本地缓存
      let selectedRulesArr = JSON.parse(localStorage.getItem("selectedRulesArr"));
      // 遍历
      for(let i=0; i<selectedRulesArr.length; i++){
        // 找到当前修改数量的那一项
        if(selectedRulesArr[i].itemId == this.itemData.itemId){
          // 赋值当前的数量
          selectedRulesArr[i].selectShopCount = this.itemData.selectShopCount;
          // 重新修改本地缓存中的值
          localStorage.setItem("selectedRulesArr",JSON.stringify(selectedRulesArr));
          return;
        }
      }
    }
  },

  computed: {
    desc() {
      return this.itemData.selectColor + "; " + this.itemData.selectSize;
    },
  },

  filters: {
    fixPrice(oldValue) {
      return Number(oldValue).toFixed(2);
    },
  },
};
</script>

<style lang="less" scoped>
.cart-item {
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  overflow: hidden;

  .check-box {
    padding: 0 10px;
    box-sizing: border-box;
  }

  .pro-info-box {
    width: 88%;

    /deep/ .van-card {
      background-color: #fff;
      padding: 8px 0;
    }

    /deep/ .van-card__thumb {
      width: 70px;
      border-radius: 6px;
      img {
        border-radius: 6px;
      }
    }
    /deep/ .van-image {
      border-radius: 6px;
    }
    /deep/ .van-multi-ellipsis--l2 {
      color: #000;
    }
    /deep/ .van-card__desc {
      color: #ababab;
      transform: scale(0.9);
      margin: 4px 0 0 -10px;
    }
    /deep/ .van-card__price {
      color: #f71b43;
    }
    /deep/ .van-card {
      padding: 8px 8px 8px 0;
    }
    /deep/ .van-card__title {
      font-size: 14px;
    }
  }

  /deep/ .van-card__footer{
    position: absolute;
    bottom: 8px;
    right: 10px;

    /deep/ .van-stepper--round .van-stepper__plus{
      background-color: #f8234a;
    }
  }
}
</style>