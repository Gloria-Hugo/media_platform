<template>
  <div class="margin-box project-box">
    <div class="queryBox flex-box">
      <div class="searchBox">
        <div class="queryIpt">
          <span>关键字 :</span>
          <input
            type="text"
            placeholder="关键字查询"
            placeholder-class="placehoder"
          />
        </div>
        <div class="btns querybtn">查询</div>
      </div>
      <div
        class="btns normal"
        @click="
          servicePkgdialogVisible = true;
          diffrent = 1;
        "
      >
        +新增方案
      </div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#F0F2F5', color: '#222' }"
      stripe
      style="width: 100%"
      @expand-change="expandChange"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      v-loading="loading"
    >
      <el-table-column type="expand">
        <template slot-scope="prop">
          <el-button type="primary" @click="clicks(prop)"
            >新增服务项目</el-button
          >
          <el-table
            :data="packageList"
            style="width: 100%"
            height="350"
            :header-cell-style="{ background: '#F0F2F5', color: '#222' }"
            v-loading="expandLoding"
          >
            <el-table-column prop="service_name" label="可服务项目">
            </el-table-column>
            <el-table-column prop="service_num" label="服务次数">
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  @click="editServiceItem(scope.row)"
                  type="text"
                  size="small"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>            
      <el-table-column type="index" label="编号"></el-table-column>
      <el-table-column
        prop="service_pack_name"
        label="服务方案名称"
      ></el-table-column>
      <el-table-column prop="service_pack_price" label="价格"></el-table-column>
      <el-table-column prop="created_by" label="创建人"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="editCurrentService(scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 这里是新增修改服务包的弹窗 -->
    <el-dialog
      :title="diffrent == 1 ? '添加服务包' : '编辑服务包'"
      :visible.sync="servicePkgdialogVisible"
      :show-close="false"
      width="50%"
    >
      <el-form :model="servicePkgForm" ref="servicePkgForm">
        <el-form-item label="服务名称" prop="service_pack_name">
          <el-input
            v-model="servicePkgForm.service_pack_name"
            autocomplete="off"
            placeholder="请输入要添加的服务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务名称" prop="service_pack_content">
          <el-input
            v-model="servicePkgForm.service_pack_content"
            autocomplete="off"
            placeholder="请输入服务内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务价格" prop="service_pack_price">
          <el-input
            v-model="servicePkgForm.service_pack_price"
            autocomplete="off"
            placeholder="请填写价格"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearAll">取 消</el-button>
        <el-button type="primary" @click="addCurrentService()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 这里是新增或者修改服务包服务的弹窗 -->
    <el-dialog
      :title="editOrCreat ? '编辑服务项目' : '新增服务项目'"
      :show-close="false"
      :visible.sync="itemsdialogVisible"
      width="30%"
    >
      <el-form :model="serviceItemForm">
        <el-form-item label="服务名称" prop="service_pack_name">
          <el-input
            style="width: 50%"
            v-model="serviceItemForm.service_name"
            autocomplete="off"
            placeholder="请输入要添加的服务名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="服务数量"
          prop="service_pack_content"
          style="margin-top: 20px; margin-bottom: 10px !important"
        >
          <el-input-number
            style=""
            v-model="serviceItemForm.service_num"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="type_id" label="服务类型">
          <el-select v-model="serviceItemForm.type_id" placeholder="请选择类型">
            <el-option
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.type_name"
              :value="item.type_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearAll()">取 消</el-button>
        <el-button type="primary" @click="addItemPkg()">确 定</el-button>
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
const adminUser = sessionStorage.getItem("userName");
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      packageList: [],
      servicePkgdialogVisible: false, //控制新增修改服务包的弹窗
      itemsdialogVisible: false, //控制新增修改包服务包的弹窗
      servicePkgForm: {
        service_pack_id: "",
        service_pack_name: "",
        service_pack_content: "",
        service_pack_price: "",
        created_by: adminUser,
      },
      serviceItemForm: {
        service_id: "",
        service_pack_id: "",
        type_id: "",
        service_name: "",
        service_num: 1,
        created_by: adminUser,
      },
      diffrent: null,
      editOrCreat: null,
      typeList: [], // 类型数据
      expands: [], // 表单单行展开
      getRowKeys(row) {
        return row.service_pack_id;
      },
      isExpanded: false, //是否展开列表
      expandLoding:false, //展开列表的loading
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
        `/servicePackMobileAction/getServicePackList?offset=${page}&limit=${this.pageSize}`
      );
      if (res.netCode == 200) {
        this.tableData = res.data;
        this.totalCount = res.standbyParams.count;
      } else {
        this.$message.error("列表获取失败！");
        this.tableData = [];
      }
      this.loading = false
    },
    // 获取类型
    getTypeList() {
      this.$http.get(`/typeMobileAction/getTypeList`).then((res) => {
        if (res.data.data.length) {
          this.typeList = res.data.data;
        } else {
          this.typeList = [];
        }
      });
    },
    // 根据id查询服务包详情
    expandChange(row, expandedRows) {
      const that = this;
      if (expandedRows.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.service_pack_id); // 每次push进去的是每行的ID
        }
      } else {
        that.expands = []; // 默认不展开
      }
      that.isExpanded = !that.isExpanded;
      that.packageList = []
      that.expandLoding = true
      if (this.isExpanded) {
        that.$http
          .get(
            `/servicePackMobileAction/getServiceList?service_pack_id=${row.service_pack_id}`
          )
          .then((res) => {
            if (res.data.data) {
              that.packageList = res.data.data;
            } else {
              that.packageList = [];
            }
            that.expandLoding = false
          });
      }
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
    // 校验表单
    addCurrentService() {
      if (this.servicePkgForm.service_pack_name.trim() == "") {
        this.$message.error("请输入服务包名称");
        return false;
      }
      if (this.servicePkgForm.service_pack_content.trim() == "") {
        this.$message.error("请输入服务内容");
        return false;
      }
      if (this.servicePkgForm.service_pack_price.trim() == "") {
        this.$message.error("请输入服务价格");
        return false;
      }
      this.add();
    },
    // 服务包编辑的时候
    editCurrentService(row) {
      this.diffrent = 2;
      this.$nextTick(() => {
        this.servicePkgForm.service_pack_name = row.service_pack_name;
        this.servicePkgForm.service_pack_content = row.service_pack_content;
        this.servicePkgForm.service_pack_price = row.service_pack_price;
        this.servicePkgForm.service_pack_id = row.service_pack_id;
        this.servicePkgForm.created_by = row.created_by;
      });

      this.servicePkgdialogVisible = true;
    },
    add() {
      if (this.diffrent == 1) {
        this.servicePkgForm.service_pack_price =
          this.servicePkgForm.service_pack_price + "/年";
      }
      this.$http
        .post(`/servicePackMobileAction/submitServicePack`, this.servicePkgForm)
        .then((res) => {
          if (res.data.netCode == 200) {
            this.$message.success("操作成功！");
            this.clearAll();
            this.fetchList(this.page);
          } else {
            this.$message.error("操作失败，请稍后重试！");
            this.servicePkgdialogVisible = false;
          }
        });
    },
    clearAll() {
      this.servicePkgdialogVisible = false;
      this.itemsdialogVisible = false;
      this.$nextTick(() => {
        this.servicePkgForm.service_pack_name = "";
        this.servicePkgForm.service_pack_content = "";
        this.servicePkgForm.service_pack_price = "";
        this.servicePkgForm.service_pack_id = "";
        this.servicePkgForm.created_by = "";
        this.serviceItemForm.service_name = "";
        this.serviceItemForm.service_num = "";
        this.serviceItemForm.type_id = "";
        this.serviceItemForm.service_id = "";
        this.serviceItemForm.service_pack_id = "";
        this.serviceItemForm.created_by = "";
      });
    },
    clicks(prop) {
      this.editOrCreat = false;
      this.serviceItemForm.service_pack_id = prop.row.service_pack_id;
      this.itemsdialogVisible = true;
    },
    // 校验表单-->发起post请求
    addItemPkg() {
      if (this.serviceItemForm.service_name.trim() == "") {
        this.$message.error("请输入服务项目名称！");
        return false;
      }
      if (this.serviceItemForm.type_id == "") {
        this.$message.error("请选择服务类型！");
        return false;
      }
      this.$http
        .post(`/servicePackMobileAction/submitService`, this.serviceItemForm)
        .then((res) => {
          if (res.data.netCode == 200) {
            this.$message.success("操作成功！");
            this.itemsdialogVisible = false;
            this.expandChange();
          } else {
            this.$message.error("操作失败,请稍后重试！");
            this.itemsdialogVisible = false;
          }
        });
    },
    // 编辑服务包的内容
    editServiceItem(row) {
      this.editOrCreat = true;
      this.$nextTick(() => {
        this.serviceItemForm.service_name = row.service_name;
        this.serviceItemForm.service_num = row.service_num;
        this.serviceItemForm.type_id = row.type_id;
        this.serviceItemForm.service_id = row.service_id;
        this.serviceItemForm.service_pack_id = row.service_pack_id;
        this.serviceItemForm.created_by = row.created_by;
      });
      this.itemsdialogVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.project-box {
  background-color: #fff;
  padding: 40px 26px;
}
.normal {
  background-color: #2d6ff5;
  width: 120px;
  height: 48px;
  line-height: 48px;
}
.el-table__body-wrapper::-webkit-scrollbar {
  /*width: 0;宽度为0隐藏*/
  width: 0px !important;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 2px;
  height: 50px;
  background: #eee;
}
.el-table__body-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.4);
}
</style>