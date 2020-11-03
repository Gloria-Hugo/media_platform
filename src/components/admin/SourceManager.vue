<template>
  <div id="userManagerBox" class="margin-box">
    <div class="queryBox flex-box">
      <!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="等级:">
          <el-select v-model="formInline.region" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="范围:">
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
      </el-form> -->
      <div class="btns normal" @click="dialogFormVisible = true">+新增</div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#F0F2F5', color: '#222' }"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="编号"></el-table-column>
      <el-table-column prop="channel_name" label="名称"></el-table-column>
    </el-table>
    <!-- 新增渠道的box -->
    <el-dialog title="添加平台" :visible.sync="dialogFormVisible">
      <el-input
        v-model="channel_name"
        class="border"
        placeholder="请输入平台名称"
        autocomplete="off"
        @input="changeIpt"
      ></el-input>
      <div class="el-upload__tip" style="margin: 15px 0" v-if="showUpload">
        请上传官方图片
      </div>
      <el-upload
        action="string"
        list-type="picture-card"
        :headers="{ 'Content-Type': 'multipart/form-data;charset=UTF-8' }"
        accept=".png,.jpg"
        :limit="1"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :before-preview="handlePreview"
        v-if="showUpload"
        ref="upload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>

      <el-dialog :visible.sync="uploadImgdialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
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
export default {
  data() {
    return {
      channel_name: "",
      dialogFormVisible: false,
      tableData: [],
      loading: false,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      uploadImgdialogVisible: false, // 上传图片时的加载进度框
      dialogImageUrl: "",
      showUpload: false,
    };
  },
  created() {
    this.fetchList(this.page);
  },
  methods: {
    async fetchList(page) {
      const that = this;
      that.loading = true;
      const { data: res } = await this.$http.get(
        `/channelMobileAction/getChannelList?offset=${page}&limit=${this.pageSize}`
      );
      if (res.netCode == 200) {
        this.tableData = res.data;
        this.totalCount = res.standbyParams.count;
      } else {
        this.tableData = [];
      }
      this.loading = false;
    },
    confirm() {
      if (this.channel_name.trim() == "") {
        this.$message.error("名称不能为空！");
        return false;
      }
      this.$refs.upload.submit();
      this.dialogFormVisible = false;
      this.fetchList(this.page);
      this.channel_name = ""
    },
    // 监听表单事件
    changeIpt(e) {
      console.log(e);
      if (e.trim() == "") {
        this.showUpload = false;
      } else {
        this.showUpload = true;
      }
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // uploadImg(files) {
    //   const formData = new FormData();
    //   formData.append("files", files.file);
    //   formData.append("channel_name", this.channel_name);
    //   formData.append("created_by", sessionStorage.getItem("userName"));
    //   // this.$http
    //   //   .post(`/channelMobileAction/submitChannel`, formData)
    //   //   .then((res) => {
    //   //     if (res.data.netCode == 200) {
    //   //       this.$message.success("操作成功！");
    //   //       this.dialogFormVisible = false;
    //   //       this.fetchList(this.page);
    //   //     } else {
    //   //       this.$message.error("服务异常，请稍后再试！");
    //   //     }
    //   //   });
    // },
    beforeUpload(file) {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("channel_name", this.channel_name);
      formData.append("created_by", sessionStorage.getItem("userName"));
      this.$http
        .post(`/channelMobileAction/submitChannel`, formData)
        .then((res) => {
          if (res.data.netCode == 200) {
            this.$message.success("操作成功！");
          } else {
            this.$message.error("服务异常，请稍后再试！");
          }
        });
      return true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //  currentPage 改变时会触发
    handleCurrentChange(val) {
      this.page = val;
      this.fetchList(this.page);
    },
  },
};
</script>

<style lang="less" scoped>
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
.border {
  border-radius: 8px;
  border: 1px solid #ccc;
  overflow: hidden;
}
</style>