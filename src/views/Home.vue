<template>
  <div id="home">
    <el-container>
      <!-- 头部 -->
      <el-header class="mainDark home-header" style="">
        <div class="warpBox">
          <img src="../assets/imgs/LOGO.png" class="logoBg" alt />
          <div v-if="isLogin" class="helloUser" @click="toWorkShop">
            你好，{{ userName }}
          </div>
          <button v-else class="loginBtn hover" @click="toLogin">
            登录/注册
          </button>
        </div>
      </el-header>
      <!-- 主体内容 -->
      <el-main>
        <div class="mainColor center">
          <div class="warpBox">
            <div class="mainBox">
              <img src="../assets/imgs/bigV.png" class="bigV" />
              <div class="title">
                <h3>任选一种合适的套餐</h3>
                <p>依据你公司/单位业务需求量来选择相应的服务</p>
              </div>
            </div>
            <div class="center-box">
              <el-collapse-transition>
                <div v-show="show3">
                  <div class="bussinessBox">
                    <div class="items">
                      <img src="../assets/imgs/HOT.png" class="hotimg" alt />
                      <h5 class="name">基础服务包</h5>
                      <p class="des">符合普通单位少量需求</p>
                      <div class="price">
                        <span>￥</span>
                        <span>4888</span>
                        <span>/年</span>
                      </div>
                      <button class="kaitong">立即开通</button>
                      <ul class="dashedBox">
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">全年策划</span>
                          <span class="dot"></span>
                          <span class="descib"
                            >3个重庆平台策划 3个平时主题策划</span
                          >
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">图文</span>
                          <span class="dot"></span>
                          <span class="descib">6条短视频 1条企业宣传片</span>
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">视频</span>
                          <span class="dot"></span>
                          <span class="descib"
                            >12条长新闻 60条短消息(其中6个优质)</span
                          >
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">提总结和</span>
                          <span class="dot"></span>
                          <span class="descib">6条短视频 1条企业宣传片</span>
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">哈哈哈哈</span>
                          <span class="dot"></span>
                          <span class="descib">3次PPT 1次年度总结</span>
                        </li>
                      </ul>
                    </div>
                    <div class="items">
                      <h5 class="name">基础服务包</h5>
                      <p class="des">符合普通单位少量需求</p>
                      <div class="price">
                        <span>￥</span>
                        <span>4888</span>
                        <span>/年</span>
                      </div>
                      <button class="kaitong">立即开通</button>
                      <ul class="dashedBox">
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">全年策划</span>
                          <span class="dot"></span>
                          <span class="descib"
                            >3个重庆平台策划 3个平时主题策划</span
                          >
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">图文</span>
                          <span class="dot"></span>
                          <span class="descib">6条短视频 1条企业宣传片</span>
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">视频</span>
                          <span class="dot"></span>
                          <span class="descib"
                            >12条长新闻 60条短消息(其中6个优质)</span
                          >
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">提总结和</span>
                          <span class="dot"></span>
                          <span class="descib">6条短视频 1条企业宣传片</span>
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">哈哈哈哈</span>
                          <span class="dot"></span>
                          <span class="descib">3次PPT 1次年度总结</span>
                        </li>
                      </ul>
                    </div>
                    <div class="items">
                      <h5 class="name">基础服务包</h5>
                      <p class="des">符合普通单位少量需求</p>
                      <div class="price">
                        <span>￥</span>
                        <span>4888</span>
                        <span>/年</span>
                      </div>
                      <button class="kaitong blur">立即开通</button>
                      <ul class="dashedBox">
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">全年策划</span>
                          <span class="dot"></span>
                          <span class="descib"
                            >3个重庆平台策划 3个平时主题策划</span
                          >
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">图文</span>
                          <span class="dot"></span>
                          <span class="descib">6条短视频 1条企业宣传片</span>
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">视频</span>
                          <span class="dot"></span>
                          <span class="descib"
                            >12条长新闻 60条短消息(其中6个优质)</span
                          >
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">提总结和</span>
                          <span class="dot"></span>
                          <span class="descib">6条短视频 1条企业宣传片</span>
                        </li>
                        <li class="list-item">
                          <i class="iconfont icon-wancheng"></i>
                          <span class="li-name">哈哈哈哈</span>
                          <span class="dot"></span>
                          <span class="descib">3次PPT 1次年度总结</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
        <div class="blank"></div>
        <!-- 渠道优势 -->
        <div class="advantageBox">
          <div class="warpBox">
            <h3>CHANNEL ADVANTAGE</h3>
            <h2>渠道优势</h2>
            <div class="block-box clearfix">
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
            </div>
          </div>
        </div>
        <!-- 常见问题 -->
        <div class="questionsBox">
          <div class="warpBox">
            <h3>QUESTIONS</h3>
            <h2>常见问题</h2>
            <div class="pannel">
              <div class="collapsePannel">
                <el-collapse v-model="activeName" accordion>
                  <el-collapse-item title="一致性 Consistency" name="1">
                    <div>
                      与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
                    </div>
                    <div>
                      在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="反馈 Feedback" name="2">
                    <div>
                      控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
                    </div>
                    <div>
                      页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="效率 Efficiency" name="3">
                    <div>简化流程：设计简洁直观的操作流程；</div>
                    <div>
                      清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
                    </div>
                    <div>
                      帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="可控 Controllability" name="4">
                    <div>
                      用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
                    </div>
                    <div>
                      结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="效率 Efficiency" name="5">
                    <div>简化流程：设计简洁直观的操作流程；</div>
                    <div>
                      清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
                    </div>
                    <div>
                      帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="可控 Controllability" name="6">
                    <div>
                      用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
                    </div>
                    <div>
                      结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="效率 Efficiency" name="7">
                    <div>简化流程：设计简洁直观的操作流程；</div>
                    <div>
                      清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
                    </div>
                    <div>
                      帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                    </div>
                  </el-collapse-item>
                  <el-collapse-item title="可控 Controllability" name="8">
                    <div>
                      用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
                    </div>
                    <div>
                      结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </div>
        <div class="mainColor" style="padding-top: 60px">
          <div class="warpBox flex-box" style="padding-bottom: 80px">
            <div class="qcCodeBox">
              <div class="codeImg"></div>
              <div class="codeTips">扫码和微信客服在线沟通</div>
            </div>
            <div class="rightBox">
              <div class="bussiness">
                <p class="title-h5">媒体平台</p>
                <p>关于我们</p>
                <p>联系我们</p>
              </div>
              <div class="bussiness">
                <p class="title-h5">媒体平台</p>
                <p>关于我们</p>
                <p>联系我们</p>
              </div>
              <div class="bussiness">
                <p class="title-h5">登录</p>
                <p>关于我们</p>
                <p>联系我们</p>
                <p>管理员</p>
              </div>
              <div class="bussiness">
                <p class="title-h5">媒体平台</p>
                <p>关于我们</p>
                <p>联系我们</p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <!-- 底部 -->
      <el-footer>
        <div class="footBox">
          Copyright@2007-2019媒体平台.保留一切权利. 渝ICP备12020903号
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show3: false,
      userName: sessionStorage.getItem("name"),
      isLogin: false,
      activeName:''
    };
  },
  created() {
    if (!sessionStorage.getItem("userName")) {
      this.isLogin = false;
    } else {
      this.isLogin = true;
    }
  },
  mounted() {
    this.show3 = true;
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
    toWorkShop() {
      let statusCode = sessionStorage.getItem("statusCode");
      if (statusCode == 1) {
        this.$router.push("/admin/demandusermanager");
      } else if (statusCode == 2) {
        this.$router.push("/demand/needs");
      } else if (statusCode == 3) {
        this.$router.push("/contractor/mymanuscript");
      } else if (statusCode == 4) {
        this.$router.push("/canal/contentmanager");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.mainDark {
  background: #1a1a1e !important;
  margin-bottom: 0 !important;
}
.home-header {
  height: 80px;
  .warpBox {
    height: 100%;
    .logoBg,
    .loginBtn {
      margin-top: 10px;
    }
    .logoBg {
      height: 30px;
      width: 145px;
      margin-top: 15px;
      background-color: transparent;
    }
    .loginBtn {
      float: right;
      height: 40px;
      width: 120px;
      border: 1px solid #ffffff;
      background-color: transparent;
      color: #fff;
      box-sizing: border-box;
    }
    .helloUser {
      // display: inline-block;
      color: #fff;
      float: right;
      line-height: 3.5;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}

.center {
  height: 540px;
  position: relative;
  .mainBox {
    position: relative;
    height: 100%;
    margin: 0 auto;
    .bigV {
      display: block;
      margin: 0 auto;
    }
    .title {
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
    }
    h3 {
      margin-top: 0;
      color: #fff;
      font-size: 40px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 22px;
    }
    p {
      font-size: 16px;
      font-weight: bold;
      color: #fdf9f8;
      text-align: center;
    }
  }
  .center-box {
    position: absolute;
    top: 245px;
    .bussinessBox {
      // position: relative;
      width: 1400px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .items {
        position: relative;
        padding: 40px 0;
        box-sizing: border-box;
        width: 440px;
        height: 588px;
        background: #ffffff;
        box-shadow: 0px 12px 40px 0px rgba(65, 43, 42, 0.06);
        border-radius: 4px;
        .hotimg {
          top: 0;
          left: 0;
          position: absolute;
        }
        .name {
          color: #616161;
          font-size: 30px;
          text-align: center;
          font-weight: 500;
          margin-bottom: 13px;
        }
        .des {
          color: #616161;
          font-size: 16px;
          font-weight: 400;
          text-align: center;
        }
        .price {
          margin: 20px 0;
          color: #333;
          text-align: center;
          font-weight: bold;
          :nth-child(1),
          :nth-child(3) {
            // color: #333;
            font-size: 16px;
            // font-weight: 500;
          }
          :nth-child(2) {
            font-size: 34px;
          }
        }
        .kaitong {
          display: block;
          margin: 0 auto;
          height: 56px;
          width: 180px;
          background: #ffffff;
          border: 1px solid #f5472c;
          box-shadow: 0px 6px 24px 0px rgba(245, 71, 44, 0.16);
          border-radius: 2px;
          margin-bottom: 40px;
          color: #f5482d;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
        .kaitong:hover {
          background-color: #f5472c;
          color: #fff;
        }

        .blur {
          background-color: #ffedeb;
        }
        .dashedBox {
          border-top: 1px dashed #f5482c;
          padding: 40px 32px;
          .list-item {
            margin-bottom: 25px;
            i {
              vertical-align: middle;
            }
            .li-name,
            .descib {
              color: #626262;
              font-size: 14px;
              font-weight: bold;
              vertical-align: middle;
            }
            .li-name {
              text-align: left;
              display: inline-block;
              width: 60px;
            }
            .dot {
              display: inline-block;
              vertical-align: middle;
              height: 8px;
              width: 8px;
              background-color: #aeaeae;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}
.blank {
  width: 100%;
  height: 370px;
  background-color: #fff;
}
.advantageBox {
  padding: 60px 0;
  background-color: #f5f6f8;
  width: 100%;
  h3 {
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  h2 {
    color: #222222;
    font-size: 30px;
    text-align: center;
  }
  .block-box {
    box-sizing: border-box;
    // display: flex;
    margin-top: 60px;
    // justify-content: space-between;
    .block {
      float: left;
      width: 320px;
      height: 160px;
      background: #ffffff;
      margin-bottom: 40px;
      margin-right: 40px;
    }
    :nth-child(4),
    :nth-child(8) {
      margin-right: 0;
    }
  }
}
.el-collapse-item__header {
  height: 75px;
  border-bottom: 1px dashed #222;
}
.questionsBox {
  padding: 60px 0;
  box-sizing: border-box;
  background-color: #fff;
  h3 {
    text-align: center;
    font-size: 30px;
    color: #f1f1f5;
  }
  h2 {
    color: #222222;
    font-size: 30px;
    text-align: center;
  }
  .pannel {
    margin-top: 40px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .collapsePannel {
      flex: 45%;
    }
  }
}
.el-collapse-item {
  display: inline-block;
  width: 680px !important;
}
.el-collapse-item:nth-child(odd) {
  margin-right: 20px;
}
.mainColor {
  width: 100%;
  // padding: 60px 0;
  .qcCodeBox {
    .codeImg {
      height: 200px;
      width: 200px;
      background-color: #fff;
    }
    .codeTips {
      width: 200px;
      margin-top: 15px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .rightBox {
    width: 50%;
    justify-items: left;
    display: flex;
    border-bottom: 1px dashed #fff;
    .bussiness {
      margin-left: auto;
      float: right;
      p {
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        line-height: 38px;
      }
      .title-h5 {
        font-size: 18px;
        font-weight: 500;
      }
    }
  }
}
.footBox {
  width: 100%;
  text-align: center;
  height: 60px;
  line-height: 60px;
  background-color: #1a1a1e;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #4a4b4d;
}
#home{
  .el-main{
    height: 100%;
  }
}
</style>
