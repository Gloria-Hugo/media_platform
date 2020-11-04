<template>
  <div id="content-box">
    <div class="changeBar flex-box">
      <div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          text-color="#666666"
          active-text-color="#222"
          active="2"
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
          <span>内容编号 :</span>
          <input
            type="text"
            placeholder="编号查询"
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
    <div class="centerBox clearfix" v-loading="blocksLoading">
      <div v-if="blocks.length">
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

            <span class="fujian hover" v-if="item.demand_annex">
              <i class="iconfont icon-gaojianku"></i>
               稿件
            </span>
          </div>
          <div class="launch-status flex-box">
            <span>{{ item.created_date }}</span>
            <span class="status" v-if="item.demand_state == 5">待上线</span>
            <span class="status" v-if="item.demand_state == 6">已上线</span>
            <span class="status" v-else-if="item.demand_state == 7"
              >已完成</span
            >
          </div>
          <div class="options-box flex-box">
            <div class="profits">预估收益:￥{{ item.channel_money }}</div>
            <div class="btns border-yellow" v-if="item.demand_state == 5">
              处理上线
            </div>
            <!-- <div class="btns1">提醒交稿</div> -->
            <!-- <div class="btns-text">等待客户审稿确认中</div> -->
          </div>
        </div>
      </div>
      <p class="nodata" v-else>暂无数据</p>
    </div>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="totalCount"
      v-if="totalCount!==0"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      blocks: [],
      activeIndex: "",
      tabItem: [
        { status: "", value: "全部" },
        { status: "5", value: "待上线" },
        { status: "6", value: "已上线" },
        { status: "7", value: "已完成" },
      ],
      demand_code: "",
      dialogVisible: false,
      loading: false,
      searchInfo: [],
      infoCount: 0,
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
    // 获取需求列表
    fetchList(page) {
      const that = this;
     this.blocksLoading = true
      let status = sessionStorage.getItem("statusCode");
      that.$http
        .get(
          `/demandMobileAction/getDemandList?type=4&user_code=${sessionStorage.getItem(
            "userName"
          )}&demand_state=${this.activeIndex}&offset=${page}&limit=${
            this.pageSize
          }`
        )
        .then(
          (res) => {
            if (res.data.netCode !== 200) {
              this.$message.error("获取列表失败！");
            } else {
              var templist = res.data.data;
              this.totalCount = res.data.standbyParams.count;
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
          (err) => {
            loading.close();
            that.blocks = [];
          }
        );
    },
    // 去往需求详情页面
    toDeatils(id) {
      this.$router.push({
        path: "/canal/needsdetails",
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
    // 点击tab栏获取不同状态的数据
    clickTab(status) {
      this.activeIndex = status;
      this.fetchList(this.page);
    },
  },
};
</script>
<style lang="less" scoped>
#content-box {
  padding: 0;
}
</style>