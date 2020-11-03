<template>
  <div class="margin-box">
    <!-- 顶部盒子 -->
    <div class="flex-box count-box">
      <div>
        <span class="mini-title">可结算：</span>
        <div class="price">
          {{ settleable }}
          <span>元</span>
        </div>
      </div>
      <div style="text-align: center">
        <span class="mini-title">待结算：</span>
        <div class="price" style="color: #252729">
          {{ toBeSettled }}
          <span>元</span>
        </div>
      </div>
      <div>
        <div class="btns apply">
          <el-button
            :disabled="prevent"
            style="background: rgb(245, 72, 44); color: #fff"
            @click="apply"
            >申请结算</el-button
          >
        </div>
        <!-- <p>每月15日自动统计结算上月所完成的任务需求金额</p> -->
      </div>
    </div>
    <!-- 表单 -->
    <div class="form-box">
      <div
        class="title-name"
        style="font-size: 18px; font-weight: bold; margin-top: 0"
      >
        明细
      </div>
      <div class="queryBox flex-box" style="margin-bottom: 30px">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="分类:">
            <el-select v-model="status" placeholder="请选择" @change="choose()">
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
        <el-table-column prop="demand_name" label="需求名称"></el-table-column>
        <el-table-column prop="end_date" label="完成时间"></el-table-column>
        <el-table-column prop="demand_money" label="结算金额"></el-table-column>
        <el-table-column prop="demand_state" label="状态">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" style="color:#949AA6" type="text" size="small">已支付</el-button> -->
            <!-- <el-button type="text" size="small">查看回执</el-button> -->
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
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="100">
          <template>
            <el-button
              type="text"
              style="color: #f5482c"
              class="color"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
      v-if="totalCount!==0"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入组件
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      status: "",
      prevent: false,
      statusId: 0,
      tableData: [],
      type: [
        { name: "全部", value: 0 },
        { name: "待结算", value: 3 },
        { name: "已结算", value: 5 },
      ],
      settleable: 0,
      toBeSettled: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      loading:false
    };
  },
  created() {
    this.status = this.type[0].value;
    this.setMoney();
    this.getSetllementDemandList(this.status, this.page);
  },
  methods: {
    async setMoney() {
      let token = sessionStorage.getItem("userName");
      const { data: res } = await this.$http.get(
        `/statisticsMobileAction/settlementDemand?type=1&accept_by=${token}`
      );
      if (res.netCode == 200) {
        this.settleable = res.standbyParams.settleable;
        this.toBeSettled = res.standbyParams.toBeSettled;
      }
    },
    async getSetllementDemandList(status, page) {
      this.loading = true
      let token = sessionStorage.getItem("userName");
      const { data: res } = await this.$http.get(
        `/demandMobileAction/getSettlementDemandList?type=3&user_code=${token}&state=${status}&offset=${page}&limit=${this.pageSize}`
      );
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].end_date = res.data[i].end_date.substr(0, 10);
        }
        this.tableData = res.data;
        this.totalCount = res.standbyParams.count;
      }
      this.loading = false
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
    // 下拉框选择事件
    choose() {
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
    async apply() {
      let token = sessionStorage.getItem("userName");
      const { data: res } = await this.$http.get(
        `/messageMobileAction/addSettlementMessage?demand_id=&money=${this.settleable}&user_code=${token}`
      );
      if (res.netCode == 200) {
        this.$message.success("操作成功！");
        this.prevent = true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.count-box {
  width: 100%;
  padding: 46px 40px;
  background: #ffffff;
  & div {
    flex: 33.3333333333%;
    .mini-title {
      font-size: 8px;
      font-weight: 500;
      color: #252729;
    }
    .price {
      margin-top: 10px;
      font-size: 48px;
      font-weight: 500;
      color: #f5482d;
      span {
        font-size: 8px;
        font-weight: 500;
      }
    }
    .apply {
      width: 80px;
      height: 36px;
      background: #f5482c;
      line-height: 36px;
      font-size: 14px;
      font-weight: 500;
      margin-left: auto;
      margin-bottom: 27px;
      border-radius: 4px;
    }
    p {
      text-align: right;
      color: #949aa6;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.form-box {
  margin-top: 30px;
  padding: 30px;
  background-color: #fff;
}
</style>