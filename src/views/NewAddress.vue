<template>
  <div class="new-address">
    <van-nav-bar
      :title="addressId ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />
    <van-address-edit
      show-postal
      show-set-default
      :show-delete="isEditAddr"
      :area-columns-placeholder="['选择省', '选择市', '选择区']"
      :area-list="areaList"
      save-button-text="保存地址"
      :address-info="addressInfo"
      @save="save"
      @delete="removeAddress"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";
import { mapState } from "vuex";

export default {
  name: "NewAddress",

  data() {
    return {
      // 地区列表
      areaList,

      //地址初始值
      addressInfo: {},

      // 保存地址的数组
      addressArr: [],

      // 判断是否点击修改地址进来该页面
      isEditAddr: false,

      // 保存当前编辑地址的id
      editId: null,
    };
  },

  created() {
    if (localStorage.getItem("addressArr")) {
      this.addressArr = JSON.parse(localStorage.getItem("addressArr"));
    }

    // 拦截点击了编辑地址时，传过来的地址对象
    if (this.$route.query.addressInfo) {
      // 是编辑地址进来的
      this.isEditAddr = true;
      // 保存编辑地址的id
      this.editId = this.$route.query.addressInfo.id;
      for (let i = 0; i < this.addressArr.length; i++) {
        // 找到本地缓存中相同id的地址信息对象
        if (this.addressArr[i].id == this.editId) {
          this.addressInfo = this.addressArr[i];
          return;
        }
      }
    }
  },

  computed: {
    // 获取Vuex里面的地址id
    ...mapState(["addressId"]),
  },

  methods: {
    // 点击保存地址按钮时触发
    save(content) {
      // 是编辑地址进来的
      if (this.isEditAddr) {
        for (let i = 0; i < this.addressArr.length; i++) {
          // 找到本地缓存中相同id的地址信息对象
          if (this.addressArr[i].id == this.editId) {
            // 修改本地缓存中对应的id的地址对象
            this.addressArr[i] = content;
            // 更新缓存
            localStorage.setItem("addressArr", JSON.stringify(this.addressArr));
            this.$toast("修改地址成功！");
            this.$router.go(-1);
            return;
          }
        }
      }

      // 给每一个地址添加一个地址id
      content["id"] = this.addressId;
      // 添加到本地缓存中去
      this.addressArr.push(content);
      localStorage.setItem("addressArr", JSON.stringify(this.addressArr));
      this.$store.commit("changeAddressId");
      this.$toast("添加地址成功！");
      this.$router.go(-1);
    },

    // 确认删除地址时触发
    removeAddress(content) {
      for (let i = 0; i < this.addressArr.length; i++) {
        // 找到本地缓存中相同id的地址信息对象
        if (this.addressArr[i].id == content.id) {
          // 删除本地缓存中对应的id的地址对象
          this.addressArr.splice(i,1);
          // 更新缓存
          localStorage.setItem("addressArr", JSON.stringify(this.addressArr));
          this.$toast("删除地址成功！");
          this.$router.go(-1);
          return;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.new-address {
  width: 100vw;
  height: 93vh;
  background-color: #f7f7f7;
  padding-top: 46px;
  /deep/ .van-nav-bar__title {
    color: #ff5777;
  }
  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__text {
    color: #ff5777;
  }
  /deep/ .van-button--danger {
    background-color: #fa2e54;
    border: 1px solid #fa2e54;
  }
  /deep/ .van-switch--on {
    background-color: #fa2e54;
  }
}
</style>