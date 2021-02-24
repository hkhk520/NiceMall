<template>
  <div
    class="search"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <!-- 头部导航栏 -->
    <van-nav-bar title="搜索" left-arrow @click-left="$router.go(-1)" />

    <!-- 头部搜索 start -->
    <div class="search-header">
      <div class="input-box">
        <img src="../assets/images/sousuo.png" />
        <input
          type="text"
          placeholder="请输入要搜索的关键词"
          v-model.trim="inputValue"
          @input="inputHandler"
          ref="inputDom"
          @keyup.enter="setStorage(inputValue)"
        />
        <img
          src="../assets/images/inputdel.png"
          class="input-del"
          v-show="inputValue"
          @click.stop="emptyInput"
        />
      </div>
    </div>
    <!-- 头部 end -->

    <!-- 热门搜索 start -->
    <div class="hot-search-box" v-if="isShowHot">
      <div class="hot-title">热门搜索</div>
      <ul class="hot-container clearfix">
        <li
          v-for="(item, index) in hotsListDatas"
          :key="index"
          @click="goSmallClassify(item)"
        >
          {{ item.text }}
        </li>
      </ul>

      <!-- 搜索的本地缓存展示 start -->
      <ol class="storage">
        <li
          v-for="item in historyMessageArr"
          :key="item.id"
          @click="goSmallClassify(item)"
        >
          <div><img src="../assets/images/clock.png" /></div>
          <span
            >{{ item.text
            }}<img src="../assets/images/x.png" @click.stop="delItem(item)"
          /></span>
        </li>
      </ol>
      <!-- 搜索的本地缓存展示 end -->
    </div>
    <!-- 热门搜索 end -->

    <!-- input输入请求到的数据展示的盒子 start -->
    <div class="input-search-box" v-if="!isShowHot">
      <div class="input-search-value" v-show="!isShowEmptySearch">
        搜索"{{ inputValue }}"
      </div>
      <div v-show="isShowEmptySearch" class="empty-search">
        <img src="../assets/images/empty_search.jpg" class="auto-img" />
        <div>抱歉，没有找到相关的数据</div>
      </div>
    </div>
    <!-- input输入请求到的数据展示的盒子 end -->
  </div>
</template>

<script>
export default {
  name: "Search",

  data() {
    return {
      // 保存热门搜索的li列表数据
      hotsListDatas: null,
      // 记录input输入框的输入的值
      inputValue: "",
      // 控制是否显示热门搜索的默认列表盒子
      isShowHot: true,
      // 保存延时器的状态
      timer: null,
      // 保存历史搜索记录的数组
      historyMessageArr: [],
      // 记录每一个历史记录的id
      messageId: 0,
      // 触摸的起始点
      startX: null,
      startY: null,
      // 触摸移动的X、Y距离
      moveX: null,
      moveY: null,
      // 控制是否显示没有搜索结果
      isShowEmptySearch: false,
    };
  },

  created() {
    // 调用获取热门搜索列表的数据
    this.getSearchHot();

    if (localStorage.getItem("messageId")) {
      this.messageId = localStorage.getItem("messageId");
    }
  },

  // 挂载的生命周期钩子
  mounted() {
    // 自动获取焦点
    this.$refs.inputDom.focus();

    if (localStorage.getItem("historyMessageArr")) {
      this.historyMessageArr = JSON.parse(
        localStorage.getItem("historyMessageArr")
      );
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
        this.$router.go(-1);
      } else if (
        Math.abs(this.moveX) > Math.abs(this.moveY) &&
        this.moveX > 0
      ) {
        // 右滑
        this.$router.go(-1);
      }
      // 把触摸移动的X、Y距离置空
      this.moveX = null;
      this.moveY = null;
    },

    // 获取热门搜索的列表的简略数据
    getSearchHot() {
      // 加载轻提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
      });

      // 请求大分类的数据
      this.axios({
        url: this.beauty + "/category",
      })
        .then((res) => {
          let lists = res.data.data.category.list;
          // 修改请求回来的数据格式
          let arrLists = [];
          lists.forEach((item) => {
            arrLists.push({
              text: item.title,
              maitKey: item.maitKey,
              miniWallkey: item.miniWallkey,
            });
          });
          // 保存到data里面去
          this.hotsListDatas = arrLists;
        })
        .catch((err) => {
          console.log(err);
          this.$toast.clear();
        });
    },

    // 点击清空input的value的方法
    emptyInput() {
      this.inputValue = "";
      // 显示热门搜索盒子
      this.isShowHot = true;
      // 自动获取焦点
      this.$refs.inputDom.focus();
    },

    // 监听input框输入时
    inputHandler() {
      // 使用延时器来实现防抖
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);

        // 如果input框的value值不为空就请求数据
        if (this.inputValue) {
          // 加载轻提示
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
          });
          // 不显示热门搜索盒子
          this.isShowHot = false;

          setTimeout(() => {
            // 匹配输入的内容是否有在关键词里面
            for (let i = 0; i < this.hotsListDatas.length; i++) {
              if (this.hotsListDatas[i].text.indexOf(this.inputValue) != -1) {
                if(this.inputValue != ""){
                  this.goSmallClassify(this.hotsListDatas[i]);
                  return;
                }
              }
            }
            this.isShowEmptySearch = true;
            this.$toast("没有找到相关数据啦~~");
          }, 500);
        } else {
          // 显示热门搜索盒子
          this.isShowHot = true;
        }
      }, 500);
    },

    // 当修改input框的value后，按下enter后松开，或者点击了热门搜索的词， 或者点击了历史记录的词， 就把数据存到本地缓存中去
    setStorage(currentItem) {
      // 先判断本地缓存中是否有该数组
      let messageArr = localStorage.getItem("historyMessageArr");
      // 存在该缓存数组
      if (messageArr) {
        // 如果输入的值一样，则先找到对应的下标
        let index = this.historyMessageArr.findIndex((item) => {
          return item.text == currentItem.text;
        });

        // 当本地缓存中有一样的数据时，先删除该数据
        if (index != -1) {
          // 先把本地缓存中已经一样的删除
          this.historyMessageArr.splice(index, 1);
        }
      }

      // 再在最前面添加一个输入的值
      this.historyMessageArr.unshift({
        ...currentItem,
        id: this.messageId,
      });
      // id要累加
      this.messageId++;
      // 保存到本地缓存中去
      localStorage.setItem("messageId", this.messageId);

      console.log("this.historyMessageArr =>", this.historyMessageArr);

      // 默认localStorage只能存取字符串, 所以先把数据转成json类型，再存到本地缓存中去
      localStorage.setItem(
        "historyMessageArr",
        JSON.stringify(this.historyMessageArr)
      );
    },

    // 点击了历史记录每一项的x，就删除该项
    delItem(item) {
      // 先拿到本地缓存中的数组
      let messageArr = JSON.parse(localStorage.getItem("historyMessageArr"));
      // 找到id相同的那一项
      let index = messageArr.findIndex((value) => {
        return item.id == value.id;
      });
      // 删除id相同的那一项
      messageArr.splice(index, 1);
      // 存到本地缓存中去
      localStorage.setItem("historyMessageArr", JSON.stringify(messageArr));
      // 保存到渲染的数据中去
      this.historyMessageArr = messageArr;
    },

    // 点击热门搜索关键词的跳转
    goSmallClassify(item) {
      // 调用存数据到本地缓存的方法
      this.setStorage(item);

      this.$router.push({
        name: "SmallClassify",
        query: { miniWallkey: item.miniWallkey, title: item.text },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__title {
    color: #ff5777;
  }
  /deep/ .van-nav-bar {
    background-color: #f9f9f9;
  }
  background-color: #f9f9f9;
  width: 100vw;
  height: 100vh;
  .search-header {
    padding: 18px 15px;
    border-bottom: 1px solid #e7e7e7;
    box-sizing: border-box;
    width: 100%;

    .input-box {
      display: flex;
      width: 100%;
      background-color: #fff;
      align-items: center;
      border-radius: 16px;
      overflow: hidden;
      position: relative;

      img {
        width: 18px;
        height: 18px;
        margin: 0 6px;
      }

      input[type="text"] {
        flex: 1;
        height: 32px;
        border: none;
        background-color: rgba(255, 255, 255, 0.1);

        // 修改input占位符的样式
        &::-webkit-input-placeholder {
          font-size: 13px;
          color: rgb(211, 203, 203);
        }
      }

      .input-del {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }
  }

  .hot-search-box {
    .hot-title {
      font-size: 12px;
      color: #666666;
      padding: 14px 10px 10px;
      box-sizing: border-box;
    }

    ul.hot-container {
      width: 100vw;
      padding: 0 10px;
      box-sizing: border-box;

      li {
        float: left;
        margin: 0 8px 10px 0;
        padding: 6px 12px;
        border-radius: 16px;
        box-sizing: border-box;
        font-size: 12px;
        background-color: #fff;
      }

      // 给ul加上一个清除浮动的类名
      &.clearfix::after {
        content: "";
        display: block;
        clear: both;
        overflow: hidden;
      }
    }

    .storage {
      margin-top: 10px;
      li {
        display: flex;

        div {
          height: 45.8px;
          display: flex;
          align-items: center;

          img {
            width: 16px;
            height: 16px;
            margin: 0 10px;
            vertical-align: bottom;
          }
        }

        span {
          border-bottom: 1px solid rgb(230, 230, 230);
          width: 100%;
          padding: 14px 0;
          font-size: 12px;

          img {
            width: 12px;
            height: 12px;
            margin-right: 18px;
            vertical-align: bottom;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .input-search-box {
    .input-search-value {
      padding: 16px 0;
      margin-left: 12px;
      border-bottom: 1px solid rgb(219, 219, 219);
      color: #507daf;
    }

    .input-search-container {
      li {
        display: flex;

        div {
          height: 45.8px;
          display: flex;
          align-items: center;

          img {
            width: 18px;
            height: 18px;
            margin: 0 8px;
            vertical-align: bottom;
          }
        }

        span {
          border-bottom: 1px solid rgb(219, 219, 219);
          width: 100%;
          padding: 12px 0;
          font-size: 15px;
        }
      }
    }

    .empty-search {
      width: 100%;
      height: 82vh;
      background-color: #fff;
      > div {
        width: 100%;
        text-align: center;
        font-size: 14px;
      }
    }
  }
}
</style>