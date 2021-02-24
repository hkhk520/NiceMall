<template>
  <div class="all-address">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="bg"></div>
    <div class="address-list">
      <div class="bg-content">
        <van-address-list
          :list="list"
          default-tag-text="默认"
          :switchable="false"
          @add="$router.push({ name: 'NewAddress' })"
          @edit="editAddress"
          v-if="list.length != 0"
        />
        <van-empty description="没有地址数据" v-else />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AllAddress",

  data() {
    return {
      //地址列表
      list: [],
    };
  },

  created() {
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
    console.log(this.list);
  },

  methods: {
    // 点击修改地址
    editAddress(item) {
      this.$router.push({ name: "NewAddress", query: { addressInfo: item } });
    },
  },
};
</script>

<style lang="less" scoped>
.all-address {
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
  .bg {
    width: 100%;
    height: 100px;
    background-color: #ff5777;
  }

  .address-list {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    margin-top: -32px;

    .bg-content {
      background-color: #fff;
      width: 100%;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    }

    /deep/ .van-address-item {
      border-bottom: 1px solid #e8e8e8;
      &:last-child {
        border-bottom: none;
      }
    }
    /deep/ .van-address-list {
      padding: 10px 16px;
    }
  }
}
</style>