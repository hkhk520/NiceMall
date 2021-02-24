<template>
  <div class="like">
    <!-- 头部导航栏 -->
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      :right-text="del ? '完成' : '编辑'"
      left-arrow
      @click-left="goBack"
      @click-right="del = !del"
    />

    <!-- 当购物车没有东西先展示的空状态 -->
    <van-empty
      :image="require('../assets/images/empty_like.jpg')"
      :description="
        _token ? '你还没有收藏任何商品~~' : '你还未登录呐，去登录吧~~'
      "
      v-if="likeArr == null ? !likeArr : likeArr.length == 0"
    >
      <van-button
        color="#ff5777"
        @click="
          _token
            ? $router.push({ name: 'Classify' })
            : $router.push({ name: 'Login' })
        "
        >{{ _token ? "逛一逛" : "去登录" }}</van-button
      >
    </van-empty>

    <!-- 购物车的每一条数据 -->
    <div class="like-item-box" v-else>
      <LikeItem
        :likeArr="likeArr"
        :del="del"
        @change-is-del="changeIsDel"
      ></LikeItem>
    </div>

    <!-- 底部的删除按钮 -->
    <div class="del-btn-box" v-show="del">
      <van-button
        block
        :color="delCount != 0 ? '#f31d44' : '#fff'"
        @click="dealDel"
      >
        <div class="del-btn">
          <van-icon
            name="delete-o"
            size="26"
            :color="delCount == 0 ? '#000' : ''"
          />
          <span :style="{ color: delCount == 0 ? '#000' : '' }"
            >删除 ({{ delCount }})</span
          >
        </div>
      </van-button>
    </div>
  </div>
</template>

<script>
import LikeItem from "../components/LikeItem.vue";
export default {
  name: "Like",

  data() {
    return {
      // 保存路由的查询参数的收藏数组数据
      likeArr: null,
      // 控制是否显示删除的按钮
      del: false,
      // 保存打勾要删除的商品的数量
      delCount: 0,
      // 保存用户登录的_token
      _token: null,
    };
  },

  created() {
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

    if (localStorage.getItem("likeArr")) {
      // 获取本地缓存中的收藏数组
      this.likeArr = JSON.parse(localStorage.getItem("likeArr"));
    }
  },

  watch: {
    del(newValue) {
      if (!this._token) {
        return;
      }
      // 当点击了完成时
      if (!newValue) {
        // 把数组中的全部isDel改为false
        this.likeArr.forEach((item) => {
          item.isDel = false;
        });
        // 打勾要删除的商品的数量置零
        this.delCount = 0;
      }
    },
  },

  components: {
    LikeItem,
  },

  methods: {
    // 返回我的页面
    goBack() {
      this.$router.go(-1);
    },

    // 点击商品改变该商品的isDel
    changeIsDel(clickItem) {
      for (let i = 0; i < this.likeArr.length; i++) {
        // 判断当前点击的商品，是，则把isDel取反
        if (this.likeArr[i].iid == clickItem.iid) {
          this.likeArr[i].isDel = !this.likeArr[i].isDel;

          // 计数标记删除的数量
          if (this.likeArr[i].isDel) {
            this.delCount++;
          } else {
            this.delCount--;
          }

          return;
        }
      }
    },

    // 点击底部的删除按钮，处理勾选的删除商品
    dealDel() {
      // 没有登录时
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

      // 登录了，但没有勾选商品
      if (!this.delCount) {
        this.$toast("还没有收藏商品呐哦~~");
      } else {
        this.$dialog
          .confirm({
            title: "温馨提醒",
            message: "你忍心删除喜欢的商品么！！",
            confirmButtonColor: "#fa3156",
            cancelButtonText: "不忍心",
          })
          .then(() => {
            // 遍历收藏的数组
            for (let i = 0; i < this.likeArr.length; i++) {
              // 把数组里面的勾选的商品从数组中删除
              if (this.likeArr[i].isDel) {
                this.likeArr.splice(i, 1);
                // 并把打勾要删除的商品的数量减一
                this.delCount--;
              }
            }

            // 重新更新缓存中收藏的数组数据
            localStorage.setItem("likeArr", JSON.stringify(this.likeArr));

            this.$toast("删除成功啦~");

            // 如果收藏商品都删完了，不显示删除按钮
            if (!this.likeArr.length) {
              this.del = false;
              this.$toast("收藏列表空空汝耶，再去逛逛吧~");
            }
          })
          .catch(() => {
            this.$toast("就知道你不忍心啦~~");
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.like {
  background-color: #fff;
  /deep/ .van-nav-bar__title {
    color: #ff5777;
  }
  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__text {
    color: #ff5777;
  }
  /deep/ .van-empty__image {
    width: 100%;
    height: auto;
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

  .like-item-box {
    background-color: #efeeed;
    padding: 10px 0;
  }

  .del-btn-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    text-align: center;
    box-shadow: 0 0 2px 1px #ccc;

    .del-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /deep/ .van-button {
      height: 50px;
    }
  }
}
</style>