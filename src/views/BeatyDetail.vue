<template>
  <div class="beaty-detail" v-if="itemInfo">
    <!-- 头部导航栏 -->
    <van-nav-bar
      title="详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      :safe-area-inset-top="true"
    />

    <!-- 头部商品信息 -->
    <div class="item-info-box">
      <!-- 顶部图片盒子 -->
      <div class="top-images-box">
        <van-swipe
          indicator-color="white"
          :loop="false"
          :show-indicators="false"
          :width="200"
          class="my-swipe"
        >
          <van-swipe-item
            v-for="(img, index) in itemInfo.topImages"
            :key="index"
          >
            <img
              :src="'http:' + img"
              class="top-image"
              @click="
                isPreview = !isPreview;
                previewIndex = index;
              "
            />
          </van-swipe-item>
        </van-swipe>
        <!-- 点击图片，进行图片预览 -->
        <van-image-preview
          v-model="isPreview"
          :images="topImages"
          :closeable="true"
          :startPosition="previewIndex"
        >
        </van-image-preview>
      </div>

      <!-- 价格盒子 -->
      <div class="price-box">
        <div class="now-price-box">
          {{ itemInfo.lowNowPrice }}
          <span class="icon">￥</span>
        </div>
        <div class="price-desc-box">
          <span class="old-price">{{ itemInfo.oldPrice }}</span>
          <span class="discount-desc">{{ itemInfo.discountDesc }}</span>
        </div>
      </div>

      <!-- 标题 -->
      <div
        class="title"
        @touchstart="showContent(itemInfo.title)"
        @touchend="touchend"
      >
        {{ itemInfo.title }}
      </div>

      <!-- 地址 -->
      <div class="addr">
        <span class="left">免邮费</span>
        <span class="right">{{ itemInfo.extra.sendAddress | newAddr }}</span>
      </div>
    </div>

    <!-- 基本保障 -->
    <div
      class="guarantee-box"
      @click="showGuaranteeDetail = !showGuaranteeDetail"
    >
      <div>
        <img src="../assets/images/yes.png" />
        <span> 72小时发货</span>
      </div>
      <div>
        <img src="../assets/images/yes.png" />
        <span> 7天无理由退货</span>
      </div>
      <div>
        <img src="../assets/images/yes.png" />
        <span> 延误必赔</span>
      </div>
      <div>
        <img src="../assets/images/next.png" class="go-icon" />
      </div>
    </div>
    <!-- 点击了保障后，显示保障的详情弹窗 -->
    <van-popup
      v-model="showGuaranteeDetail"
      position="bottom"
      closeable
      :duration="0.2"
    >
      <div class="server-title">服务说明</div>
      <ul class="server-ul">
        <li v-for="(item, index) in services" :key="index">{{ item.name }}</li>
      </ul>
    </van-popup>

    <!-- 颜色 尺寸的选择 -->
    <div
      class="sku-info"
      @click="
        showSkuInfoRule = !showSkuInfoRule;
        isAdd = true;
        isBuy = true;
      "
    >
      <div class="rules">
        请选择：
        <span :class="{ active: rulesPink }">
          <span class="rule-color">{{ selectColor }}</span>
          <span class="rule-size">{{ selectSize }}</span>
        </span>
      </div>
      <div>
        <img src="../assets/images/next.png" />
      </div>
    </div>
    <!-- 点击了颜色 尺寸的选择后，显示颜色 尺寸的选择的详情弹窗 -->
    <van-popup
      v-model="showSkuInfoRule"
      position="bottom"
      closeable
      :duration="0.2"
      round
    >
      <!-- 头部信息 -->
      <div class="sku-header">
        <div class="show-img">
          <img :src="selectImg" @click="showSelectImg" />
          <!-- 点击图片，进行图片预览 -->
          <van-image-preview
            v-model="isSelectImg"
            :images="selectImgArr"
            :closeable="true"
          >
          </van-image-preview>
        </div>
        <div class="select-desc-box">
          <div class="price-box">
            <span>{{ itemInfo.lowPrice }}</span>
            <span class="price-icon">￥</span>
          </div>
          <div class="repertory">
            库存<span>{{ stock }}</span
            >件
          </div>
          <div class="selected">
            已选择：<span>{{ selectColor }} {{ selectSize }}</span>
          </div>
        </div>
      </div>

      <!-- 具体可选择的规则 -->
      <div class="sku-body">
        <!-- 颜色盒子 -->
        <div class="color-box">
          <p>{{ skuInfo.styleKey }}</p>
          <ul class="rules">
            <li
              v-for="(item, index) in skuInfo.props[0].list"
              :key="index"
              @click="selectColorHander(item, index)"
              :class="{ selected: activeColor == index }"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <!-- 尺码盒子 -->
        <div class="size-box">
          <p>{{ skuInfo.sizeKey }}</p>
          <ul class="rules">
            <li
              v-for="(item, index) in skuInfo.props[1].list"
              :key="index"
              @click="selectSizeHander(item, index)"
              :class="{ selected: activeSize == index }"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <!-- 计数盒子 -->
        <div class="select-count-box">
          <p>数量</p>
          <div class="btns">
            <span @click="delCount" :class="{ pink: isOne }">-</span>
            <span>{{ selectShopCount }}</span>
            <span @click="addCount" class="pink">+</span>
          </div>
        </div>
      </div>

      <!-- 底部2个按钮 -->
      <div class="btns">
        <div class="add-btn" v-if="isAdd">
          <van-button color="#ffe6e8" block @click="setLocalStorage"
            >加入购物车</van-button
          >
        </div>
        <div class="buy-btn" v-if="isBuy">
          <van-button color="#ff498b" block @click="buyLocalStorage"
            >立即购买</van-button
          >
        </div>
      </div>
    </van-popup>

    <!-- 买家评价 -->
    <div class="evaluate" v-if="evaluateData">
      <!-- 评价头部标题 -->
      <div class="evaluate-header">
        <div>
          买家评价
          <span class="evaluate-count">{{ evaluateData.length }} |</span> 销量
          <span class="sales">{{ columns[0].split(" ")[1] }}</span>
        </div>
      </div>

      <!-- 用户评价信息item -->
      <ul class="evaluate-user-box">
        <li v-for="(item, index) in evaluateData" :key="index">
          <!-- 评价用户信息盒子 -->
          <div class="user-box">
            <div class="user-img">
              <img
                :src="'http:' + item.user.avatar"
                @click="$toast('这个菇凉匿名不想对话，找找其他菇凉对话吧~')"
              />
            </div>
            <div class="user-right-box">
              <div
                class="nick"
                @click="$toast('这个菇凉匿名不想对话，找找其他菇凉对话吧~')"
              >
                {{ item.user.uname }}
              </div>
              <div class="specifi-box" v-if="item.extraInfo">
                <span v-if="item.extraInfo[1]" class="pink">{{
                  item.extraInfo[1] | fit
                }}</span>
                <span v-if="item.extraInfo[2] && item.extraInfo[0]">
                  |{{ item.extraInfo[2] | fit }} {{ item.extraInfo[0] | fit }}
                  {{ item.style.split(":")[1].split(" ")[0] }} /
                  {{ item.style.split(":")[2] }}</span
                >
              </div>
            </div>
          </div>
          <!-- 评价文本 -->
          <p @touchstart="showContent(item.content)" @touchend="touchend">
            {{ item.content }}
          </p>
          <!-- 评价的图片 -->
          <ul class="user-photograph-box" v-if="item.images">
            <li v-for="(img, index) in item.images" :key="index">
              <img
                :src="'http:' + img"
                @click="
                  isEvaluate = !isEvaluate;
                  evaluateIndex = index;
                "
              />
            </li>
            <!-- 点击图片，进行图片预览 -->
            <van-image-preview
              v-model="isEvaluate"
              :closeable="true"
              :images="evaluateImgs(item.images)"
              :startPosition="evaluateIndex"
            >
            </van-image-preview>
          </ul>
          <div class="time">2020-08-16</div>
        </li>
      </ul>
    </div>

    <!-- 商家信息的盒子 -->
    <div class="shop-info-box">
      <div class="shop-info-container">
        <div>
          <img :src="'http:' + shopInfo.shopLogo" />
        </div>
        <div class="shop-info-box-right">
          <div class="shop-desc-top">
            <div class="shop-name">{{ shopInfo.name }}</div>
            <div class="go-shop">
              进店
              <img src="../assets/images/next.png" />
            </div>
          </div>
          <div class="shop-desc-center">
            <span class="star-img">
              <img
                src="../assets/images/star.png"
                v-for="(item, index) in 4"
                :key="index"
              />
            </span>
            <span class="one">|</span>
            <span>在架商品 {{ shopInfo.cGoods }}</span>
          </div>
          <ul class="shop-desc-bottom">
            <li>{{ shopInfo.cFans | fitCount }}人关注</li>
            <li>累计销量{{ shopInfo.cSells | fitCount }}+</li>
            <li>{{ shopInfo.level }}年老字号</li>
          </ul>
        </div>
      </div>
      <!-- 点击了商家信息盒子，跳转到商家的店面详细页面 -->
      <a :href="shopUrl"> </a>
    </div>

    <!-- 商品图文展示详情信息盒子 -->
    <DetailInfo :detailInfo="detailInfo" :itemParams="itemParams"></DetailInfo>

    <!-- 底部的导航栏 -->
    <van-goods-action>
      <span class="bottom-go-shop">
        <van-goods-action-icon icon="shop-o" text="店铺" />
        <a :href="shopUrl"></a>
      </span>
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        :badge="!_token ? '' : cartNumber == 0 ? '' : cartNumber"
        @click="$router.push({ name: 'Cart' })"
      />
      <van-goods-action-icon
        :icon="isLike ? 'star' : 'star-o'"
        text="收藏"
        :color="isLike ? '#ff5777' : ''"
        :class="{ active: isLike }"
        @click="addLike"
      />
      <van-goods-action-button
        color="#f8c9cd"
        text="加入购物车"
        @click="
          showSkuInfoRule = !showSkuInfoRule;
          isAdd = true;
          isBuy = false;
        "
      />
      <van-goods-action-button
        color="#fd3780"
        text="立即购买"
        @click="
          showSkuInfoRule = !showSkuInfoRule;
          isAdd = false;
          isBuy = true;
        "
      />
    </van-goods-action>

    <!-- 点击火箭图片，回到顶部的图片 -->
    <img
      v-if="btnFlag"
      class="go-top"
      src="../assets/images/go_top.png"
      @click="backTop"
    />
  </div>
</template>

<script>
import DetailInfo from "../components/DetailInfo.vue";
// 导入Vuex的辅助函数
import { mapState } from "vuex";
import { ImagePreview } from "vant";
export default {
  name: "BeatyDetail",

  data() {
    return {
      // 记录商品的iid
      iid: null,
      // 保存头部商品详情数据
      itemInfo: null,
      // 保障的服务数据
      services: [],
      // 展示保障详情弹窗
      showGuaranteeDetail: false,
      // 控制是否进行图片预览
      isPreview: false,
      // 控制点击哪张图片，就预览哪张图片
      previewIndex: null,
      // 保存选择规格的数据
      skuInfo: null,
      // 控制是否弹窗详细的规则
      showSkuInfoRule: false,
      // 保存用户评价的数据
      evaluateData: null,
      // 保存销量等数据
      columns: null,
      // 保存商家的信息数据
      shopInfo: null,
      // 保存商品详细图文展示数据
      detailInfo: null,
      // 保存商品参数的数据
      itemParams: null,
      // 控制是否收藏的图标颜色变化
      isLike: false,
      // 保存选购商品的数量
      selectShopCount: 1,
      // 控制数量栏的-号按钮颜色
      isOne: false,
      // 保存选择哪个颜色的下标
      activeColor: -1,
      // 保存选择的颜色
      selectColor: null,
      // 保存选择哪个尺码的下标
      activeSize: -1,
      // 保存选择的尺码
      selectSize: null,
      // 保存选择的颜色id
      styleId: 1,
      // 保存选择的尺码id
      sizeId: 100,
      // 保存库存的数据
      stock: null,
      // 控制请选择的字体颜色
      rulesPink: false,
      // 判断是加入购物车还是立即购买
      isAdd: true,
      isBuy: true,
      // 记录选择的商品规则数据的数组
      selectedRulesArr: [],
      // 记录收藏的数据的数组
      likeArr: [],
      // 保存用户登录的_token
      _token: null,
      // 控制是否进行买家评论图片预览
      isEvaluate: false,
      // 控制点击哪张图片，就预览哪张图片
      evaluateIndex: null,
      // 控制是否显示回到顶部的
      btnFlag: false,
      // 展示选择的图片预览
      isSelectImg: false,
      selectImgArr: [],
      // 保存立即购买的商品数据
      buyNowArr: [],
    };
  },

  created() {
    // 拦截路由参数iid
    this.iid = this.$route.params.iid;
    // 调用根据商品的iid获取对应的详情数据的方法
    this.getBeautyDetail();

    this._token = localStorage.getItem("_token");

    // 先判断本地缓存中是否有_token，有才高亮收藏
    if (this._token) {
      // 先判断本地缓存中是否有likeArr
      if (localStorage.getItem("likeArr")) {
        // 获取本地缓存中的收藏数组
        this.likeArr = JSON.parse(localStorage.getItem("likeArr"));
        for (let item of this.likeArr) {
          if (item.iid == this.iid) {
            // 已创建就根据iid来判断该商品是否收藏
            this.isLike = true;
            return;
          }
        }
      }
    }

    // 先拿到本地缓存中的buyNowArr初始值
    if (localStorage.getItem("buyNowArr")) {
      this.buyNowArr = JSON.parse(localStorage.getItem("buyNowArr"));
    }
  },

  // window对象，所有浏览器都支持window对象。它表示浏览器窗口，监听滚动事件
  mounted() {
    window.addEventListener("scroll", this.scrollToTop);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },

  filters: {
    newAddr(oldAddr) {
      return oldAddr.replace(/省|市/gi, "");
    },
    fit(oldValue) {
      return oldValue.split(":")[1].replace(" ", "");
    },
    // 商家信息栏的关注和累计销量人数
    fitCount(oldValue) {
      return oldValue > 10000 ? (oldValue / 10000).toFixed(1) + "万" : oldValue;
    },
  },

  computed: {
    ...mapState(["cartItemId", "buyItemId"]),

    // 跳转商家的a标签网址
    shopUrl() {
      return (
        "https://m.mogu.com/v8/meili/shop?shopid=" +
        this.shopInfo.shopUrl.split("/")[
          this.shopInfo.shopUrl.split("/").length - 1
        ]
      );
    },

    // 选择颜色 尺码里面的 展示图片的
    selectImg() {
      let skusData = this.skuInfo.skus;
      let arr = [];
      for (let i = 0; i < skusData.length; i++) {
        if (
          this.styleId == skusData[i].styleId &&
          this.sizeId == skusData[i].sizeId
        ) {
          return "http:" + skusData[i].img;
        }
      }
    },

    // 获取购物车的数量，并从本地缓存拿初始化this.selectedRulesArr的值
    cartNumber() {
      if (localStorage.getItem("selectedRulesArr")) {
        this.selectedRulesArr = JSON.parse(
          localStorage.getItem("selectedRulesArr")
        );
      }
      return this.selectedRulesArr.length;
    },

    // 头部预览图片数组
    topImages() {
      return this.itemInfo.topImages.map((item) => {
        return "http:" + item;
      });
    },
  },

  components: {
    DetailInfo,
  },

  methods: {
    // 根据商品的iid获取对应的详情数据
    getBeautyDetail() {
      // 启动加载提示
      this.$toast.loading({
        // 提示文本内容
        message: "加载中...",
        // 禁止穿透点击
        forbidClick: true,
        // 展示时长，0表示不限制，不关闭
        duration: 0,
      });

      this.axios({
        url: this.beauty + "/detail",
        params: {
          iid: this.iid,
        },
      })
        .then((res) => {
          // 保存头部商品详情数据
          this.itemInfo = res.data.result.itemInfo;
          // 保障的服务数据
          this.services = res.data.result.shopInfo.services;
          // 保存选择规格的数据
          this.skuInfo = res.data.result.skuInfo;
          // 保存规则标题
          this.selectColor = this.skuInfo.styleKey;
          this.selectSize = this.skuInfo.sizeKey;

          // 保存库存的数据
          this.stock = res.data.result.skuInfo.totalStock;
          // 保存用户评价的数据
          this.evaluateData = res.data.result.rate.list;
          // 保存销量等数据
          this.columns = res.data.result.columns;
          // 保存商家的信息数据
          this.shopInfo = res.data.result.shopInfo;
          // 保存商品详细图文展示数据
          this.detailInfo = res.data.result.detailInfo;
          // 保存商品参数的数据
          this.itemParams = res.data.result.itemParams;

          this.$toast.clear();
        })
        .catch((err) => {
          console.log(err);

          this.$router.go(-1);
          setTimeout(() => {
            this.$toast.fail("服务器找不到商品，或者商品下架了哦~ 萌萌哒");
          }, 800);
        });
    },

    // 返回上一页
    goBack() {
      // 路由返回上一级
      this.$router.go(-1);
    },

    // 触摸开始显示评价文本内容
    showContent(content) {
      this.$toast({
        message: content,
        forbidClick: true,
        duration: 0,
      });
    },
    // 触摸结束不显示评价文本内容
    touchend() {
      this.$toast.clear();
    },

    // 点击收藏的方法
    addLike() {
      // 如果本地缓存中没有_token，结束该函数
      if (!localStorage.getItem("_token")) {
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
          .catch(() => {});
        return;
      }

      // 收藏的切换toggle
      this.isLike = !this.isLike;

      // 保存收藏的数据信息
      let likeObj = {
        showImg: "http:" + this.itemInfo.topImages[0],
        title: this.itemInfo.title,
        price: this.itemInfo.lowNowPrice,
        oldPrice: this.itemInfo.oldPrice,
        iid: this.iid,
        isDel: false,
      };

      // 收藏高亮
      if (this.isLike) {
        // 先判断本地缓存中是否有likeArr
        if (localStorage.getItem("likeArr")) {
          this.likeArr = JSON.parse(localStorage.getItem("likeArr"));
          this.likeArr.push(likeObj);
        } else {
          // 本地缓存中没有likeArr
          this.likeArr.push(likeObj);
        }
        // 保存到本地缓存中去
        localStorage.setItem("likeArr", JSON.stringify(this.likeArr));
        this.$toast("收藏成功啦~~");
      } else {
        // 收藏不高亮，就是根据iid在本地缓存中删除该收藏商品
        let likeArr = JSON.parse(localStorage.getItem("likeArr"));
        for (let i = 0; i < likeArr.length; i++) {
          // 根据iid在本地缓存中删除该收藏商品
          if (likeArr[i].iid == this.iid) {
            // 删除该iid的收藏商品
            likeArr.splice(i, 1);
            // 重新保存到本地缓存中去
            localStorage.setItem("likeArr", JSON.stringify(likeArr));
            this.$toast("期待你的下一次收藏啦~~");
            return;
          }
        }
      }
    },

    // 选择颜色 尺寸里面的数量 - 和 + 按钮的方法
    delCount() {
      if (this.selectShopCount == 1) {
        this.$toast("至少要购买一件哦，宝贝~");
      } else {
        this.selectShopCount--;
      }
      // 设置-号不高亮
      if (this.selectShopCount < 2) {
        this.isOne = false;
      }
    },
    addCount() {
      this.selectShopCount++;
      // 设置-号高亮
      if (this.selectShopCount > 1) {
        this.isOne = true;
      }
    },

    // 选择了规则的颜色的方法
    selectColorHander(item, index) {
      this.activeColor = index;
      this.selectColor = `"${item.name}"`;
      this.styleId = item.styleId;
      this.rulesPink = true;

      let skusData = this.skuInfo.skus;
      for (let i = 0; i < skusData.length; i++) {
        if (this.styleId == skusData[i].styleId) {
          // 保存选择的库存数量
          this.stock = skusData[i].stock;
          return;
        }
      }
    },
    // 选择尺码的方法
    selectSizeHander(item, index) {
      this.activeSize = index;
      this.selectSize = `"${item.name}"`;
      this.sizeId = item.sizeId;
    },

    // 把加入购物车的商品规则详细，添加到本地缓存中去
    setLocalStorage() {
      // 当点击了加入购物车按钮，本地缓存没有_token，即为null时，就是没登录
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

      // 保存选择的规则的对象
      let rulesObj = {
        selectImg: this.selectImg,
        title: this.itemInfo.title,
        selectColor:
          this.skuInfo.styleKey + "：" + this.selectColor.replace(/"/gi, ""),
        selectSize:
          this.skuInfo.sizeKey + "：" + this.selectSize.replace(/"/gi, ""),
        selectShopCount: this.selectShopCount,
        price: this.itemInfo.lowPrice,
        itemId: this.cartItemId,
      };

      // 颜色和尺码一定要选择
      if (this.skuInfo.styleKey == this.selectColor) {
        this.$toast("请选择商品" + this.skuInfo.styleKey + "哦！");
      } else {
        if (this.skuInfo.sizeKey == this.selectSize) {
          this.$toast("请选择商品" + this.skuInfo.sizeKey + "哦！");
        } else {
          // 当this.selectedRulesArr.length不为0时
          if (this.selectedRulesArr.length != 0) {
            // 遍历判断检查选择的规则是否相同
            for (let i = 0; i < this.selectedRulesArr.length; i++) {
              if (
                this.selectedRulesArr[i].selectColor == rulesObj.selectColor &&
                this.selectedRulesArr[i].selectSize == rulesObj.selectSize
              ) {
                // 当选择颜色和尺码或规格都相同时，只需要更新数量即可
                this.selectedRulesArr[i].selectShopCount =
                  rulesObj.selectShopCount;

                // 保存到本地缓存中去
                localStorage.setItem(
                  "selectedRulesArr",
                  JSON.stringify(this.selectedRulesArr)
                );

                this.$toast("成功添加到购物车！");

                return;
              }
            }
          }

          // 存到data里面去
          this.selectedRulesArr.push(rulesObj);
          // 让Vuex的cartItemId自增
          this.$store.commit("changeCartItemId");

          // 保存到本地缓存中去
          localStorage.setItem(
            "selectedRulesArr",
            JSON.stringify(this.selectedRulesArr)
          );

          this.showSkuInfoRule = false;
          this.$toast("成功添加到购物车！");
        }
      }
    },

    // 点击火箭，回到顶部的方法
    backTop() {
      // 点击火箭回到顶部方法，加计时器是为了过渡顺滑
      let timer = setInterval(() => {
        let ispeed = Math.floor(-this.scrollTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop =
          this.scrollTop + ispeed;
        if (this.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },

    // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
    scrollToTop() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.scrollTop = scrollTop;
      if (this.scrollTop > 0) {
        this.btnFlag = true;
      } else {
        this.btnFlag = false;
      }
    },

    // 展示规则弹窗的头部图片展示的方法
    showSelectImg() {
      this.selectImgArr = [];
      this.isSelectImg = !this.isSelectImg;
      this.selectImgArr.push(this.selectImg);
    },

    // 把添加订单的商品规则详细，添加到本地缓存中去
    buyLocalStorage() {
      // 当点击了立即购买按钮，本地缓存没有_token，即为null时，就是没登录
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

      // 保存选择的规则的对象
      let rulesObj = {
        selectImg: this.selectImg,
        title: this.itemInfo.title,
        selectColor:
          this.skuInfo.styleKey + "：" + this.selectColor.replace(/"/gi, ""),
        selectSize:
          this.skuInfo.sizeKey + "：" + this.selectSize.replace(/"/gi, ""),
        selectShopCount: this.selectShopCount,
        price: this.itemInfo.lowPrice,
        itemId: this.buyItemId,
        orderTime: this.parseDate(),
        completed: false,
      };

      // 颜色和尺码一定要选择
      if (this.skuInfo.styleKey == this.selectColor) {
        this.$toast("请选择商品" + this.skuInfo.styleKey + "哦！");
      } else {
        if (this.skuInfo.sizeKey == this.selectSize) {
          this.$toast("请选择商品" + this.skuInfo.sizeKey + "哦！");
        } else {
          // 启动加载提示
          this.$toast.loading({
            // 提示文本内容
            message: "提交订单中...",
            // 禁止穿透点击
            forbidClick: true,
            // 展示时长，0表示不限制，不关闭
            duration: 0,
          });

          // 当this.buyNowArr.length不为0时
          if (this.buyNowArr.length != 0) {
            // 遍历判断检查选择的规则是否相同
            for (let i = 0; i < this.buyNowArr.length; i++) {
              if (
                this.buyNowArr[i].selectColor == rulesObj.selectColor &&
                this.buyNowArr[i].selectSize == rulesObj.selectSize
              ) {
                // 当选择颜色和尺码或规格都相同时，只需要更新数量即可
                this.buyNowArr[i].selectShopCount = rulesObj.selectShopCount;

                // 保存到本地缓存中去
                localStorage.setItem(
                  "buyNowArr",
                  JSON.stringify(this.buyNowArr)
                );

                setTimeout(() => {
                  this.$toast("成功添加订单！");
                  this.$router.push({
                    name: "Pay",
                    query: { curItemId: rulesObj.itemId },
                  });
                }, 800);

                return;
              }
            }
          }

          // 存到data里面去
          this.buyNowArr.push(rulesObj);
          // 让Vuex的buyItemId自增
          this.$store.commit("changeBuyItemId");

          // 保存到本地缓存中去
          localStorage.setItem("buyNowArr", JSON.stringify(this.buyNowArr));

          setTimeout(() => {
            this.$toast("成功添加订单！");
            this.$router.push({
              name: "Pay",
              query: { curItemId: rulesObj.itemId },
            });
          }, 800);
        }
      }
    },

    // 小于10，补零
    fullZero(num) {
      return num < 10 ? "0" + num : num;
    },

    // 格式化时间
    parseDate() {
      let time = new Date();
      let year = time.getFullYear();
      let month = this.fullZero(time.getMonth() + 1);
      let date = this.fullZero(time.getDate());
      let hour = this.fullZero(time.getHours());
      let minute = this.fullZero(time.getMinutes());
      let second = this.fullZero(time.getSeconds());
      return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    },

    // 评价图片预览
    evaluateImgs(images) {
      return images.map((img) => {
        return "http:" + img;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.beaty-detail {
  width: 100%;
  padding-bottom: 50px;

  /deep/ .van-nav-bar .van-icon {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__text {
    color: #ff5777;
  }
  /deep/ .van-nav-bar__title {
    color: #ff5777;
    font-weight: bold;
  }
  /deep/ .van-popup__close-icon {
    color: #333;
  }
  /deep/ .van-button__content {
    color: #f84667;
  }
  /deep/ .van-goods-action-button--last {
    /deep/ .van-button__content {
      color: #fff;
    }
  }
  /deep/ .van-goods-action-icon {
    &.active {
      color: #ff5777;
    }
  }
  /deep/ .van-info {
    background-color: #ff3e62;
  }

  .my-swipe .van-swipe-item {
    margin-right: 10px;
  }

  .item-info-box {
    background-color: #fff;
    overflow: hidden;

    .top-images-box {
      display: flex;
      padding-top: 10px;

      .top-image {
        width: 100%;
        height: auto;
        margin-right: 10px;
      }
    }

    .price-box {
      background-color: #fff;
      display: flex;
      padding: 10px 20px 6px;

      .now-price-box {
        position: relative;
        font-size: 36px;

        .icon {
          transform: scale(0.3);
          position: absolute;
          left: -21px;
          top: -11px;
        }
      }

      .price-desc-box {
        position: relative;

        .old-price {
          position: absolute;
          left: 0;
          top: 3px;
          text-decoration: line-through;
          color: #bbbbbb;
          transform: scale(0.7);
        }
        .discount-desc {
          display: block;
          transform: scale(0.7);
          margin: 20px 0 0 4px;
          padding: 0 4px;

          background-color: #fcdee9;
          color: #ff2255;
        }
      }
    }

    .title {
      padding: 0 20px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }
    .addr {
      display: flex;
      justify-content: space-between;
      padding: 10px 16px;
      color: #999999;

      .left {
        transform: scale(0.75);
      }
      .right {
        transform: scale(0.75);
      }
    }
  }

  .guarantee-box {
    display: flex;
    justify-content: space-between;
    padding: 10px 14px 10px 20px;
    background-color: #fff;
    margin: 10px 0;

    img {
      width: 15px;
      height: 15px;
      vertical-align: bottom;
    }
    .go-icon {
      width: 12px;
      height: 12px;
      margin-bottom: 2px;
    }

    span {
      color: #666;
      font-size: 12px;
    }
  }

  .server-title {
    text-align: center;
    color: rgb(139, 139, 139);
    margin-top: 40px;
  }
  .server-ul {
    padding: 16px 16px 12px;
    li {
      padding: 10px 0;
      border-bottom: 1px solid #cac9c9;
      font-size: 14px;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }

  .sku-info {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 14px 14px 14px 20px;
    font-size: 12px;
    color: #666666;

    img {
      width: 12px;
      height: 12px;
      vertical-align: bottom;
    }

    .rule-size {
      margin-left: 6px;
    }

    .rules {
      > span {
        &.active {
          color: #ff5777;
        }
      }
    }
  }

  .sku-header {
    display: flex;
    align-items: center;

    .show-img {
      margin: 12px 0 0 18px;
      width: 100px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .select-desc-box {
      padding-left: 16px;
      font-size: 13px;

      .price-box {
        font-size: 28px;
        position: relative;
        padding-left: 8px;

        .price-icon {
          position: absolute;
          left: -2px;
          top: 2px;
          font-size: 12px;
        }
      }

      .repertory {
        margin: 6px 0 4px;
      }
      .selected {
        span {
          color: #ff5777;
        }
      }
    }
  }

  .sku-body {
    padding: 14px 10px 10px;
    font-size: 13px;
    color: #5e5e5e;

    p {
      margin: 0 0 4px;
    }

    ul.rules {
      display: flex;
      flex-wrap: wrap;

      li {
        padding: 4px 14px;
        border: 1px solid #bbbbbb;
        border-radius: 4px;
        margin: 0 10px 16px 0;

        &.selected {
          color: #ff5777;
          border: 1px solid #ff5777;
        }
      }
    }

    .select-count-box {
      .btns {
        border: 1px solid #bbbbbb;
        display: inline-block;
        border-radius: 4px;
        font-size: 16px;

        span {
          padding: 4px 12px;
          display: inline-block;

          &:nth-of-type(2) {
            border-left: 1px solid #bbbbbb;
            border-right: 1px solid #bbbbbb;
          }
        }
        .pink {
          color: #ff5777;
        }
      }
    }
  }

  .btns {
    display: flex;
    margin-top: 6px;

    .add-btn {
      flex: 1;

      /deep/ .van-button__content {
        color: #ff5777;
      }
    }
    .buy-btn {
      flex: 1;

      /deep/ .van-button__content {
        color: #fff;
      }
    }
  }

  .evaluate {
    margin: 10px 0 0;
    background-color: #fff;

    .evaluate-header {
      justify-content: space-between;
      display: flex;
      padding: 14px 14px 14px 20px;
      font-size: 13px;
      color: #858585;

      img {
        width: 12px;
        height: 12px;
        vertical-align: bottom;
      }
    }

    .evaluate-user-box {
      padding: 0 14px 14px 20px;

      li {
        padding-bottom: 16px;
        border-bottom: 1px solid #d8d8d8;
        margin-top: 12px;

        .user-box {
          display: flex;
          align-items: center;
          img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            vertical-align: bottom;
          }

          .user-right-box {
            margin-left: 12px;
            .nick {
              margin-bottom: 2px;
            }

            .specifi-box {
              font-size: 12px;
              color: #999999;

              .pink {
                color: #ff5777;
              }
            }
          }
        }

        p {
          font-size: 14px;
          color: #666;
          margin: 10px 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }

        .user-photograph-box {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          flex-wrap: wrap;
          li {
            width: 32%;
            border-bottom: none;
            margin: 0;
            padding: 2px 0 0;
            margin-right: 4px;

            img {
              width: 100%;
              height: auto;
            }
          }
        }

        .time {
          font-size: 13px;
          color: #999;
        }
      }
    }
  }

  .shop-info-box {
    width: 100%;
    margin-top: 10px;
    padding: 14px 12px;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;

    .shop-info-container {
      display: block;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      img {
        width: 56px;
        height: 56px;
        vertical-align: bottom;
        border-radius: 4px;
      }

      .shop-info-box-right {
        flex: 1;
        margin-left: 8px;

        .shop-desc-top {
          display: flex;
          justify-content: space-between;
          font-size: 14px;

          .go-shop {
            font-size: 13px;
            color: #666666;

            img {
              width: 12px;
              height: 12px;
              margin-bottom: 1px;
            }
          }
        }

        .shop-desc-center {
          color: #666666;
          font-size: 12px;
          display: flex;
          align-items: center;
          margin: 2px 0 5px;

          .star-img {
            display: inline-block;
            height: 10px;
            img {
              width: 10px;
              height: 10px;
              margin-right: 3px;
              vertical-align: top;
            }
          }
          .one {
            margin: 0 14px;
            color: #ccc;
          }
        }

        .shop-desc-bottom {
          display: flex;
          font-size: 12px;
          color: #ff4466;

          li {
            border: 1px solid #ccc;
            border-radius: 10px;
            margin-right: 6px;
            padding: 0 7px;
          }
        }
      }
    }

    a {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .bottom-go-shop {
    position: relative;
    a {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .go-top {
    position: fixed;
    bottom: 80px;
    right: 0;
    width: 50px;
    height: 50px;
  }
}
</style>