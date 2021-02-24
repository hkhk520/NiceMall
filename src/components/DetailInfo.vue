<template>
  <div class="detail-info">
    <van-tabs
      v-model="active"
      scrollspy
      :border="true"
      title-active-color="#ff5777"
      title-inactive-color="#333"
      color="#ff5777"
      line-width="110px"
      line-height="1px"
    >
      <div class="detail-info-container">
        <van-tab title="图文详情">
          <div class="graphic-details-box">
            <div class="desc--start">
              <span class="cicle-top"></span>
            </div>
            <p class="desc">{{ detailInfo.desc }}</p>
            <div class="desc--start end">
              <span class="cicle-bottom"></span>
            </div>
            <div class="title">图文详情</div>

            <ul class="show-imgs-box">
              <li v-for="(item, index) in detailInfo.detailImage" :key="index">
                <p>
                  <span>{{ item.key }}</span>
                </p>
                <van-image
                  width="100%"
                  height="auto"
                  fit="contain"
                  v-for="(img, index) in item.list"
                  :key="index"
                  :src="'http:'+img"
                  lazy-load
                  @click="
                    isPreview = !isPreview;
                    previewIndex = index;
                  "
                />
                <!-- 点击图片，进行图片预览 -->
                <van-image-preview
                  v-model="isPreview"
                  :closeable="true"
                  :images="previewImgs(item.list)"
                  :startPosition="previewIndex"
                >
                </van-image-preview>
              </li>
            </ul>
          </div>
        </van-tab>

        <van-tab title="商品参数" v-if="itemParams.info">
          <ul class="params-info-box">
            <li class="title">
              <span>{{ itemParams.info.key }}</span>
            </li>
            <li
              v-for="(item, index) in itemParams.info.set"
              :key="index"
              class="param-li"
            >
              <div class="key">{{ item.key }}</div>
              <div class="value">{{ item.value }}</div>
            </li>
          </ul>
        </van-tab>

        <van-tab title="尺寸规格" v-if="itemParams.rule">
          <div class="params-rule-box">
            <div class="title">
              <span>{{ itemParams.rule.key }}</span>
            </div>
            <div
              v-for="(table, index) in itemParams.rule.tables[0]"
              :key="index"
              class="table"
            >
              <div v-for="(item, index) in table" :key="index">
                <span :class="{ pink: isPink(item) ? true : false }">{{
                  item
                }}</span>
              </div>
            </div>
            <div class="disclaimer">{{ itemParams.rule.disclaimer }}</div>
          </div>
        </van-tab>
      </div>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: "DetailInfo",

  props: {
    detailInfo: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
    itemParams: {
      type: Object,
      default() {
        return {};
      },
      required: true,
    },
  },

  data() {
    return {
      active: 0,
      // 控制是否进行图片预览
      isPreview: false,
      // 控制点击哪张图片，就预览哪张图片
      previewIndex: null,
    };
  },

  methods: {
    isPink(item) {
      return item > 0 && item < 1000;
    },

    // 预览图片处理
    previewImgs(list){
      if(list){
        return list.map( item => {
          return "http:"+item;
        })
      }
    }
  },
};
</script>

<style lang="less" scoped>
.detail-info {
  background-color: #fff;
  margin-top: 10px;

  /deep/ .van-tab {
    font-size: 15px;
  }

  /deep/ [class*="van-hairline"]::after {
    border-bottom: 1px solid #999;
  }
  /deep/ .van-tabs__line {
    z-index: 0;
  }

  .detail-info-container {
    padding: 20px 14px 10px;
    box-sizing: border-box;

    .graphic-details-box {
      .desc--start {
        width: 100px;
        height: 1px;
        background: #a3a3a5;
        position: relative;
        span {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #000;
        }
        .cicle-top {
          left: 0;
          top: -1px;
        }
        .cicle-bottom {
          right: 0;
          top: -0.5px;
        }
      }
      .end {
        float: right;
      }

      .desc {
        color: #7a7a7a;
        padding: 14px 0 0;
        font-size: 15px;
        margin-bottom: 14px;
        // display: -webkit-box;
        // -webkit-line-clamp: 3;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // -webkit-box-orient: vertical;
      }

      .title {
        padding-top: 10px;
      }

      .show-imgs-box {
        li {
          p {
            color: #ff5777;
            font-size: 16px;
            margin: 10px 0;
            span {
              border-bottom: 1px solid #ff5777;
              padding-bottom: 2px;
            }
          }
          img {
            width: 100%;
            height: auto;
            vertical-align: bottom;
          }
        }
      }
    }

    .params-info-box {
      margin-top: 10px;
      .title {
        color: #ff5777;
        margin-bottom: 4px;
        span {
          border-bottom: 1px solid #ff5777;
          padding-bottom: 2px;
        }
      }
      .param-li {
        display: flex;
        border-bottom: 1px solid #ecebeb;
        padding: 10px 0;
        font-size: 14px;

        .key {
          width: 100px;
          color: #666;
        }
        .value {
          color: #ff5777;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .params-rule-box {
      margin-top: 10px;
      .title {
        color: #ff5777;
        margin-bottom: 4px;
        span {
          border-bottom: 1px solid #ff5777;
          padding-bottom: 2px;
        }
      }

      .table {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ecebeb;
        color: #666;
        font-size: 14px;

        div {
          flex: 1;
          padding: 10px 0;

          .pink {
            color: #ff5777;
          }
        }
      }

      .disclaimer {
        font-size: 12px;
        color: #a3a3a5;
      }
    }
  }
}
</style>