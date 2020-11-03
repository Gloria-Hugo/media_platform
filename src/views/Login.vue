<template>
  <div id="login">
    <div id="loginBox" class="flex-box">
      <div class="leftSide">
        <img src="../assets/imgs/LOGINIMG@3x.png" alt="" />
        <div class="des">
          <p>高质量的稿件平台</p>
          <p>更快捷更全面的服务</p>
        </div>
      </div>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginRules"
        label-width="0px"
      >
        <img src="../assets/imgs/LOGO2.png" class="loginBG" alt="" />
        <el-form-item
          label=""
          prop="username"
          style="margin-top: 40px;"
        >
          <div>账号/手机号</div>
          <el-input
            class="inps"
            placeholder="账号/手机号"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <div>密码</div>
          <el-input
            class="inps"
            placeholder="请输入密码"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="submitBtn btns" @click="submitForm(loginForm)">登录</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Header } from "element-ui";
export default {
  data() {
    return {
      activeName: "first",
      canvas: null,
      context: null,
      stars: [], //星星数组
      shadowColorList: [
        "#39f",
        "#ec5707",
        "#b031d4",
        "#22e6c7",
        "#92d819",
        "#14d7f1",
        "#e23c66",
      ], //阴影颜色列表
      //工厂模式定义Ball类
      width: window.innerWidth,
      height: window.innerHeight,
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //提交登录
    submitForm() {
      this.$refs.loginRules.validate((valid) => {
        const that = this;
        var timeer = Date.parse(new Date());
        var authorization = that.has256.sha256_digest(
          "app663988" +
            "/" +
            "POST" +
            "/" +
            that.loginForm.username +
            "/" +
            timeer
        );
        sessionStorage.setItem(`authorization`, authorization);
        let params = {
          username: that.loginForm.username,
          password: that.md5.md5(that.loginForm.password),
        };

        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "登录中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.$http
            .post(`/login/validate`, that.loginForm, {
              headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
                timesTamp: timeer,
              },
            })
            .then((res) => {
              loading.close();
              if (res.data.netCode == 200) {
                this.$message({
                  type: "success",
                  message: "登录成功",
                });
                sessionStorage.setItem(`Token`, res.data.hy_toke);
                this.queryDetail();
              } else {
                this.$message.error("账号或密码错误！");
              }
            });
        } else {
          return false;
        }
      });
    },
    //获取个人信息
    queryDetail() {
      const that = this;
      var author = sessionStorage.getItem("authorization");
      this.$http
        .get(`/login/getUserInfo`, {
          headers: {
            Authorization: sessionStorage.getItem("authorization"),
            HyToken: sessionStorage.getItem("Token"),
          },
        })
        .then((res) => {
          if (res.data.netCode !== 200) {
            this.$message.error("查询用户失败！");
          } else {
            // 1管理员，2需求人员，3承接方，4渠道方
            sessionStorage.setItem(`userName`, res.data.data.username);
            sessionStorage.setItem(`name`, res.data.data.name);
            sessionStorage.setItem(`userId`, res.data.data.userId);
            sessionStorage.setItem(`statusCode`, res.data.data.plateformCode);
            sessionStorage.setItem(
              `departmentCode`,
              res.data.data.departmentCode
            );
            sessionStorage.setItem(
              `msgCount`,
              res.data.standbyParams.messageCount
            );
            let msg = res.data.standbyParams.messageCount;
            if (msg > 0) {
              this.$message({
                showClose: true,
                message: `您有${msg}条消息，请前往消息中心及时查看！`,
                type: "warning",
                duration: 3000,
              });
            }
            var statusCode = res.data.data.plateformCode;
            if (statusCode == 1) {
              this.$router.push("/admin/contentmanager");
            } else if (statusCode == 2) {
              this.$router.push("/demand/needs");
            } else if (statusCode == 3) {
              this.$router.push("/contractor/mymanuscript");
            } else if (statusCode == 4) {
              this.$router.push("/canal/contentmanager");
            } else if(statusCode == 5) {
              this.$router.push("/keeper/countingmanager")
            }
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  padding: 0;
  margin: 0;
  height: 100vh;
  background-color: RGBA(245, 228, 227, 1);
  background-size: 100%;
  position: relative;
  #bgd {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
  #loginBox {
    width: 800px;
    height: 500px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #ffffff;
    box-shadow: 0px 10px 30px 0px rgba(198, 193, 193, 0.2);
    border-radius: 10px;
    .leftSide {
      width: 320px;
      background: #fbfafa;
      height: 100%;
      position: relative;
      img {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 222px;
        height: 132px;
      }
      .des {
        position: absolute;
        top: 300px;
        left: 100px;
        & p:first-child {
          color: #3d3d4e;
          font-size: 16px;
          font-weight: 500;
        }
        & p:last-child {
          color: #ffc3c2c5;
          font-size: 14px;
        }
      }
    }
    .el-form {
      flex: 1;
      padding: 70px;
      .loginBG {
        display: block;
        margin: 0 auto;
      }
    }
    h4 {
      text-align: center;
    }
    .submitBtn {
      width: 320px;
      height: 50px;
      margin: 0 auto;
      margin-top: 60px;
      border-radius: 6px;
      line-height: 50px;
      box-shadow: 0px 10px 30px 0px rgba(245, 71, 44, 0.2);
    }
    .iconfont {
      color: #fff;
    }
  }
  .el-input {
    border: none;
    background: transparent !important;
  }
}
.code {
  // height: 45px;
  padding: 5px 12px;
  background-color: #fff;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  color: #242645;
  box-sizing: border-box;
  // line-height: 45px;
}
</style>
