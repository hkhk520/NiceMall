<template>
  <div class="login">
    <!-- 登录头部盒子 -->
    <div class="login-header">
      <van-nav-bar
        title="登录"
        right-text="逛一逛"
        left-arrow
        :border="false"
        @click-left="goBackOrHome"
        @click-right="$router.push({ name: 'Home' })"
      />
      <!-- logo图片 -->
      <img src="../assets/images/logo.jpg" />
      <div class="logo-title">Nice Mall</div>
      <div class="logo-desc">购 物 天 堂</div>
    </div>

    <!-- 登录手机号和密码盒子 -->
    <div class="login-info-box">
      <van-form>
        <van-field v-model="userInfo.phone" placeholder="请输入手机号" />
        <van-field
          v-model="userInfo.password"
          :type="isPwd ? 'password' : 'text'"
          placeholder="请输入密码"
          :right-icon="isPwd ? 'closed-eye' : 'eye-o'"
          @click-right-icon="isPwd = !isPwd"
        />
        <div style="margin: 24px 0 0">
          <van-button round block color="#ff5777" @click="login"
            >登录</van-button
          >
          <van-button
            round
            block
            color="#fd8299"
            @click="isShowRegister = !isShowRegister"
            >注册</van-button
          >
        </div>
      </van-form>
    </div>

    <!-- 注册弹窗 -->
    <van-popup
      v-model="isShowRegister"
      position="bottom"
      class="register-box"
      closeable
    >
      <div class="register-title">注册</div>
      <van-form>
        <van-field
          v-model="userRegisterInfo.phone"
          name="手机号"
          label="手机号"
          placeholder="11位手机号"
        />
        <van-field
          v-model="userRegisterInfo.password"
          :type="isPwd ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="密码必须为字母开头"
          :right-icon="isPwd ? 'closed-eye' : 'eye-o'"
          @click-right-icon="isPwd = !isPwd"
        />
        <van-field
          v-model="userRegisterInfo.nickName"
          name="昵称"
          label="昵称"
          placeholder="昵称"
        />
        <div class="commit-btn">
          <van-button
            round
            block
            color="#ff5777"
            class="register-button"
            @click="register"
          >
            注册
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
// 导入表单验证的js文件
import { validForm } from "../assets/js/validForm.js";
export default {
  name: "Login",

  data() {
    return {
      // 控制显示密码还是展示密码
      isPwd: true,
      // 用户登录信息
      userInfo: {
        phone: "",
        password: "",
      },
      // 用户注册信息
      userRegisterInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      // 控制是否显示弹出框
      isShowRegister: false,
      // 保存用户的数组
      userArr: [],

      // 保存用户登录的token
      _token: null,
    };
  },

  created() {
    if (localStorage.getItem("userArr")) {
      this.userArr = JSON.parse(localStorage.getItem("userArr"));
    }
    
    this._token = localStorage.getItem("_token");
  },

  methods: {
    // 点击注册的方法
    register() {
      // 构造表单验证信息
      let o = {
        phone: {
          value: this.userRegisterInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userRegisterInfo.password,
          errorMsg: "密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        nickName: {
          value: this.userRegisterInfo.nickName,
          errorMsg: "昵称由字母数字下划线汉字组合(1-10字符)",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
      };

      // validForm.valid(o)的返回值是true或false
      let isPass = validForm.valid(o);

      if (isPass) {
        // true 发起注册请求

        // 结构赋值对象this.userRegisterInfo到userInfo，并解除指针地址的问题
        const userInfo = { ...this.userRegisterInfo };
        /* 
        // 也可以使用ES6的方法
        const userInfo = Object.assign({},this.userRegisterInfo);
        userInfo.appkey = this.appkey;
        */

        // 启动加载提示
        this.$toast.loading({
          // 提示文本内容
          message: "注册中...",
          // 禁止穿透点击
          forbidClick: true,
          // 展示时长，0表示不限制，不关闭
          duration: 0,
        });

        for (let i = 0; i < this.userArr.length; i++) {
          // 如果本地缓存有用户信息，需要检查是否信息已经被注册了
          if (this.userArr[i].phone == userInfo.phone) {
            this.$toast("该手机号已经被注册过啦~~");
            return;
          } else if (this.userArr[i].nickName == userInfo.nickName) {
            this.$toast("该昵称已经被使用啦~~");
            return;
          }
        }

        setTimeout(() => {
          this.userArr.push(userInfo);
          // 把用户注册信息保存到本地缓存中去
          localStorage.setItem("userArr", JSON.stringify(this.userArr));
          // 关闭注册弹窗
          this.isShowRegister = false;
          this.$toast("注册成功");
        }, 1000);
      }
    },

    // 登录的方法
    login() {
      // 构造表单验证信息
      let o = {
        phone: {
          value: this.userInfo.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.userInfo.password,
          errorMsg: "密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      // validForm.valid(o)的返回值是true或false  登录信息格式的校验
      let isPass = validForm.valid(o);

      if (isPass) {
        // true就发起登录请求

        let userInfo = { ...this.userInfo };
        // 启动加载提示
        this.$toast.loading({
          // 提示文本内容
          message: "登录中...",
          // 禁止穿透点击
          forbidClick: true,
          // 展示时长，0表示不限制，不关闭
          duration: 0,
        });

        setTimeout(() => {
          for (let i = 0; i < this.userArr.length; i++) {
            if (
              this.userArr[i].phone == userInfo.phone &&
              this.userArr[i].password == userInfo.password
            ) {
              // 对手机号和密码进行加密，生成token
              let _tokenArr = (userInfo.phone + userInfo.password).split("");
              let _token = _tokenArr
                .map((item) => {
                  return item.charCodeAt();
                })
                .join("");
              // 把token存到本地缓存中去
              localStorage.setItem("_token", _token);
              // 返回me页面
              this.$router.go(-1);
              this.$toast("登录成功啦~~");
              return;
            } else if (this.userArr[i].phone == userInfo.phone) {
              if (this.userArr[i].password != userInfo.password) {
                this.$toast("手机号或者密码不正确！！");
                return;
              }
            }
          }

          this.$toast("亲，您还未注册呐，赶快去注册吧~~");
        }, 800);
      }
    },

    // 头部导航栏的左箭头的返回的方法
    goBackOrHome(){
      if(this._token){
        this.$router.go(-1);
      }else{
        this.$router.push({name: "Home"});
      }
    }
  },
};
</script>

<style lang="less" scoped>
.login {
  background-color: #f5f5f5;
  height: 100vh;
  .login-header {
    /deep/ .van-nav-bar__title {
      color: #ff5777;
    }
    /deep/ .van-nav-bar .van-icon {
      color: #ff5777;
    }
    /deep/ .van-nav-bar__text {
      color: #ff5777;
    }
    /deep/ .van-nav-bar {
      background-color: #f5f5f5;
    }

    text-align: center;

    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin-top: 10px;
    }

    .logo-title {
      font-weight: bold;
      font-size: 18px;
      color: #000;
    }
    .logo-desc {
      font-size: 12px;
      transform: scale(0.8);
      margin-top: -2px;
    }
  }

  .login-info-box {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;

    /deep/ .van-form {
      border-radius: 6px;
      overflow: hidden;
    }
    /deep/ .van-cell:nth-of-type(2) {
      border-radius: 0 0 6px 6px;
    }
    /deep/ .van-cell {
      padding: 16px;
    }

    /deep/ .van-button--block {
      height: 42px;
    }
    /deep/ .van-button--block {
      margin-bottom: 50px;
    }
  }

  .register-box {
    padding: 15px 0 0;
    .register-title {
      font-size: 24px;
      color: #646566;
      font-weight: bold;
      padding: 0 15px;
    }
    .van-form {
      margin-top: 15px;
    }
  }

  .register-button {
    margin-top: 12px;
  }
}
</style>