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
          <span>稿件编号 :</span>
          <input
            type="text"
            placeholder="请输入稿件编号"
            v-model="demand_code"
            @keyup.enter="search"
            placeholder-class="placehoder"
          />
        </div>
        <div class="btns querybtn" @click="search">查询</div>
      </div>
    </div>
    <!-- 搜索结果区域 -->
    <el-dialog title="查询结果" :visible.sync="dialogVisible" width="50%">
      <p v-if="loading">正在查询...</p>
      <p class="tips" v-else>
        共查询到了<strong>{{ infoCount }}</strong
        >条结果。
      </p>
      <el-table
        :data="searchInfo"
        stripe
        style="width: 100%"
        height="300"
        v-loading="loading"
      >
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="demand_code" label="需求编号" width="180">
        </el-table-column>
        <el-table-column prop="demand_name" label="需求名称"> </el-table-column>
        <el-table-column prop="type_name" label="需求类型"> </el-table-column>
        <el-table-column prop="release_platform_name" label="发布平台">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="toDeatils(scope.row.demand_id)"
              style="color: #01d59a"
              type="text"
              size="small"
              title="查看详情"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 内容区域 -->
    <div class="centerBox clearfix"  v-loading="blocksLoading">
      <div
        class="blocks"
        v-for="(item, i) in blocks"
        :key="i"
        @click="toDeatils(item.demand_id)"
      >
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
          <span class="status" v-if="item.demand_state == 3">待交稿</span>
          <span class="status" v-else-if="item.demand_state == 4">待审核</span>
          <span class="status" v-else-if="item.demand_state == 5">待上线</span>
          <span class="status" v-else-if="item.demand_state == 6">已完成</span>
        </div>
        <div class="flex-box options-box">
          <div class="profits">预估收益: ￥{{ item.demand_money }}</div>
          <div class="btns" v-if="item.demand_state == 3">上传稿件</div>
          <!-- <div class="btns1">重新上传</div> -->
          <!-- <div class="btns-text border-grey" style="padding:0 28px">删除</div> -->
        </div>
      </div>
    </div>
      <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "needs",
  data() {
    return {
      activeIndex: "",
      // 稿件状态（0未审核，1待审核，2管理员审核通过，3需求方审核通过，4审核未通过，5已结算）
      tabItem: [
        { status: "", value: "全部" },
        { status: "3", value: "待交稿" },
        { status: "4", value: "待审核" },
        { status: "5", value: "待上线" },
        { status: "6", value: "已完成" },
      ],
      blocks: [],
      demand_code: "",
      dialogVisible: false,
      loading: false,
      searchInfo: [],
      infoCount:0,
      page: 1,
      pageSize: 12,
      totalCount: 0,
      blocksLoading:false
    };
  },
  created() {
    this.fetchList(this.page);
  },
  methods: {
    clickTab(status) {
      this.activeIndex = status;
      this.fetchList(this.page);
    },
    async fetchList(page) {
      const that = this;
    this.blocksLoading = true
      let status = sessionStorage.getItem("statusCode");
      var token = sessionStorage.getItem("userName");
      const { data: res } = await this.$http.get(
        `/demandMobileAction/getDemandList?type=${status}&user_code=${token}&demand_state=${this.activeIndex}&offset=${page}&limit=${this.pageSize}`
      );
      if (res.netCode !== 200) {
        this.$message.error("获取列表失败！");
      } else {
        this.totalCount = res.standbyParams.count;
        var templist = res.data;
        if (templist) {
          for (let i = 0; i < templist.length; i++) {
            templist[i].end_date = templist[i].end_date.substr(0, 10);
            templist[i].created_date = this.utils.getDateDiff(
              templist[i].created_date
            );
          }
          that.blocks = templist;
        }
      }
       this.blocksLoading = false
    },
    // 去往需求详情页面
    toDeatils(id) {
      this.$router.push({
        path: "/contractor/needsdetail",
        query: {
          id: id,
        },
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
    // 当用户点击查询的时候
    search() {
      if (this.demand_code.trim() == "") {
        return false;
      }
      this.dialogVisible = true;
      this.loading = true;
      let status = sessionStorage.getItem("statusCode");
      let user_code = sessionStorage.getItem("userName");
      this.$http
        .get(
          `/demandMobileAction/searchDemandList?type=${status}&user_code=${user_code}&demand_code=${this.demand_code}`
        )
        .then((res) => {
          if (res.data.netCode == 200) {
            let templist = res.data.data;
            this.infoCount = res.data.standbyParams.count;
            if (templist) {
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
  },
};
</script>