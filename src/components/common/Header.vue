<template>
  <div>
    <div class="flex-box headerBox">
      <img
        src="../../assets/imgs/LOGO2.png"
        class="logoBg hover"
        alt
        @click="toHome"
      />
      <!-- <el-tooltip effect="dark" content="欢迎登录" placement="bottom-end"> -->
      <el-dropdown>
        <div class="userAvatar-Box hover">
          <p>你好,{{ userName }}</p>
          <div>
            <img
              src="../../assets/imgs/icon_default_img.png"
              class="userAvatar"
              alt
            />
          </div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="resetPwd">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logOff">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogTableVisible"
      style="width: 1300px; margin: 0 auto"
    >
      <el-form
        :rules="rules"
        :model="pwdList"
        style="width: 550px"
        status-icon
        ref="pwdList"
      >
        <el-form-item prop="oldPwd" label="原密码" label-width="100px">
          <el-input
            v-model="pwdList.oldPwd"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>

        <el-form-item
          prop="newPwd"
          label="新密码"
          label-width="100px"
          style="margin-top: 30px; margin-bottom: 30px !important"
        >
          <el-input
            v-model="pwdList.newPwd"
            placeholder="新密码（6-16大小写字母、数字）"
            show-password
          />
        </el-form-item>

        <el-form-item prop="newPwd2" label="确认密码" label-width="100px">
          <el-input
            v-model="pwdList.newPwd2"
            placeholder="确认密码（6-16大小写字母、数字）"
            show-password
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('pwdList')">取 消</el-button>
        <el-button type="primary" @click="innerVisible('pwdList')"
          >确定修改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkPwd = (rule, value, callback) => {
      if (value !== this.pwdList.newPwd) {
        callback(new Error("密码不一致"));
        return false;
      } else {
        callback();
      }
    };
    return {
      dialogTableVisible: false,
      pwdList: {
        oldPwd: null,
        newPwd: null,
        newPwd2: null,
      },
      rules: {
        oldPwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        newPwd2: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: checkPwd, trigger: "blur" },
        ],
      },
      userName: sessionStorage.getItem("name"),
    };
  },
  methods: {
    logOff() {
      // window.alert("点击了");
      this.$confirm("退出登录?", "提示", {
        confirmButtonText: "是的",
        cancelButtonText: "再考虑下",
        type: "warning",
      })
        .then(() => {
          sessionStorage.clear();
          this.$message({
            type: "success",
            message: "已退出账号!",
          });
          this.$router.push("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出",
          });
        });
    },
    resetForm(pwdList) {
      this.$refs[pwdList].resetFields();
      this.dialogTableVisible = false;
    },
    resetPwd() {
      const that = this;
      this.dialogTableVisible = true;
    },
    toHome() {
      this.$router.push("/");
    },
    innerVisible() {
      this.$refs.pwdList.validate((valid) => {
        var pwdChanged = {
          oldPwd: this.pwdList.oldPwd,
          newPwd: this.pwdList.newPwd,
        };
        this.$http
          .get(
            `/userInfoMobileAction/updatePassword?oldPwd=${
              this.pwdList.oldPwd
            }&newPwd=${this.pwdList.newPwd}&username=${sessionStorage.getItem(
              "userName"
            )}`
          )
          .then((res) => {
            if (res.data) {
              this.$message({
                type: "success",
                message: "密码修改成功！",
              });
              this.dialogTableVisible = false;
              this.$message.error("登录已失效，请重新登录!");
              this.$router.push("/login");
            } else {
              this.$message.error("密码修改失败，请稍后重试！");
              this.dialogTableVisible = false;
            }
          });
      });
    },
  },
};
</script>
<style lang="less">
.headerBox {
  align-items: center;
  justify-content: space-between;
  height: 65px;
  width: 100%;
  padding: 0 30px 0 30px;
  overflow: hidden;
  box-shadow: 0 20px 20px -15px rgba(65, 43, 43, 0.1);
  margin-bottom: 2px;
  .userAvatar-Box {
    // width: 120px;
    display: flex;
    flex-direction: row;
    align-items: center;
    P {
      color: #333;
    }
    div {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 15px;
      img {
        height: 100%;
      }
    }
  }
}
</style>
