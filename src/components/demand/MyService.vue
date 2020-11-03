<template>
  <!-- vue实例外创建 -->
  <div class="serveBox" id="temp">
    <div class="title-name">我的服务</div>
    <el-card shadow="hover">
      <el-row class="rowHeader">
        <el-col :span="6"><div class="text-center">服务名称</div></el-col>
        <el-col :span="6"><div class="text-center">价格</div></el-col>
        <el-col :span="6"><div class="text-center">服务到期时间</div></el-col>
        <el-col :span="6"><div class="text-center">状态</div></el-col>
      </el-row>
      <el-row class="rowContent" v-if="detailData">
        <el-col :span="6"
          ><div class="text-center">
            {{
              detailData.service_pack_name
                ? detailData.service_pack_name
                : "xxx"
            }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="text-center">
            {{
              detailData.service_pack_price
                ? "￥" + detailData.service_pack_price
                : "0"
            }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="text-center">
            {{ detailData.service_date ? detailData.service_date : "xxx" }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="text-center">
            {{ stateOfserviceStatus }}
          </div></el-col
        >
      </el-row>
    </el-card>
    <div class="title-name" style="margin-top: 40px">服务详情</div>
    <el-table
      :data="myService"
      :header-cell-style="{ background: '#F0F2F5', color: '#222' }"
      id="tableHeader"
      style="width: 100%"
      height="500"
      stripe
      v-loading="loading"
    >
      <el-table-column type="index" label="编号"></el-table-column>
      <el-table-column prop="service_name" label="服务名称"></el-table-column>
      <el-table-column prop="service_num" label="服务总次数"></el-table-column>
      <el-table-column
        prop="service_use_num"
        label="已使用服务次数"
      ></el-table-column>
    </el-table>

  </div>
</template>

<script>
// 0无服务，1服务中，2服务到期
const service_status = {
  0: "暂无服务",
  1: "服务中",
  2: "服务到期",
};
export default {
  data() {
    return {
      myService: [],
      detailData: [],
      loading:false
    };
  },
  computed: {
    stateOfserviceStatus() {
      return service_status[this.detailData.service_start];
    },
  },
  created() {
    this.fetchMyService();
  },
  methods: {
    fetchMyService() {
      const that = this;
      this.loading = true
      that.$http
        .get(
          `/companyMobileAction/getMyServiceList?departmentCode=${sessionStorage.getItem(
            "departmentCode"
          )}`
        )
        .then(
          (res) => {
            if (res.data.netCode !== 200) {
              this.$message.error("服务列表获取失败");
            } else {
              res.data.data.service_date = res.data.data.service_date.substr(
                0,
                10
              );
              this.detailData = res.data.data;
              var list = res.data.standbyParams.listService;
              if (list.length) {
                this.myService = list;
              } else {
                this.myService = [];
              }
              this.loading = false
            }
          },
          (error) => {
            if (error) {
              this.$message.error("服务信息获取失败！");
            }
            console.log(error);
          }
        );
    }
  },
};
</script>
<style lang="less" scoped>
.serveBox {
  margin: 30px;
  padding: 30px;
  margin-bottom: 0;
  padding-bottom: 0;
  background-color: #fff;

}
.title-name {
  margin-top: 0;
}
.el-table__header-wrapper {
  background: #fbfbfb !important;
}
.el-table__header {
  background: #fbfbfb !important;
}
#tableHeader {
  background: #fbfbfb !important;
}
#temp .el-table__row:first-child {
  background: red !important;
}
#temp .el-card {
  border: none !important;
}
.text-center {
  text-align: center;
  color: #222;
  font-size: 14px;
  font-weight: 400;
}
.rowHeader {
  height: 40px;
  line-height: 40px;
  background-color: #fbfbfb;
}
.rowContent {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e5e5e5;
  .text-center {
    font-weight: bold;
  }
}
</style>