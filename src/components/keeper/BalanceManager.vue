<template>
  <div id="userManagerBox" class="margin-box">
    <div class="queryBox flex-box">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="分类:">
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="(item, index) in type"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
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
      <div class="btns normal" @click="exportExcel">导出数据</div>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#F0F2F5', color: '#222' }"
      stripe
      style="width: 100%"
      id="myData"
      v-loading="loading"
    >
      <el-table-column type="index" label="编号"></el-table-column>
      <el-table-column prop="demand_code" label="需求编号"></el-table-column>
      <el-table-column prop="demand_name" label="需求名称 "></el-table-column>
      <el-table-column prop="created_name" label="需求单位 "></el-table-column>
      <el-table-column prop="accept_name" label="承接方"></el-table-column>
      <el-table-column prop="demand_money" label="承接方费用">
        <template slot-scope="scope">
          <div class="weight">
            {{ "￥" + scope.row.demand_money }}
          </div>
          <div
            v-if="scope.row.manuscript_state == 3"
            class="blue hover"
            @click="showBox(1,scope.row)"
          >
            待结算
          </div>
          <!-- settlementAcceptDemand(scope.row) -->
          <div v-if="scope.row.manuscript_state == 5" class="color">已结算</div>
        </template>
      </el-table-column>
      <el-table-column prop="channel_name" label="渠道方"></el-table-column>
      <el-table-column prop="channel_money" label="渠道方费用">
        <template slot-scope="scope">
          <div class="weight">
            {{ "￥" + scope.row.channel_money }}
          </div>
          <div
            v-if="scope.row.channel_state == 2"
            class="blue hover"
            @click="showBox(2,scope.row)"
          >
            待结算
          </div>
          <!-- settlementChannelDemand(scope.row) -->
          <div v-if="scope.row.channel_state == 3" class="color">已结算</div>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="end_date" label="完成时间"></el-table-column> -->
      <!-- <el-table-column prop="demand_state" label="状态">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" style="color:#949AA6" type="text" size="small">已支付</el-button>
          <el-button type="text" size="small">查看回执</el-button>
          <el-button
            v-if="scope.row.manuscript_state == 3"
            type="text"
            size="small"
            style="color: #949aa6"
            >待结算</el-button
          >
          <el-button
            v-else-if="scope.row.manuscript_state == 5"
            type="text"
            size="small"
            style="color: #949aa6"
            >已结算</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="50%">
       <span>是否确认结算？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="Query">确 定</el-button>
      </span>
    </el-dialog>
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
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      status: "",
      statusId: 0,
      tableData: [],
      type: [
        { name: "全部", value: 0 },
        { name: "待结算", value: 1 },
        { name: "已结算", value: 2 },
      ],
      dialogVisible:false,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      TypeId:null,
      row:{
        demand_id: null,
        channel_by:null,
        accept_by:null,
      }
    };
  },
  created() {
    this.status = this.type[0].value;
    this.getSetllementDemandList(this.status, this.page);
  },
  methods: {
    onSubmit() {
      this.getSetllementDemandList(this.status, this.page);
    },
    // 获取结算列表
    async getSetllementDemandList(status, page) {
      this.loading = true;
      const { data: res } = await this.$http.get(
        `/demandMobileAction/getSettlementDemandList?type=1&user_code=&state=${status}&offset=${page}&limit=${this.pageSize}`
      );
      if (res.netCode == 200) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].end_date = res.data[i].end_date.substr(0, 10);
        }
        this.tableData = res.data;
        this.totalCount = res.standbyParams.count;
      } else {
        this.tableData = [];
        this.totalCount = 0;
      }
      this.loading = false;
    },
    // 导出表格
    exportExcel() {
      /* out-table关联导出的dom节点  */
      var wb = XLSX.utils.table_to_book(document.querySelector("#myData"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "结算数据.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 管理员传操作承接方结算
    async settlementAcceptDemand(row) {
      const { data: res } = await this.$http.get(
        `/statisticsMobileAction/settlementAcceptDemand?demand_id=${row.demand_id}&receive_by=${row.accept_by}`
      );
      if (res.netCode == 200) {
        this.$message.success(res.subMessage);
        this.getSetllementDemandList(this.status, this.page);
      } else {
        this.$message.error("服务异常，操作失败！");
      }
      this.dialogVisible = false
    },
    async settlementChannelDemand(row) {
      const { data: res } = await this.$http.get(
        `/statisticsMobileAction/settlementChannelDemand?demand_id=${row.demand_id}&receive_by=${row.channel_by}`
      );
      if (res.netCode == 200) {
        this.$message.success(res.subMessage);
        this.getSetllementDemandList(this.status, this.page);
      } else {
        this.$message.error("服务异常，操作失败！");
      }
      this.dialogVisible = false
    },
    showBox(num,row){
      this.row.channel_by = row.channel_by
      this.row.demand_id = row.demand_id
      this.row.accept_by = row.accept_by;
      this.TypeId = num;
      this.dialogVisible = true;
    },
    Query(){
      
      if(this.TypeId==1){
        this.settlementAcceptDemand(this.row)
      }else{
        this.settlementChannelDemand(this.row)
      }
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    //  currentPage 改变时会触发
    handleCurrentChange(val) {
      this.page = val;
      this.getSetllementDemandList(this.status, this.page);
    },
    onSubmit() {
      this.getSetllementDemandList(this.status, this.page);
    },
  },
};
</script>

<style lang="less" scoped>
.color {
  color: #949aa6 !important;
}
.blue {
  color: #2c6ef5 !important;
}
.weight {
  font-weight: bold !important;
}
</style>