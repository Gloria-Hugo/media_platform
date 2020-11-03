<template>
  <div id="userManagerBox" class="margin-box">
    <div class="queryBox flex-box">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="角色分类:">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字:">
          <el-input
            v-model="formInline.user"
            placeholder="输入关键词查询"
          ></el-input>
        </el-form-item>
        <el-form-item style="border: none; padding-left: 0">
          <el-button
            type="primary"
            id="queryBTN"
            @click="onSubmit"
            style="background: #f5482c; border: none"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <div
        class="btns normal"
        @click="
          dialogFormVisible = true;
          boxType = 1;
        "
      >
        +新增用户
      </div>
    </div>
    <!-- 弹出层(新增用户&编辑用户) -->
    <el-dialog
      :title="boxType == 1 ? '新增用户' : '编辑用户'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="userForm" ref="ruleForm" id="userForm">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          <el-input v-model="userForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户电话" :label-width="formLabelWidth">
          <el-input v-model="userForm.userCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select
            v-model="userForm.sex"
            :popper-append-to-body="false"
            placeholder="请选择性别"
          >
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作单位" :label-width="formLabelWidth">
          <el-select v-model="userForm.departmentCode" placeholder="请选择">
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.company_name"
              :value="item.company_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="userForm.dateOfBirth"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地区选择">
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
            :append-to-body="false"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" :label-width="formLabelWidth">
          <el-input
            v-model="userForm.residentialAddress"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="userForm.plateform_code" placeholder="请选择角色">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="需求方" value="2"></el-option>
            <el-option label="承接方" value="3"></el-option>
            <el-option label="渠道方" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            id="needs-textarea"
            v-model="userForm.description"
            placeholder="详细描述写在这儿呢~"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewPerson()">{{
          boxType == 1 ? "添 加" : "保存编辑"
        }}</el-button>
      </div>
    </el-dialog>
    <!-- ----------------------暂时不动------------------------ -->
    <el-dialog
      title="添加服务"
      :visible.sync="serviceDialogVisible"
      width="50%"
    >
      <div>
        <span>服务名称</span>
        <el-input
          placeholder="请输入服务名称"
          v-model="service_title"
        ></el-input>
      </div>
      <div style="margin-top: 30px">
        <span>服务数量</span>
        <el-input
          placeholder="请输入服务次数"
          v-model="service_num"
          type="num"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="serviceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="serviceDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#F0F2F5', color: '#222' }"
      stripe
      style="width: 100%"
    >
      <el-table-column type="index" label="编号"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="userCode" label="联系电话"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 0">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色分类">
        <template slot-scope="scope">
          <span v-if="scope.row.plateform_code == 1">管理员</span>
          <span v-else-if="scope.row.plateform_code == 2">需求方</span>
          <span v-else-if="scope.row.plateform_code == 3">承接方</span>
          <span v-else>渠道方</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="getDetails(scope.row)"
            style="color: #01d59a"
            type="text"
            size="small"
            >查看</el-button
          >
          <el-button
            @click="handleClick(scope.row)"
            style="margin-right: 10px"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定要重置该用户的密码吗？"
            trigger="click"
            @onConfirm="resetPwd(scope.row)"
          >
            <el-button
              type="text"
              style="color: #fd9653"
              size="small"
              slot="reference"
              >重置</el-button
            >
          </el-popconfirm>
          <el-button
            @click="addService(scope.row)"
            style="margin-right: 10px"
            type="text"
            size="small"
            title="新增服务"
            v-if="scope.row.plateform_code == 2"
            >新增</el-button
          >
          <el-button
            @click="addService(scope.row)"
            style="margin-right: 10px"
            type="text"
            size="small"
            title="新增价格类型"
            v-if="scope.row.plateform_code == 3"
            >新增</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 用户详情卡片 -->
    <el-dialog title="用户详情" :visible.sync="showCard">
      <el-row class="item-info">
        <span class="title">用户姓名</span>
        <span>{{ userDetailBox.userName }}</span>
      </el-row>
      <el-row class="item-info">
        <span class="title">用户电话</span>
        <span>{{ userDetailBox.userCode }}</span>
      </el-row>
      <el-row class="item-info">
        <span class="title">出生日期</span>
        <span>{{ userDetailBox.dateOfBirth }}</span>
      </el-row>
      <el-row class="item-info">
        <span class="title">详细地址</span>
        <span>{{
          userDetailBox.province +
          userDetailBox.town +
          userDetailBox.district +
          userDetailBox.residentialAddress
        }}</span>
      </el-row>
      <el-row class="item-info">
        <span class="title">详细描述</span>
        <span>{{ userDetailBox.description }}</span>
      </el-row>
      <el-row class="item-info">
        <span class="title">角色分类</span>
        <span v-if="userDetailBox.plateform_code == 1">管理员</span>
        <span v-else-if="userDetailBox.plateform_code == 2">需求方</span>
        <span v-else-if="userDetailBox.plateform_code == 3">承接方</span>
        <span v-else-if="userDetailBox.plateform_code == 4">渠道方</span>
        <span v-else></span>
      </el-row>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
export default {
  data() {
    return {
      CodeToText,
      TextToCode,
      visible: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      serviceDialogVisible: false, // 需求方新增服务弹窗
      formLabelWidth: "80px",
      boxType: null,
      formInline: {
        user: "",
        region: "",
      },
      tableData: [],
      userForm: {
        id: "",
        userName: "",
        userCode: "",
        sex: "0",
        dateOfBirth: "",
        residentialAddress: "",
        plateform_code: "1",
        description: "",
        province: "",
        town: "",
        district: "",
        departmentCode: "",
      },
      companyList: [],
      userDetailBox: [],
      showCard: false,
      options: regionData,
      selectedOptions: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      // 需求方新增服务
      service_title: "",
      service_num: "",
    };
  },
  created() {
    this.fetchList(this.page);
    this.getWorkPlace();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    fetchList(page) {
      const that = this;
      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      that.$http
        .get(
          `/userInfoMobileAction/findUserList?offset=${page}&limit=${this.pageSize}`
        )
        .then((res) => {
          loading.close();
          if (res.data.netCode !== 200) {
            this.$message.error("获取用户列表失败！");
          } else {
            that.tableData = res.data.data;
            that.totalCount = res.data.standbyParams.count;
          }
        });
    },
    getDetails(row) {
      var id = row.id;
      this.$http
        .get(`/userInfoMobileAction/findUserById?id=${id}`)
        .then((res) => {
          if (res.data.netCode == 200) {
            var temList = res.data.data;
            temList.dateOfBirth = this.utils.formatDate11(temList.dateOfBirth);
            this.userDetailBox = res.data.data;
            this.showCard = true;
          }
        });
    },
    handleChange() {
      var loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]] + "/";
      }
      var arry = loc.split("/");
      this.userForm.province = arry[0];
      this.userForm.town = arry[1];
      this.userForm.district = arry[2];
    },
    // 新增用户
    addNewPerson() {
      const that = this;
      if (this.userForm.userName.trim() == "") {
        that.$message.error("请输入用户姓名");
        return false;
      }
      if (this.userForm.userCode.trim() == "") {
        that.$message.error("请输入用户电话！");
        return false;
      }
      if (!/^1\d{10}$/.test(this.userForm.userCode)) {
        that.$message.error("请填写正确的手机号！");
        return false;
      }
      // if (this.userForm.dateOfBirth.trim() == "") {
      //   that.$message.error("请选择出生日期");
      //   return false;
      // }
      if (this.userForm.departmentCode.trim() == "") {
        that.$message.error("请选择工作单位");
        return false;
      }
      if (this.userForm.province.trim() == "") {
        that.$message.error("请选择地区");
        return false;
      }
      if (this.userForm.residentialAddress.trim() == "") {
        that.$message.error("请填写详细地址");
        return false;
      }
      if (this.userForm.description.trim() == "") {
        that.$message.error("请填写详细描述");
        return false;
      }

      this.add();
    },
    add() {
      const that = this;
      that.$http
        .post("/userInfoMobileAction/addUpdateUser", that.userForm)
        .then((res) => {
          if (res.data) {
            if (this.boxType == 1) {
              that.$message({
                type: "success",
                message: "添加用户成功！",
              });
            } else {
              that.$message({
                type: "success",
                message: "编辑用户成功！",
              });
            }
            that.dialogFormVisible = false;
            that.fetchList(this.page);
          }
        });
    },
    // 编辑
    handleClick(row) {
      this.boxType = 2;
      var arr = [row.province, row.town, row.district];
      var arg1 = this.TextToCode[arr[0]].code.toString();
      var arg2 = this.TextToCode[arr[0]][arr[1]].code.toString();
      var arg3 = this.TextToCode[arr[0]][arr[1]][arr[2]].code.toString();
      this.dialogFormVisible = true;
      this.userForm.id = row.id;
      this.userForm.userName = row.userName;
      this.userForm.userCode = row.userCode;
      this.userForm.sex = row.sex;
      this.userForm.dateOfBirth = row.dateOfBirth;
      this.selectedOptions.push(arg1, arg2, arg3);
      this.userForm.province = this.CodeToText[arg1];
      this.userForm.town = this.CodeToText[arg2];
      this.userForm.district = this.CodeToText[arg3];
      this.userForm.residentialAddress = row.residentialAddress;
      this.userForm.plateform_code = row.plateform_code;
      this.userForm.description = row.description;
    },
    resetPwd(row) {
      this.$http
        .get(`/userInfoMobileAction/resetPassword?id=${row.id}`)
        .then((res) => {
          if (res.data) {
            this.$message.success("密码重置成功！");
          } else {
            this.$message.error("密码重置失败，请稍后重试！");
          }
        });
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //  currentPage 改变时会触发
    handleCurrentChange(val) {
      this.page = val;
      this.fetchList(this.page);
    },
    addService(row) {
      this.serviceDialogVisible = true;
      // this.$http.get(`/myServiceMobileAction/submitMyService`)
    },
    // 获取工作单位
    getWorkPlace() {
      this.$http.get(`/companyMobileAction/getCompanyList`).then((res) => {
        if (res.data.netCode == 200) {
          this.companyList = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#userManagerBox {
  background-color: #fff;
  height: 100%;
  padding: 40px 26px;
}
.queryBox {
  position: relative;
  align-items: center;
  .normal {
    height: 48px;
    width: 120px;
    line-height: 48px;
    display: inline-block;
    background-color: #2d6ff5;
    top: 0;
  }
}
.color {
  color: #f5482c;
}
.item-info {
  margin: 20px 0;
  padding-left: 80px;
  .title {
    font-weight: bold;
    width: 10%;
    display: inline-block;
  }
}
</style>
