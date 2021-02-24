<template>
  <div class="me">
    <!-- 头部用户信息 -->
    <div class="me-header">
      <div @click="goLogin">
        <div class="user-img">
          <img
            :src="!userImg ? require('../assets/images/ulogin.png') : userImg"
          />
        </div>
        <div class="user-nick">{{ nickName ? nickName : "点击登录" }}</div>
      </div>
    </div>

    <!-- 收藏和订单栏 -->
    <div class="purchase-information-box">
      <!-- 收藏盒子 -->
      <div class="like-box">
        <div class="inline-box" @click="goLike">
          <!-- 收藏数量 -->
          <p>
            <span>{{ likeArr && _token ? likeArr.length : "0" }}</span>
          </p>
          <!-- 数量下面的描述 -->
          <div class="desc-box">
            <van-icon name="star" size="22" color="#f54f6d" />
            <span>我的收藏</span>
          </div>
          <div class="gap"></div>
        </div>
      </div>
      <!-- 订单盒子 -->
      <div class="order-box">
        <div class="inline-box" @click="$router.push({name: 'Order'})">
          <p><span>{{ orderNum && _token ? orderNum : "0" }}</span></p>
          <div class="desc-box">
            <van-icon name="goods-collect" size="22" color="#f54f6d" />
            <span>我的订单</span>
          </div>
        </div>
      </div>
    </div>

    <!-- vip广告 -->
    <div class="vip-ad">
      <img src="../assets/images/vip_ad.png" class="auto-img" />
    </div>

    <!-- 广告下面的功能栏 -->
    <div class="fun-box">
      <van-grid :border="false">
        <van-grid-item
          icon="wap-home"
          text="个人主页"
          class="wap-home"
          @click="goSelfPage"
        />
        <van-grid-item icon="chat" text="联系我们" class="chat" @click="isShowContact = !isShowContact" />
        <van-grid-item icon="service" text="客服" class="service" @click="isShowContact = !isShowContact" />
        <van-grid-item icon="like" text="关注" class="like" @click="isShowContact = !isShowContact" />
      </van-grid>
    </div>

    <!-- 点击联系我们或客服的弹窗 -->
    <van-popup v-model="isShowContact" :round="true">
      <div class="hk-img">
        <div class="title">关注我吧~~</div>
        <img src="../assets/images/me_code.jpg" />
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "Me",

  data() {
    return {
      // 保存本地缓存中的收藏数组数据
      likeArr: null,
      // 保存用户登录的昵称
      nickName: null,
      // 保存用户的手机号
      userPhone: null,
      // 保存用户_token
      _token: null,
      // 保存用户头像的
      userImg: null,
      // 控制是否显示黄恺的二维码
      isShowContact: false,
      // 订单数量
      orderNum: null,
    };
  },

  created() {
    // 获取本地缓存中收藏数据
    if (localStorage.getItem("likeArr")) {
      // 获取本地缓存中的收藏数组
      this.likeArr = JSON.parse(localStorage.getItem("likeArr"));
    }

    // 判断本地存储是否有图片的src路径
    if (localStorage.getItem("userImg")) {
      this.userImg = localStorage.getItem("userImg");
    }

    // 获取登录的_token
    this._token = localStorage.getItem("_token");

    // 获取本地缓存中的订单数据
    if(localStorage.getItem("buyNowArr")){
      this.orderNum = JSON.parse(localStorage.getItem("buyNowArr")).length;
    }

    if (localStorage.getItem("_token")) {
      // 获取本地缓存中的用户信息，找到对应的token，从而来显示用户昵称
      let userArr = JSON.parse(localStorage.getItem("userArr"));
      for (let i = 0; i < userArr.length; i++) {
        let currTokenArr = (userArr[i].phone + userArr[i].password).split("");
        let currToken = currTokenArr
          .map((item) => {
            return item.charCodeAt();
          })
          .join("");

        if (localStorage.getItem("_token") == currToken) {
          this.nickName = userArr[i].nickName;
          this.userPhone = userArr[i].phone;
          return;
        }
      }
    }
  },

  methods: {
    // 点击了收藏盒子，跳转收藏显示页面
    goLike() {
      this.$router.push({ name: "Like" });
    },

    // 点击个人主页的跳转
    goSelfPage() {
      if (!this._token) {
        this.$dialog
          .confirm({
            title: "温馨提醒",
            message: "亲，您还未登录呐~",
            confirmButtonColor: "#fa3c5f",
            confirmButtonText: "去登录",
            cancelButtonText: "先逛逛",
          })
          .then(() => {
            this.$router.push({ name: "Login" });
          })
          .catch(() => {
            this.$toast("先去逛逛吧~~");
          });

        return;
      }
      this.$router.push({ name: "SelfPage" });
    },

    // 跳转登录页面
    goLogin(){
      if(!this._token){
        this.$router.push({ name: 'Login' });
      }
    }
  },
};
</script>

<style lang="less" scoped>
.me {
  .me-header {
    width: 100%;
    height: 180px;
    background: url("../assets/images/me_bg.jpg") no-repeat center top;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .user-img {
      width: 100%;
      margin-bottom: 10px;
      text-align: center;
      img {
        border-radius: 50%;
        width: 68px;
        height: 68px;
        border-radius: 50%;
      }
    }

    .user-nick {
      color: #fff;
      text-align: center;
      font-size: 20px;
    }
  }

  .purchase-information-box {
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    background-color: #fff;

    p {
      span {
        margin-left: 22px;
      }
    }

    .desc-box {
      span {
        font-size: 13px;
        margin-left: 8px;
      }
    }

    .like-box,
    .order-box {
      flex: 1;
      text-align: center;

      .inline-box {
        display: inline-block;
      }
    }

    .like-box {
      position: relative;
      .gap {
        height: 24px;
        width: 0.6px;
        background-color: #666;
        position: absolute;
        right: 0;
        top: 8px;
      }
    }
  }

  .vip-ad {
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .fun-box {
    padding: 8px;
    border-radius: 10px;

    /deep/ .van-grid {
      overflow: hidden;
      border-radius: 10px;

      .wap-home {
        /deep/ .van-icon {
          color: #f57460;
        }
      }
      .chat {
        /deep/ .van-icon {
          color: #5ebbf5;
        }
      }
      .service {
        /deep/ .van-icon {
          color: #f1a541;
        }
      }
      .like {
        /deep/ .van-icon {
          color: #ff6788;
        }
      }

      /deep/ .van-grid-item__text {
        color: #333;
        margin-top: 4px;
      }
      /deep/ .van-grid-item__content {
        padding: 10px 6px;
      }
    }
  }

  .hk-img{
    .title{
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #ff6788;
      padding: 10px 0;
    }
    img{
      width: 280px;
      height: auto;
    }
  }
}
</style>