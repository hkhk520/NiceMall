<template>
  <div class="secure">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <div class="bg"></div>
    <div class="fun-box">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="isShowChangePwd = true" />
        <van-cell title="切换账号" is-link @click="toggleUserLogin" />
        <van-cell title="注销账号" is-link @click="destroyAccount" />
      </van-cell-group>
    </div>

    <div class="ulogin-btn">
      <van-button color="#fa3c5f" block round @click="logout"
        >退出登录</van-button
      >
    </div>

    <!-- 修改密码弹窗 -->
    <van-popup is-link position="bottom" closeable v-model="isShowChangePwd">
      <div class="form-box">
        <div class="form-title">修改密码</div>
        <van-form>
          <van-field
            v-model="password.oldPassword"
            :type="isPassword ? 'password' : 'text'"
            name="旧密码"
            label="旧密码"
            placeholder="旧密码(首字符必须为字母)"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="isPassword = !isPassword"
          />

          <van-field
            v-model="password.newPassword"
            :type="isPassword ? 'password' : 'text'"
            name="新密码"
            label="新密码"
            placeholder="新密码(首字符必须为字母)"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            autocomplete="off"
            @click-right-icon="isPassword = !isPassword"
          />

          <div class="commit-btn">
            <van-button round block color="#fa3c5f" @click="commit"
              >提交</van-button
            >
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
//导入表单验证模块
import { validForm } from "../assets/js/validForm";
export default {
  name: "Secure",

  data() {
    return {
      // 控制是否显示修改密码的弹窗
      isShowChangePwd: false,
      // 控制是否显示密码
      isPassword: true,
      // 保存旧和新密码
      password: {
        oldPassword: "",
        newPassword: "",
      },
      // 保存用户的手机号
      userPhone: null,
    };
  },

  created() {
    // 拦截路由的查询参数
    this.userPhone = this.$route.query.userPhone;
  },

  methods: {
    //提交修改密码
    commit() {
      //构造表单验证信息
      let o = {
        oldPassword: {
          value: this.password.oldPassword,
          errorMsg: "旧密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        newPassword: {
          value: this.password.newPassword,
          errorMsg: "新密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(o);

      //如果表单验证通过
      if (isPass) {
        if (this.password.newPassword == this.password.oldPassword) {
          this.$toast("新密码和旧密码不能相同");
          return;
        }

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        // 获取本地缓存中用户信息
        let userArr = JSON.parse(localStorage.getItem("userArr"));

        setTimeout(() => {
          for (let i = 0; i < userArr.length; i++) {
            if (userArr[i].phone == this.userPhone) {
              if (userArr[i].password == this.password.oldPassword) {
                userArr[i].password = this.password.newPassword;
                localStorage.setItem("userArr", JSON.stringify(userArr));
                this.isShowChangePwd = false;
                this.$toast("修改密码成功啦~~");
                this.$router.push({ name: "Login" });
                return;
              }
            }
          }

          this.$toast("旧密码不正确！！");
        }, 800);
      }
    },

    // 切换账号
    toggleUserLogin() {
      this.$dialog
        .confirm({
          title: "温馨提醒",
          message: "亲，您确定切换账号么~",
          confirmButtonColor: "#fa3c5f"
        })
        .then(() => {
          this.$router.push({ name: "Login" });
        })
        .catch(() => {
          this.$toast("先去逛逛吧~~");
        });
    },

    //注销账号
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一旦注销无法恢复哦！",
          confirmButtonColor: "#fa3c5f",
        })
        .then(() => {
          //执行账号注销
          this.$toast.loading({
            message: "注销中...",
            forbidClick: true,
            duration: 0,
          });

          // 获取本地缓存中用户信息， 由于异步问题，得先获取本地数据
          let userArr = JSON.parse(localStorage.getItem("userArr"));

          setTimeout(() => {
            for (let i = 0; i < userArr.length; i++) {
              if (userArr[i].phone == this.userPhone) {
                // splice修改原数组，返回删除的那一项的新数组
                userArr.splice(i, 1);
                localStorage.setItem("userArr", JSON.stringify(userArr));
                this.$toast("注销成功啦~~");
                this.$router.push({ name: "Login" });
                return;
              }
            }

            this.$toast("手机号不正确，请重新登录！！");
            this.$router.push({ name: "Login" });
          }, 800);
        })
        .catch(() => {
          this.$toast("你购买商品吧，萌萌哒~~");
        });
    },

    //退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确定退出登录！",
          confirmButtonColor: "#fa3c5f",
        })
        .then(() => {
          //执行退出登录
          //清除登录状态
          this.$toast.loading({
            message: "退出中...",
            forbidClick: true,
            duration: 0,
          });

          setTimeout(() => {
            // 删除本地缓存的_token
            localStorage.removeItem("_token");
            this.$router.push({ name: "Login" });
            this.$toast("退出登录成功啦~~");
          }, 800);
        })
        .catch((err) => {
          this.$toast("亲，先去逛逛呗~~");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.secure {
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

  .bg {
    width: 100%;
    height: 120px;
    background-color: #ff5777;
  }
  .fun-box {
    padding: 0 10px;
    margin-top: -20px;

    /deep/ .van-cell-group {
      border-radius: 10px 10px 0 0;
      overflow: hidden;

      /deep/ .van-cell:first-of-type {
        border-radius: 10px 10px 0 0;
      }
    }

    /deep/ .van-cell {
      padding: 16px;
    }
  }

  .ulogin-btn {
    margin-top: 80px;
    padding: 0 16px;
  }

  .form-box {
    padding: 15px;

    .form-title {
      margin-bottom: 50px;
    }

    .commit-btn {
      margin-top: 50px;
    }
  }
}
</style>