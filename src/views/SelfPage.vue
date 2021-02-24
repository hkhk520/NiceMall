<template>
  <div
    class="self-page"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    v-if="nickName"
  >
    <div class="self-page-header">
      <div class="user-img">
        <img
          :src="!userImg ? require('../assets/images/ulogin.png') : userImg"
        />
        <input type="file" @change="changeUserImg" ref="inputDom" />
      </div>
      <div class="user-nick">
        <span>{{ nickName }}</span>
      </div>
    </div>

    <div class="self-container">
      <div>
        <van-cell-group>
          <van-cell
            title="个人资料"
            is-link
            @click="isShowPersonalData = !isShowPersonalData"
          />
          <van-cell title="地址管理" is-link @click="goAllAddress" />
          <van-cell title="安全中心" is-link @click="goSecure(userPhone)" />
        </van-cell-group>

        <van-popup v-model="isShowPersonalData" :round="true">
          <van-cell-group>
            <van-cell title="头像" center>
              <div class="user-img">
                <img
                  :src="
                    !userImg ? require('../assets/images/ulogin.png') : userImg
                  "
                />
                <input type="file" @change="changeUserImg" ref="inputDom" />
              </div>
            </van-cell>
            <van-cell title="手机号" :value="userPhone" />
            <van-cell title="昵称">
              <van-field
                v-model="nickName"
                placeholder="请输入用户名"
                input-align="right"
              />
            </van-cell>
          </van-cell-group>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelfPage",

  data() {
    return {
      // 保存用户登录的昵称
      nickName: null,
      // 保存用户的手机号
      userPhone: null,
      // 保存用户头像的
      userImg: null,
      // 触摸的起始点
      startX: null,
      startY: null,
      // 触摸移动的X、Y距离
      moveX: null,
      moveY: null,
      // 控制是否显示个人资料弹窗
      isShowPersonalData: false,
    };
  },

  created() {
    // 判断本地存储是否有图片的src路径
    if (localStorage.getItem("userImg")) {
      this.userImg = localStorage.getItem("userImg");
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
    touchstart(event) {
      // 触摸的起始点
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    touchmove(event) {
      // 触摸移动的X、Y距离
      this.moveX = event.touches[0].clientX - this.startX;
      this.moveY = event.touches[0].clientY - this.startY;
    },
    touchend() {
      // Math.abs(X) > Math.abs(Y) && X > 0
      if (Math.abs(this.moveX) > Math.abs(this.moveY) && this.moveX < 0) {
        // 左滑
        this.goBack();
      } else if (
        Math.abs(this.moveX) > Math.abs(this.moveY) &&
        this.moveX > 0
      ) {
        // 右滑
        this.goBack();
      }
    },
    // 左、右滑 返回上一个路由
    goBack() {
      this.$router.go(-1);
      // 修改本地缓存中的用户昵称
      let userArr = JSON.parse(localStorage.getItem("userArr"));
      for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].phone == this.userPhone) {
          userArr[i].nickName = this.nickName;
          localStorage.setItem("userArr", JSON.stringify(userArr));
          return;
        }
      }
    },

    // 监听input改变时
    changeUserImg() {
      const inputDom = this.$refs.inputDom;
      // 获取上传文件的信息
      const file = inputDom.files[0];

      // 判断选择图片是否点击了取消
      if (file == undefined) {
        return;
      }

      // 获取上传的文件名
      const fileName = inputDom.files[0].name;

      // 判断上传文件的格式是否正确
      if (
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".gif")
      ) {
        // 设置上传图片的大小
        if (file.size > 1024 * 1024 * 1) {
          alert("图片大小不能超过 1MB!");
          return false;
        }

        // 第一种方法实现
        // 使用H5的新增对象FileReader()来实现读取文件
        let result = new FileReader();
        result.readAsDataURL(file);
        result.onload = (e) => {
          this.userImg = e.target.result;
          // 把图片的src存到本地存储中去
          localStorage.setItem("userImg", this.userImg);
        };

        // // 第二种方法实现
        // // 获取 window 的 URL
        // const URL = window.URL || window.webkitURL;
        // // 通过 file 生成目标 url
        // this.userImg = URL.createObjectURL(file);
        // // 把图片的src存到本地存储中去
        // localStorage.setItem("userImg", this.userImg);
      } else {
        alert("格式错误！！");
      }
    },

    // 跳转到安全中心
    goSecure(userPhone) {
      this.$router.push({ name: "Secure", query: { userPhone } });
      // 修改本地缓存中的用户昵称
      let userArr = JSON.parse(localStorage.getItem("userArr"));
      for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].phone == this.userPhone) {
          userArr[i].nickName = this.nickName;
          localStorage.setItem("userArr", JSON.stringify(userArr));
          return;
        }
      }
    },

    // 跳转到地址管理
    goAllAddress(){
      this.$router.push({name: 'AllAddress'});
      // 修改本地缓存中的用户昵称
      let userArr = JSON.parse(localStorage.getItem("userArr"));
      for (let i = 0; i < userArr.length; i++) {
        if (userArr[i].phone == this.userPhone) {
          userArr[i].nickName = this.nickName;
          localStorage.setItem("userArr", JSON.stringify(userArr));
          return;
        }
      }
    }
  },
};
</script>

<style lang="less" scoped>
.self-page {
  width: 100%;
  height: 100vh;
  background-color: #f7f7f7;
  .self-page-header {
    width: 100%;
    height: 220px;
    background: url("../assets/images/self_bg.jpg") no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .user-img {
      margin-bottom: 6px;
      position: relative;
      img {
        width: 68px;
        height: 68px;
        border-radius: 50%;
      }

      input[type="file"] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0;
      }
    }
    .user-nick {
      font-size: 18px;
    }
  }

  .self-container {
    width: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    position: relative;
    margin-top: 16px;

    /deep/ .van-cell-group {
      border-radius: 10px;

      /deep/ .van-cell:first-of-type {
        border-radius: 10px 10px 0 0;
      }
      /deep/ .van-cell:last-of-type {
        border-radius: 0 0 10px 10px;
      }
      /deep/ .van-cell {
        padding: 14px 16px;
      }
    }
  }

  /deep/ .van-popup--center {
    width: 92%;

    .user-img {
      position: relative;
      width: 40px;
      height: 40px;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      input[type="file"] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0;
      }
    }

    /deep/ .van-cell:first-of-type {
      padding: 10px 16px;
    }

    /deep/ .van-cell:nth-of-type(3) .van-field {
      padding: 0;

      /deep/ .van-field__control {
        color: #969799;
      }
    }
  }
}
</style>