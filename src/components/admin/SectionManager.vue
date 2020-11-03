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
      <div
        class="btns normal"
        @click="
          dialogVisible = true;
          editOrCreat = false;
        "
      >
        +新增
      </div>
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
      <el-table-column prop="company_name" label="单位名称"></el-table-column>
      <el-table-column
        prop="service_pack_name"
        label="服务套餐"
      ></el-table-column>
      <el-table-column
        prop="service_pack_price"
        label="套餐价格"
      ></el-table-column>
      <el-table-column
        prop="service_date"
        label="服务截至日期"
      ></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="editClick(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <!-- <el-button
            type="text"
            style="color: #f5482c"
            class="color"
            size="small"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建修改单位的弹窗 -->
    <el-dialog
      :title="editOrCreat ? '修改单位' : '新增单位'"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form :model="workParams">
        <el-form-item
          label="单位名称"
          style="width: 80%; border-radius: 4px"
        >
          <el-input
            style="width: 50%"
            v-model="workParams.company_name"
            autocomplete="off"
            placeholder="请输入单位名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="type_id"
          label="服务套餐"
          style="margin-top: 30px; width: 80%; border-radius: 4px"
        >
          <el-select
            v-model="workParams.service_pack_id"
            placeholder="请选择套餐类型"
          >
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.service_pack_name + item.service_pack_price"
              :value="item.service_pack_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  style="width:80%;margin-top:30px;border-radius: 4px">
            <el-date-picker
              type="date"
              placeholder="请选择服务截止日期"
              v-model="workParams.service_date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :picker-options="expireTimeOption"
            ></el-date-picker>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearAll">取 消</el-button>
        <el-button type="primary" @click="addSection">确 定</el-button>
      </span>
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
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now();
        },
      },
      dialogVisible: false,
      editOrCreat: null,
      tableData: [],
      typeList: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      workParams: {
        company_id: "",
        service_pack_id: "",
        company_name: "",
        service_date:''
      },
      loading:false
    };
  },
  created() {
    this.fetchList(this.page);
    this.getTypeList();
  },
  methods: {
    async fetchList(page) {
      this.loading = true
      const { data: res } = await this.$http.get(
        `/companyMobileAction/getCompanyList?offset=${page}&limit=${this.pageSize}`
      );
      if (res.netCode == 200) {
        let templist = res.data
        for(var i=0;i<templist.length;i++){
          templist[i].service_date = templist[i].service_date.substr(0,10)
        }
        this.tableData = templist;
        this.totalCount = res.standbyParams.count;
      } else {
        this.$message.error("列表获取失败！");
        this.tableData = [];
      }
      this.loading = false
    },
    getTypeList() {
      this.$http
        .get(`/servicePackMobileAction/getServicePackList`)
        .then((res) => {
          if (res.data.netCode == 200) {
            this.typeList = res.data.data;
          } else {
            this.typeList = [];
          }
        });
    },
    // 编辑赋值操作
    editClick(row) {
      this.editOrCreat = true;
      this.$nextTick(() => {
        this.workParams.company_id = row.company_id;
        this.workParams.service_pack_id = row.service_pack_id;
        this.workParams.company_name = row.company_name;
        this.workParams.service_date = row.service_date;
      });
      this.dialogVisible = true;
    },
    // 编辑新增单位
    addSection() {
      if (this.workParams.company_name.trim() == "") {
        this.$message.error("单位名称不能为空！");
        return false;
      }
      if (this.workParams.service_pack_id.trim() == "") {
        this.$message.error("请选择套餐类型！");
        return false;
      }
      this.$http
        .post(`/companyMobileAction/submitCompany`, this.workParams)
        .then((res) => {
          if (res.data.netCode == 200) {
            this.$message.success("操作成功！");
            this.fetchList(this.page);
          } else {
            this.$message.error("操作失败，请稍后重试！");
          }
          this.clearAll();
        });
    },
    clearAll() {
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.workParams.company_id = "";
        this.workParams.service_pack_id = "";
        this.workParams.company_name = "";
        this.workParams.service_date = "";
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
</style>
