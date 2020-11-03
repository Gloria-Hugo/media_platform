<template>
  <div id="content-box">
    <!-- 顶部切换栏 -->
    <div class="changeBar flex-box">
      <div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          text-color="#666666"
          active-text-color="#333333"
          active="1"
        >
          <el-menu-item
            :index="item.status"
            v-for="(item, index) in tabItem"
            :key="index"
            @click="clickTab(item.status)"
            >{{ item.value }}</el-menu-item
          >
        </el-menu>
      </div>
      <div class="searchBox">
        <div class="queryIpt">
          <span>需求编号 :</span>
          <input
            type="text"
            placeholder="请输入需求编号"
            placeholder-class="placehoder"
            v-model="demand_code"
            @keyup.enter="search"
          />
        </div>
        <div class="btns querybtn" @click="search">查询</div>
      </div>
    </div>
    <!-- 搜索结果区域 -->
    <el-dialog title="查询结果" :visible.sync="dialogVisible" width="50%">
      <p v-if="loading">正在查询...</p>
      <p class="tips" v-else>
        共查询到了<strong>{{infoCount}}</strong>条结果。
      </p>
      <el-table :data="searchInfo" stripe style="width: 100%" height="300" v-loading="loading">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="demand_code" label="需求编号" width="180">
        </el-table-column>
        <el-table-column prop="demand_name" label="需求名称"> </el-table-column>
        <el-table-column prop="type_name" label="需求类型"> </el-table-column>
        <el-table-column prop="release_platform_name" label="发布平台"> </el-table-column>
        <el-table-column fixed="right" label="操作"> 
          <template slot-scope="scope">
            <el-button  
            @click="toDeatils(scope.row.demand_id)"
            style="color: #01d59a"
            type="text"
            size="small"
            title="查看详情">查看</el-button>
            <el-button  
            style="color: #F5472C"
            type="text"
            size="small"
            title="删除需求" slot="reference"  v-if="scope.row.demand_state==6" @click="showDelete(scope.row.demand_name,scope.row.demand_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 内容区域 -->
    <div class="centerBox clearfix" v-loading="blocksLoading">
      <div v-if="blocks.length">
        <div
          class="blocks"
          v-for="(item, i) in blocks"
          :key="i"
          @click="toDeatils(item.demand_id)"
        >
          <!-- <el-popconfirm
            confirmButtonText="确认"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="确定删除该需求吗"
            @onConfirm="deleteDemand(item.demand_id)"
          > -->
            <div class="delete hover" v-if="item.demand_state==6" @click.stop="showDelete(item.demand_name,item.demand_id)" slot="reference">×</div>
          <!-- </el-popconfirm> -->
          <h5>{{ item.demand_name }}</h5>
          <p>
            {{ item.demand_content }}
          </p>
          <div class="mini-box">
            <span>{{ item.release_platform_name }}</span>
            <span class="line"></span>
            <span>截至{{ item.end_date }}</span>
            <span class="line"></span>
            <span class="shangxian">{{ item.type_name }}</span>
            <span class="fujian" v-if="item.demand_annex">
                <i class="iconfont icon-fujian"></i>
              附件
            </span>
          </div>
          <div class="launch-status flex-box">
            <span>{{ item.created_date }}</span>
            <span class="status" v-if="item.demand_state == 1">待分派</span>
            <span class="status" v-else-if="item.demand_state == 2"
              >待接单</span
            >
            <span class="status" v-else-if="item.demand_state == 3"
              >待交稿</span
            >
            <span class="status" v-else-if="item.demand_state == 4"
              >待审核</span
            >
            <span class="status" v-else-if="item.demand_state == 5"
              >待上线</span
            >
            <span class="status" v-else-if="item.demand_state == 6"
              >已完成</span
            >
          </div>
        </div>
      </div>
      <p class="nodata" v-else>暂无数据</p>
    </div>
      <!-- 分页 -->
      <!-- 删除需求的弹窗 -->
      <el-dialog title="提示"
                 :visible.sync="deletsDialogVisible"
                 width="30%">
         <span>确定删除“{{demandName}}”需求吗？</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="deletsDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="deleteDemand">确 定</el-button>
        </span>
      </el-dialog>
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
export default {
  name: "needs",
  data() {
    return {
      blocks: [],
      activeIndex: "",
      demand_code: "",
      tabItem: [
        { status: "", value: "全部" },
        { status: "1", value: "待分派" },
        { status: "2", value: "待接单" },
        { status: "3", value: "待交稿" },
        { status: "4", value: "待审核" },
        { status: "5", value: "待上线" },
        { status: "6", value: "已完成" },
      ],
      dialogVisible: false,
      loading: false,
      searchInfo: [],
      infoCount:0,
      fullUrl: '',
      page: 1,
      pageSize: 12,
      totalCount: 0,
      blocksLoading:false,
      deletsDialogVisible:false,
      demandName:"",
      demandId:'',
      statusCode: sessionStorage.getItem("statusCode"),
      departmentCode:sessionStorage.getItem("departmentCode")
    };
  },
  created() {
    this.fetchList(this.page);
  },
  methods: {
    // 获取需求列表
    fetchList(page) {
      const that = this;
      this.blocksLoading = true
      let status = sessionStorage.getItem("statusCode");
      let dcode = sessionStorage.getItem("departmentCode");
      that.$http
        .get(
          `/demandMobileAction/getDemandList?type=${status}&user_code=${dcode}&demand_state=${this.activeIndex}&offset=${page}&limit=${this.pageSize}`
        )
        .then(
          (res) => {
            if (res.data.netCode !== 200) {
              this.$message.error("获取列表失败！");
            } else {
              this.totalCount = res.data.standbyParams.count;
              var templist = res.data.data;
              if (templist) {
                for (let i = 0; i < templist.length; i++) {
                  templist[i].end_date = templist[i].end_date.substr(0, 10);
                  templist[i].created_date = this.utils.getDateDiff(
                    templist[i].created_date
                  );
                }
                that.blocks = templist;
              }else{
                that.block = []
              }
              that.blocksLoading = false
            }
          },
          (err) => {
            console.log(err);
            that.blocks = [];
          }
        );
    },
    // 点击tab栏获取不同状态的数据
    clickTab(status) {
      this.activeIndex = status;
      this.fetchList(this.page);
    },
    async deleteDemand() {
      const that = this;
      const { data: res } = await this.$http.get(
        `/demandMobileAction/deleteDemand?demand_id=${this.demandId}`
      );
      // this.dialogVisible = false
      this.deletsDialogVisible = false
      this.search()
      this.fetchList(this.page);
    },
    showDelete(name,id){
      this.demandName = name;
      this.demandId = id;
      this.deletsDialogVisible = true
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
    // 当用户点击查询的时候
    search() {
      if (this.demand_code.trim() == "") {
        return false;
      }
      this.dialogVisible = true;
      this.loading = true;
      this.$http
        .get(
          `/demandMobileAction/searchDemandList?type=${this.statusCode}&user_code=${this.departmentCode}&demand_code=${this.demand_code}`
        )
        .then((res) => {
          if (res.data.netCode == 200) {
            let templist = res.data.data
            this.infoCount = res.data.standbyParams.count
            if(templist){
              // for(var i=0;i<templist.length;i++){
              //   templist[i].end_date = templist[i].end_date.substr(0,10)
              // }
              this.searchInfo = templist;
            }
            
          } else {
            this.searchInfo = [];
          }
          this.loading = false;
        });
    },
    // 去往需求详情页面 N202010260002
    toDeatils(id) {
      this.$router.push({
        path: "/demand/needsdetail",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>